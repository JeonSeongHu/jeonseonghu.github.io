#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const clipboardy = require('clipboardy');

// 현재 날짜/시간으로 파일명 생성
function generateFileName() {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
    return `image-${timestamp}.png`;
}

// 클립보드에서 이미지를 저장하는 함수
async function pasteImage() {
    try {
        const fileName = generateFileName();
        const imagePath = path.join(__dirname, 'assets', 'images', fileName);
        
        // 디렉토리가 없으면 생성
        const imageDir = path.dirname(imagePath);
        if (!fs.existsSync(imageDir)) {
            fs.mkdirSync(imageDir, { recursive: true });
        }

        // 클립보드에서 이미지 저장 (macOS/Linux)
        if (process.platform === 'darwin') {
            execSync(`pngpaste "${imagePath}"`);
        } else if (process.platform === 'linux') {
            execSync(`xclip -selection clipboard -t image/png -o > "${imagePath}"`);
        } else if (process.platform === 'win32') {
            // PowerShell을 사용하여 클립보드에서 이미지 저장
            const psScript = `
                Add-Type -AssemblyName System.Windows.Forms
                $img = [Windows.Forms.Clipboard]::GetImage()
                if ($img -ne $null) {
                    $img.Save("${imagePath.replace(/\\/g, '/')}", [System.Drawing.Imaging.ImageFormat]::Png)
                    Write-Host "Image saved successfully"
                } else {
                    Write-Host "No image found in clipboard"
                    exit 1
                }
            `;
            execSync(`powershell -command "${psScript}"`);
        }

        // Jekyll 마크다운 경로 생성
        const markdownPath = `![Image]({{ site.baseurl }}/assets/images/${fileName})`;
        
        // 클립보드에 마크다운 경로 복사
        await clipboardy.write(markdownPath);
        
        console.log(`✅ Image saved: ${fileName}`);
        console.log(`📋 Markdown path copied to clipboard: ${markdownPath}`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('💡 Install required dependencies:');
        if (process.platform === 'darwin') {
            console.log('   brew install pngpaste');
        } else if (process.platform === 'linux') {
            console.log('   sudo apt install xclip');
        }
        console.log('   npm install clipboardy');
    }
}

pasteImage(); 