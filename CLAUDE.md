# ppt-maker — Claude 작업 가이드

## 프로젝트 구조

```
ppt-maker/
├── PPTs/                    # 모든 발표 프로젝트 폴더
│   └── [project-name]/
│       ├── slides.json
│       ├── slide-01-title.html
│       └── dist/presentation.html
├── core/                    # CSS/JS 시스템 (건드리지 말 것)
├── figma-plugin/            # Figma 플러그인
├── docs/                    # 작업 가이드 (필요 시 읽을 것)
│   ├── guide-design.md      # 디자인 원칙, 레이아웃, 컴포넌트 패턴
│   └── guide-figma.md       # Figma 변환 절차 및 SLIDE_DATA 스키마
├── index.html               # 프로젝트 목록 UI
├── server.js                # 개발 서버
└── projects.json            # 프로젝트 메타데이터
```

슬라이드 1장 = HTML 파일 1개. `core/` 안의 CSS/JS는 건드리지 않는다.

---

## 새 프로젝트 시작 체크리스트

> PPT 제작 요청 시 `docs/guide-design.md` 를 먼저 읽는다.

1. `PPTs/[project-name]/` 폴더 생성 + `slides.json` 작성
2. 슬라이드 구성: title → section → content × N → closing
3. 각 슬라이드 HTML의 CSS 경로: `../../core/theme.css` (PPTs/ 하위이므로 2단계 상위)
4. 빌드: `node core/build.js --project [project-name]`
5. `projects.json`에 프로젝트 등록
6. 서버 확인 후 링크 안내

---

## PPT 완성 후 필수 워크플로우

### 1단계: projects.json 등록

```json
{
  "id": "project-folder-name",
  "name": "표시 이름",
  "description": "한 줄 설명",
  "hasPresentation": true
}
```

### 2단계: 서버 확인 및 링크 안내

```bash
lsof -ti:3000          # 실행 중 확인
node server.js &       # 없으면 실행
```

- **전체 목록**: `http://localhost:3000/`
- **새 PPT**: `http://localhost:3000/PPTs/[project-name]/dist/presentation.html`

---

## Figma 변환

> `docs/guide-figma.md` 를 읽고 따른다.

요약: 슬라이드 HTML 읽기 → SLIDE_DATA JSON 구성 → `figma-plugin/code.js` 의 `[SLIDE_DATA_START]`~`[SLIDE_DATA_END]` 사이 교체 → 사용자에게 Figma 플러그인 실행 안내.
