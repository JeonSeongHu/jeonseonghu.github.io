---
layout: null
---
// Fuse.js 기반 한국어 지원 검색
let searchData = [];
let fuse;

// Fuse.js 초기화 옵션 (한국어 최적화)
const fuseOptions = {
    keys: [
        { name: 'title', weight: 0.8 },
        { name: 'content', weight: 0.5 },
        { name: 'excerpt', weight: 0.6 },
        { name: 'tags', weight: 0.3 },
        { name: 'categories', weight: 0.3 }
    ],
    threshold: 0.3,     // 0.0 = 완전 일치, 1.0 = 모든 것과 일치
    distance: 100,      // 일치하는 위치까지의 거리
    minMatchCharLength: 2,  // 최소 매치 문자 길이
    includeScore: true,
    includeMatches: true,
    ignoreLocation: true,
    findAllMatches: true
};

// 검색 데이터 로드
async function loadSearchData() {
    try {
        const response = await fetch('/search.json');
        searchData = await response.json();
        fuse = new Fuse(searchData, fuseOptions);
        console.log('검색 인덱스 로드 완료:', searchData.length, '개 문서');
    } catch (error) {
        console.error('검색 데이터 로드 실패:', error);
    }
}

// 검색 실행
function executeSearch(searchTerm) {
    if (!fuse || !searchTerm || searchTerm.trim().length < 2) {
        return [];
    }
    
    const results = fuse.search(searchTerm);
    console.log('검색 결과:', results.length, '개 발견');
    return results;
}

// 검색 결과 표시
function displaySearchResults(results, searchTerm) {
    const resultsContainer = document.querySelector('#search-results');
    const modalTitle = document.getElementById('modtit');
    
    // 제목 업데이트
    modalTitle.innerHTML = `<h5 class='modal-title'>'${searchTerm}' 검색 결과 (${results.length}개)</h5><button type="button" class="close" onclick="closeFuseSearchModal()" aria-label="Close">&times;</button>`;
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <li class='lunrsearchresult' style='text-align: center; padding: 3rem 2rem;'>
                <div style='color: var(--text-medium);'>
                    <h3 style='margin-bottom: 1rem;'>검색 결과가 없습니다</h3>
                    <p>다른 키워드로 검색해보세요.</p>
                    <small style='opacity: 0.7;'>Tip: 더 짧은 키워드나 유사한 단어를 사용해보세요.</small>
                </div>
            </li>
        `;
        return;
    }
    
    const resultHTML = results.map(result => {
        const item = result.item;
        const score = (1 - result.score) * 100; // 점수를 백분율로 변환
        
        // 간단한 검색어 하이라이트 적용
        const highlightedTitle = simpleHighlight(item.title, searchTerm);
        const excerptText = item.excerpt || item.content.substring(0, 150) + '...';
        const highlightedExcerpt = simpleHighlight(excerptText, searchTerm);
        
        return `
            <li class='lunrsearchresult'>
                <a href='${item.url}'>
                    <span class='title'>${highlightedTitle}</span>
                    <span class='match-score' style='color: var(--primary); font-size: 0.8rem; font-weight: 600;'>${Math.round(score)}% 일치</span>
                    
                    <span class='body'>${highlightedExcerpt}</span>
                    
                    <span class='url'>${item.url}</span>
                    ${item.tags.length > 0 ? `<br><span class='tags' style='font-size: 0.7rem; opacity: 0.7;'>태그: ${item.tags.join(', ')}</span>` : ''}
                </a>
            </li>
        `;
    }).join('');
    
    resultsContainer.innerHTML = resultHTML;
}

// 텍스트 하이라이트 함수
function highlightText(text, indices) {
    if (!indices || indices.length === 0) return text;
    
    let result = '';
    let lastIndex = 0;
    
    indices.forEach(([start, end]) => {
        result += text.slice(lastIndex, start);
        result += `<mark style="background-color: rgba(58, 64, 231, 0.2); padding: 1px 3px; border-radius: 3px;">${text.slice(start, end + 1)}</mark>`;
        lastIndex = end + 1;
    });
    
    result += text.slice(lastIndex);
    return result;
}

// 간단한 검색어 하이라이트 함수
function simpleHighlight(text, searchTerm) {
    if (!searchTerm || searchTerm.length < 2) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark style="background-color: rgba(58, 64, 231, 0.2); padding: 1px 3px; border-radius: 3px;">$1</mark>');
}

// 검색 실행
function fuseSearch(searchTerm, event) {
    // 기본 동작 방지 (form submit, page reload 등)
    if (event && event.preventDefault) {
        event.preventDefault();
    }
    
    if (!searchTerm || searchTerm.trim().length < 2) {
        alert('검색어는 2글자 이상 입력해주세요.');
        return false;
    }
    
    // 모달 표시
    $('#lunrsearchresults').addClass('show');
    $("body").addClass("modal-open");
    
    // 모달 HTML 생성
    document.getElementById('lunrsearchresults').innerHTML = `
        <div id="resultsmodal" class="modal-dialog shadow-lg" role="document">
            <div class="modal-content">
                <div class="modal-header" id="modtit">
                    <h5 class='modal-title'>검색 중...</h5>
                    <button type="button" class="close" onclick="closeFuseSearchModal()" aria-label="Close">&times;</button>
                </div>
                <div class="modal-body">
                    <ul class="mb-0" id="search-results"></ul>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-close-search" onclick="closeFuseSearchModal()">닫기</button>
                </div>
            </div>
        </div>
    `;
    
    // 모달 이벤트 설정 (모달 생성 후)
    setTimeout(() => {
        // 배경 클릭으로 모달 닫기
        $("#lunrsearchresults").off('click').on('click', function(e) {
            if (e.target === this) {
                closeFuseSearchModal();
            }
        });
        
        // 모달 다이얼로그 클릭 시 이벤트 전파 방지
        $("#resultsmodal").off('click').on('click', function(e) {
            e.stopPropagation();
        });
    }, 100);
    
    // 검색 실행
    const results = executeSearch(searchTerm.trim());
    displaySearchResults(results, searchTerm);
    
    return false;
}

// 모달 닫기
function closeFuseSearchModal() {
    $('#lunrsearchresults').removeClass('show');
    $("body").removeClass("modal-open");
    document.getElementById('lunrsearch').value = '';
}

// 페이지 로드 시 검색 데이터 로드
document.addEventListener('DOMContentLoaded', function() {
    loadSearchData();
    
    // ESC 키로 모달 닫기 (전역 이벤트)
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape' && $('#lunrsearchresults').hasClass('show')) {
            closeFuseSearchModal();
        }
    });
}); 