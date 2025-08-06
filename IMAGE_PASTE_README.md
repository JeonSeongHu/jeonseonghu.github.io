# 🖼️ Jekyll 이미지 자동 붙여넣기

클립보드의 이미지를 자동으로 Jekyll 블로그의 `assets/images` 폴더에 저장하고 마크다운 경로를 생성하는 자동화 도구입니다.

## 🚀 설치 & 설정

### 1. Node.js 의존성 설치
```bash
npm install
```

### 2. WSL2 환경에서 클립보드 접근 설정 (WSL 사용자만)
```bash
# xclip 설치
sudo apt update
sudo apt install xclip

# WSL과 Windows 클립보드 연동 확인
echo "test" | clip.exe
```

## 📖 사용법

### 방법 1: 키보드 단축키 사용 (추천)
1. 이미지를 클립보드에 복사 (스크린샷, 복사 등)
2. VS Code에서 마크다운 파일 열기
3. `Ctrl + Alt + V` 누르기
4. 자동으로 이미지 저장 + 마크다운 경로가 클립보드에 복사됨
5. `Ctrl + V`로 붙여넣기

### 방법 2: 터미널에서 직접 실행
```bash
npm run paste
```

### 방법 3: VS Code Command Palette
1. `Ctrl + Shift + P`
2. "Tasks: Run Task" 검색
3. "Paste Image" 선택

## 📁 파일 구조

```
jeonseonghu.github.io/
├── assets/images/           # 이미지가 저장되는 폴더
├── paste-image.js          # 메인 스크립트
├── package.json            # Node.js 설정
├── .vscode/
│   ├── tasks.json         # VS Code 작업 설정
│   └── keybindings.json   # 키보드 단축키 설정
└── _posts/
    └── *.md               # 블로그 포스트들
```

## ⚡ 작동 원리

1. **이미지 저장**: 클립보드의 이미지를 `assets/images/image-[timestamp].png`로 저장
2. **경로 생성**: Jekyll 형식으로 마크다운 경로 생성: `![Image]({{ site.baseurl }}/assets/images/파일명)`
3. **클립보드 복사**: 생성된 마크다운 경로를 클립보드에 복사

## 🛠️ 트러블슈팅

### WSL2에서 클립보드 접근 안 될 때:
```bash
# Windows와 WSL 클립보드 연동 확인
which clip.exe
# 만약 없다면 PATH에 추가 필요
```

### 권한 오류가 날 때:
```bash
chmod +x paste-image.js
```

## 🎨 커스터마이징

`paste-image.js`에서 다음을 수정할 수 있습니다:
- 파일명 형식 (`generateFileName` 함수)
- 저장 경로
- 마크다운 템플릿 형식 