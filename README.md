# ppt-maker

Claude Code로 구동하는 HTML 기반 프레젠테이션 제작 시스템.  
PDF나 문서를 업로드하면 Claude Code가 내용을 파악해 슬라이드를 자동 생성합니다.

---

## 주요 기능

### 🧠 PPT 자동 생성

PDF, 워드, 텍스트 메모 등 무엇이든 Claude Code에 올리면 슬라이드로 변환됩니다.  
테마·장수·구성 방식은 자연어로 요청하면 됩니다.

```
"첨부한 사업계획서 보고 IR 덱 만들어줘. theme-dark, 10장 내외로."
"팀 공유용 발표자료야. 따뜻한 느낌으로 7장 만들어줘."
```

슬라이드 1장 = HTML 파일 1개. Claude Code가 자동으로:
- 프로젝트 폴더 + 슬라이드 HTML 생성
- 디자인 시스템(테마·레이아웃) 적용
- 로컬 서버 실행 후 바로 볼 수 있는 링크 안내

**5가지 내장 테마** — `theme-dark` / `theme-tech` / `theme-minimal` / `theme-warm` / 기본 화이트  
각 테마는 배경·텍스트·강조색·폰트를 한 번에 바꿉니다.

---

### ✏️ 온라인 편집 + PDF 추출

브라우저에서 슬라이드를 보면서 바로 편집하고, PDF로 내보낼 수 있습니다.

**인라인 편집기** (`E` 키로 진입)
- 텍스트 클릭 → 바로 수정
- 서식 (굵기·기울임·색상·크기·정렬) 툴바 제공
- **Ctrl+S** 로 저장 — 새로고침해도 내용 유지 (localStorage 기반)
- 실행 취소 / 다시 실행 (Ctrl+Z / Ctrl+Y)
- ✕ 초기화 버튼으로 원본 HTML로 되돌리기

**PDF 내보내기** (`Ctrl+P` 또는 📄 PDF 버튼)
- 편집 UI 숨기고 슬라이드만 인쇄 레이아웃으로 전환
- 애니메이션 요소를 인쇄 전 opacity:1 로 강제 리셋 (내용이 투명하게 찍히는 문제 해결)
- 브라우저 인쇄 대화상자 → PDF로 저장 → 가로 방향 권장

**빌드 (단일 파일 배포)**
```bash
node core/build.js --project [프로젝트명]
# → [프로젝트명]/dist/presentation.html  (모든 슬라이드 합본)
```

---

### 🎨 Figma 변환 및 직접 수정

이미지·일러스트 삽입, 세밀한 디자인 조정이 필요할 때 슬라이드 전체를 Figma로 내보낼 수 있습니다.

```
"[프로젝트명] 피그마로 변환해줘"
```

Claude Code가 슬라이드 내용을 읽어 `figma-plugin/code.js` 를 자동 업데이트하면:

1. **Figma 앱** 열기
2. **Plugins → ppt-maker → Figma** 실행
3. 프로젝트명·슬라이드 수 확인 후 **Generate** 클릭
4. 1280×720 프레임으로 슬라이드 전체 자동 생성

Figma에서 생성되는 요소들:
- 텍스트 레이어 (편집 가능, 한글 즉시 렌더링 — Noto Sans KR 사용)
- 카드·칩·뱃지·플레이스홀더 등 컴포넌트
- 테마 색상을 그대로 반영한 배경·강조 요소

이후 Figma에서 이미지 플레이스홀더를 실제 사진으로 교체하거나,  
세부 레이아웃을 조정한 뒤 PDF 또는 공유 링크로 내보내면 완성입니다.

> 플러그인 최초 등록: Figma → Plugins → Development → Import plugin from manifest → `figma-plugin/manifest.json`

---

## 시작하기

```bash
git clone https://github.com/murung-dowon/murung-ppt-maker.git
cd murung-ppt-maker
node server.js
```

브라우저에서 `http://localhost:3000/` 열면 전체 발표자료 목록 확인 가능.  
별도 설치 없음. Node.js 18 이상 필요.

---

## 전체 흐름

```
PDF / 문서 업로드
        ↓
Claude Code → 슬라이드 자동 생성 (테마 적용)
        ↓
브라우저에서 확인 + 피드백 반복
        ↓
        ├─ 브라우저에서 직접 편집 (E 키)
        │       ↓ Ctrl+S 저장 · Ctrl+P PDF 추출
        │
        └─ Figma 변환 요청
                ↓
            Figma에서 이미지 삽입 + 최종 마무리
```

터미널을 만질 일 없습니다. Claude Code에 말로 요청하고, 브라우저와 Figma만 열면 됩니다.

---

## 레퍼런스

### 디자인 테마

| 테마 | 느낌 | 어울리는 상황 |
|---|---|---|
| 기본 (없음) | 클린 화이트 | 일반 사내 발표 |
| `theme-dark` | 테크 다크 | IR, 기술 발표 |
| `theme-tech` | 딥 네이비 | SaaS, 개발자 대상 |
| `theme-minimal` | 에디토리얼 세리프 | 브랜드, 전략 문서 |
| `theme-warm` | 크림/앰버 | 팀 공유, 소비자향 |

### 레이아웃 클래스

| 클래스 | 용도 |
|---|---|
| `layout-title` | 발표 첫 슬라이드 |
| `layout-section` | 챕터 구분 (accent 배경) |
| `layout-content` | 제목 + 본문 / 카드 그리드 / 스텝 플로우 |
| `layout-two-col` | 좌우 2단 분할 |
| `layout-quote` | 인용구 임팩트 |
| `layout-image` | 전체 이미지 + 캡션 |
| `layout-closing` | 마지막 슬라이드 |

### 편집기 단축키

| 단축키 | 기능 |
|---|---|
| `E` | 편집 모드 토글 |
| `Ctrl+S` | 변경사항 저장 |
| `Ctrl+Z` | 실행취소 |
| `Ctrl+Y` | 다시실행 |
| `Ctrl+P` | PDF 저장 |

### 프로젝트 구조

```
ppt-maker/
├── core/
│   ├── theme.css              # 디자인 시스템 (CSS 변수 + 테마 5종)
│   ├── slide-base.css         # 레이아웃 클래스 + 뷰포트
│   ├── editor.css / editor.js # 브라우저 인라인 편집기
│   ├── nav.js                 # 키보드 네비게이션
│   └── build.js               # 단일 HTML 빌드
│
├── figma-plugin/              # Figma 플러그인
│   ├── manifest.json
│   ├── code.js                # Claude Code가 SLIDE_DATA 자동 업데이트
│   └── ui.html
│
└── [project-name]/
    ├── slides.json
    ├── slide-01-title.html
    └── dist/
        └── presentation.html
```
