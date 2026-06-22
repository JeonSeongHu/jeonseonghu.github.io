(function () {
    function range(start, end, step) {
        var values = [];
        for (var x = start; x <= end + 1e-9; x += step) {
            values.push(Number(x.toFixed(3)));
        }
        return values;
    }

    function jointDensity(x, y) {
        var mux = 170;
        var muy = 66;
        var sx = 8.5;
        var sy = 9.0;
        var rho = 0.72;
        var zx = (x - mux) / sx;
        var zy = (y - muy) / sy;
        var q = (zx * zx - 2 * rho * zx * zy + zy * zy) / (2 * (1 - rho * rho));
        return Math.exp(-q);
    }

    function makeControl(root, initialX) {
        var parent = root.parentElement;
        if (!parent || parent.querySelector('.ml-modeling-plot-control')) return null;

        var control = document.createElement('div');
        control.className = 'ml-modeling-plot-control';
        control.innerHTML = [
            '<label for="ml-conditioning-x">조건화할 키 X</label>',
            '<input id="ml-conditioning-x" type="range" min="150" max="190" step="1" value="' + initialX + '">',
            '<output for="ml-conditioning-x">X=' + initialX + '</output>'
        ].join('');

        parent.insertBefore(control, root);
        return control;
    }

    function render() {
        var root = document.getElementById('ml-discriminative-plot');
        if (!root || !window.Plotly) return;

        var xs = range(145, 195, 1);
        var ys = range(40, 100, 1);
        var z = ys.map(function (y) {
            return xs.map(function (x) { return jointDensity(x, y); });
        });
        var maxJoint = z.reduce(function (m, row) {
            return Math.max(m, Math.max.apply(null, row));
        }, 0);

        var sampleX = [156, 162, 165, 169, 172, 176, 180, 184];
        var sampleY = [52, 56, 60, 62, 68, 73, 78, 75];
        var sampleZ = sampleX.map(function (x, i) {
            return jointDensity(x, sampleY[i]) * maxJoint * 0.96;
        });

        function conditionalParts(x0) {
            var conditional = ys.map(function (y) { return jointDensity(x0, y); });
            var maxCond = Math.max.apply(null, conditional);
            var condZ = conditional.map(function (v) { return v / maxCond * maxJoint * 1.08; });
            return {
                x0: x0,
                condZ: condZ,
                sliceX: ys.map(function () { return [x0, x0]; }),
                sliceY: ys.map(function (y) { return [y, y]; }),
                sliceZ: condZ.map(function (v) { return [0, v]; }),
                lineX: ys.map(function () { return x0; })
            };
        }

        function dataFor(x0) {
            var c = conditionalParts(x0);
            return [
                {
                    type: 'surface',
                    name: '파란 표면: 결합분포 P(X,Y)',
                    x: xs,
                    y: ys,
                    z: z,
                    opacity: 0.66,
                    showlegend: true,
                    showscale: false,
                    colorscale: [
                        [0, '#F8FAFC'],
                        [0.45, '#CFE0FF'],
                        [1, '#2F6FEB']
                    ],
                    hovertemplate: '키 %{x:.0f}<br>몸무게 %{y:.0f}<br>P(X,Y) %{z:.2f}<extra></extra>'
                },
                {
                    type: 'surface',
                    name: '옅은 빨강 면: X=' + x0 + ' 단면',
                    x: c.sliceX,
                    y: c.sliceY,
                    z: c.sliceZ,
                    opacity: 0.30,
                    showlegend: true,
                    showscale: false,
                    colorscale: [
                        [0, '#FFF3F3'],
                        [1, '#D94E4E']
                    ],
                    hoverinfo: 'skip'
                },
                {
                    type: 'scatter3d',
                    mode: 'lines',
                    name: '빨간 곡선: P(Y | X=' + x0 + ')',
                    x: c.lineX,
                    y: ys,
                    z: c.condZ,
                    line: { color: '#D94E4E', width: 9 },
                    hovertemplate: 'X=' + x0 + '<br>몸무게 %{y:.0f}<br>relative P(Y|X) %{z:.2f}<extra></extra>'
                },
                {
                    type: 'scatter3d',
                    mode: 'markers',
                    name: '빨간 점: 관측 샘플',
                    x: sampleX,
                    y: sampleY,
                    z: sampleZ,
                    marker: {
                        size: 5.8,
                        color: '#D94E4E',
                        opacity: 0.92,
                        line: { color: '#FFFFFF', width: 1.4 }
                    },
                    hovertemplate: 'sample<br>키 %{x:.0f}<br>몸무게 %{y:.0f}<extra></extra>'
                }
            ];
        }

        function layoutFor(x0) {
            return {
                height: 520,
                margin: { l: 0, r: 0, t: 12, b: 0 },
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                uirevision: 'ml-discriminative',
                showlegend: true,
                legend: {
                    x: 0.02,
                    y: 0.98,
                    bgcolor: 'rgba(255,255,255,0.88)',
                    bordercolor: 'rgba(169,180,196,0.5)',
                    borderwidth: 1,
                    font: { family: 'Paperlogy, Pretendard, system-ui, sans-serif', size: 18, color: '#263241' },
                    itemwidth: 64,
                    itemsizing: 'constant',
                    tracegroupgap: 8
                },
                scene: {
                    xaxis: {
                        title: '키 X',
                        range: [145, 195],
                        gridcolor: '#E5EAF1',
                        zeroline: false,
                        backgroundcolor: '#FFFFFF',
                        titlefont: { size: 16, color: '#3F4654' },
                        tickfont: { size: 13, color: '#667085' }
                    },
                    yaxis: {
                        title: '몸무게 Y',
                        range: [40, 100],
                        gridcolor: '#E5EAF1',
                        zeroline: false,
                        backgroundcolor: '#FFFFFF',
                        titlefont: { size: 16, color: '#3F4654' },
                        tickfont: { size: 13, color: '#667085' }
                    },
                    zaxis: {
                        title: '확률밀도',
                        gridcolor: '#E5EAF1',
                        zeroline: false,
                        showticklabels: false,
                        backgroundcolor: '#FFFFFF',
                        titlefont: { size: 16, color: '#3F4654' },
                        tickfont: { size: 13, color: '#667085' }
                    },
                    camera: {
                        eye: { x: 1.55, y: -1.75, z: 1.12 },
                        center: { x: 0, y: 0, z: -0.08 }
                    },
                    aspectratio: { x: 1.15, y: 1, z: 0.62 },
                    annotations: [
                        {
                            x: x0,
                            y: 53,
                            z: maxJoint * 0.92,
                            text: 'X=' + x0 + '에서 자른 출력 분포',
                            showarrow: true,
                            arrowcolor: '#D94E4E',
                            arrowwidth: 2,
                            font: { size: 15, color: '#D94E4E', family: 'Paperlogy, Pretendard, system-ui, sans-serif' }
                        }
                    ]
                },
                font: {
                    family: 'Paperlogy, Pretendard, system-ui, sans-serif',
                    color: '#3F4654',
                    size: 14
                }
            };
        }

        var config = {
            responsive: true,
            displaylogo: false,
            modeBarButtonsToRemove: ['lasso2d', 'select2d']
        };
        var initialX = 165;
        var control = makeControl(root, initialX);
        var slider = control && control.querySelector('input');
        var output = control && control.querySelector('output');

        window.Plotly.newPlot(root, dataFor(initialX), layoutFor(initialX), config);

        if (slider && output) {
            slider.addEventListener('input', function () {
                var nextX = Number(slider.value);
                output.textContent = 'X=' + nextX;
                window.Plotly.react(root, dataFor(nextX), layoutFor(nextX), config);
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', render);
    } else {
        render();
    }
})();
