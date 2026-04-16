# ppt-maker — Claude 작업 가이드

## 프로젝트 구조 요약

슬라이드 1장 = HTML 파일 1개. `core/` 안의 CSS/JS는 건드리지 않고, 프로젝트 폴더 안에 슬라이드 HTML만 추가한다.

```
[project-name]/
├── slides.json          # 슬라이드 순서
├── slide-01-title.html
└── slide-02-content.html
```

빌드: `node core/build.js --project [project-name]`

---

## 슬라이드 디자인 원칙 (Reveal.js / Slidev / Marp 레퍼런스 기반)

PPT 요청 시 아래 원칙을 반드시 적용한다.

### 1. 한 슬라이드, 한 메시지 (Marp 철학)
- 슬라이드 한 장에 전달할 핵심이 하나여야 한다.
- 텍스트는 줄이고, 여백을 두려워하지 말 것.
- 불릿이 5개 이상이면 슬라이드를 쪼개는 걸 제안한다.

### 2. 타이포그래피로 위계 만들기 (Reveal.js 철학)
- **제목**: `--font-size-h2` 이상, `font-weight-bold` 이상
- **본문**: `--font-size-body` (20px), `line-height-normal` (1.6)
- **보조 텍스트**: `--color-text-muted` 또는 `--color-text-light`
- 강조는 색상(`--color-accent`)으로, 밑줄·대문자 남발 금지
- 자간: 제목은 `letter-spacing-tight`, 본문은 `letter-spacing-normal`

### 3. 그리드 레이아웃 우선 (Slidev 철학)
- 정보가 2개 이상 나열될 땐 `layout-two-col` 또는 CSS Grid 활용
- 카드(`card` 클래스)로 묶어서 시각적 그룹핑
- 비율: 텍스트+이미지면 `ratio-6-4`, 텍스트+수치면 `ratio-4-6`

### 4. 색상은 절제하되 포인트는 명확하게
- 슬라이드 전체에서 `--color-accent`(기본 파란색) 외 추가 색상은 최소화
- 섹션 구분 슬라이드(`layout-section`)는 accent 배경으로 강하게 대비
- 데이터·수치는 accent 색으로 시각 강조

### 5. 여백과 정렬
- 슬라이드 패딩 기본값 `64px 80px` 유지 — 줄이지 말 것
- 관련 요소끼리 `gap: --space-sm` (16px), 섹션 간 `gap: --space-lg` (40px)
- 텍스트 좌정렬 기본, 인용/섹션 슬라이드만 중앙정렬

---

## 레이아웃 선택 기준

| 상황 | 레이아웃 |
|------|----------|
| 발표 첫 슬라이드 | `layout-title` |
| 챕터 구분 | `layout-section` |
| 텍스트 중심 내용 | `layout-content` |
| 좌우 비교 / 텍스트+이미지 | `layout-two-col` |
| 임팩트 있는 한 마디 | `layout-quote` |
| 비주얼 임팩트 | `layout-image` |
| 마지막 슬라이드 | `layout-closing` |

---

## 자주 쓰는 컴포넌트 패턴

```html
<!-- 수치 강조 카드 3개 나열 -->
<div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:var(--space-md);">
  <div class="card" style="text-align:center;">
    <div style="font-size:var(--font-size-display); font-weight:var(--font-weight-black); color:var(--color-accent);">84%</div>
    <div style="font-size:var(--font-size-small); color:var(--color-text-muted);">설명 텍스트</div>
  </div>
  <!-- 반복 -->
</div>

<!-- 타임라인 (좌→우 흐름) -->
<div style="display:flex; gap:var(--space-md); align-items:flex-start;">
  <div style="text-align:center; flex:1;">
    <div class="badge lg">1</div>
    <div style="margin-top:var(--space-sm); font-weight:var(--font-weight-semibold);">단계명</div>
    <div style="font-size:var(--font-size-small); color:var(--color-text-muted);">설명</div>
  </div>
</div>

<!-- 아이콘 없이 callout으로 인사이트 강조 -->
<div class="callout">핵심 인사이트 한 줄</div>
```

---

## 애니메이션 사용 원칙
- 제목: `data-anim="slide-up" data-delay="1"`
- 부제목/본문: `data-anim="fade-in" data-delay="2"`
- 카드 여러 개: 각각 `data-delay="2"`, `"3"`, `"4"` 순차 등장
- 모든 요소에 애니메이션 넣지 말 것 — 주요 요소 3~4개까지만

---

## 새 프로젝트 시작 체크리스트
1. 폴더 생성 + `slides.json` 작성 (포맷: `[{ "file": "...", "title": "..." }]`)
2. 슬라이드 구성: title → section → content × N → closing
3. 섹션 슬라이드로 챕터 나누기 (3~5분 단위)
4. 각 content 슬라이드: 제목 + title-bar + 본문 구조 유지
5. 빌드: `node core/build.js --project [project-name]`
6. `projects.json`에 프로젝트 등록 (아래 완료 워크플로우 참고)
7. 로컬 서버 띄우고 접속 링크 안내

---

## PPT 완성 후 필수 워크플로우

PPT 슬라이드 제작이 완료되면 **반드시** 아래 순서를 따른다.

### 1단계: projects.json 등록

루트의 `projects.json`에 새 프로젝트를 추가한다:

```json
{
  "id": "project-folder-name",
  "name": "표시 이름",
  "description": "한 줄 설명",
  "hasPresentation": true
}
```

`hasPresentation`은 빌드(`dist/presentation.html`)가 존재하면 `true`.

### 2단계: 로컬 서버 확인 및 링크 안내

아래 명령으로 서버가 실행 중인지 확인하고, 없으면 띄운다:

```bash
# 포트 3000 사용 중인지 확인
lsof -ti:3000

# 서버가 없으면 백그라운드로 실행 (루트 디렉토리에서)
node server.js &
```

서버가 준비되면 사용자에게 아래 두 링크를 안내한다:

- **전체 목록**: `http://localhost:3000/`
- **새 PPT 바로보기**: `http://localhost:3000/[project-name]/dist/presentation.html`

---

## 슬라이드 HTML 컨벤션 (Figma 변환 호환을 위해 반드시 준수)

모든 슬라이드는 아래 구조를 따른다. 이를 지켜야 `to-figma-json.js` 파서가 올바르게 추출하고 Figma 플러그인이 정확하게 렌더링한다.

```html
<!-- 슬라이드 element: layout-* + theme-* 반드시 명시 -->
<div class="slide layout-content theme-dark">

  <!-- 표준 element 클래스 사용 -->
  <p class="slide-eyebrow">섹션명</p>        <!-- 상단 소제목 -->
  <h1 class="slide-title">슬라이드 제목</h1>
  <div class="slide-title-bar"></div>

  <div class="slide-body-content">
    <!-- 카드: class="card" 유지 -->
    <!-- 리스트: class="slide-list" + <li> -->
    <!-- 콜아웃: class="callout" -->
    <!-- 이미지 자리: class="img-placeholder" -->
  </div>
</div>
```

**절대 하지 말 것**: 슬라이드 element에 layout-*, theme-* 없이 커스텀 CSS만 사용하는 것.
**이유**: Figma 변환 시 레이아웃 타입을 인식할 수 없어 플레이스홀더만 생성됨.

---

## Figma 변환 워크플로우

사용자가 "피그마로 변환해줘" 또는 유사한 요청을 하면 아래 순서로 작업한다.

### 1단계: 슬라이드 데이터 추출

대상 프로젝트의 모든 슬라이드 HTML을 읽고 아래 **표준 스키마**에 맞춰 JSON을 직접 구성한다.
스크립트 실행 없이 코드로 처리한다.

#### SLIDE_DATA 표준 스키마 (반드시 이 필드명을 사용할 것)

```json
{
  "project": "프로젝트폴더명",
  "slides": [
    {
      "index": 0,
      "file": "slide-01-title.html",
      "layout": "layout-title",
      "theme": "theme-warm",
      "elements": { ... }
    }
  ]
}
```

**레이아웃별 `elements` 필드 명세:**

| 레이아웃 | 필드 |
|---|---|
| `layout-title` | `eyebrow`, `title`, `subtitle`, `meta` |
| `layout-section` | `sectionLabel`, `title`, `desc` |
| `layout-quote` | `quote`, `source` |
| `layout-closing` | `title`, `subtitle`, `chips?: string[]` |
| `layout-content` | `eyebrow?`, `title?` + 아래 본문 타입 중 1개 |
| `layout-two-col` | `eyebrow?`, `title?`, `colTitles?: [string,string]`, `list?`, `cards?` |

**`layout-content` 본문 타입 (택 1):**

```jsonc
// 타입 A-1 — 카드 행 스택 (뱃지 원 + 가로 카드, 3개 이하 권장)
// HTML의 .level-row 패턴과 동일. 아이콘 느낌의 레벨/단계 설명에 사용
{
  "cardLayout": "rows",
  "cards": [
    {
      "badge": "C",           // 뱃지 원 안에 표시할 글자
      "badgeStyle": "accent", // "accent"(채운 원) | "outline"(테두리 원) | "muted"(회색 원)
      "accent": true,         // true면 카드 배경이 accent 색조
      "eyebrow": "레이블",
      "title": "제목",
      "body": "설명"
    }
  ]
}

// 타입 A-2 — 카드 그리드 (1~6개, 자동 배치)
// 하단 칩 띠 추가 가능
{
  "cards": [{ "eyebrow": "레이블", "title": "제목", "body": "설명" }],
  "chips": ["칩1", "칩2"]          // 선택
}

// 타입 B — 수치 강조 + 항목 리스트
{
  "stat": "84%",
  "statLabel": "설명 텍스트",
  "callout": "한 줄 인사이트",     // 선택
  "items": ["항목1", "항목2"]      // 우측 리스트
}

// 타입 C — 흐름 단계 (이미지 플레이스홀더 포함 가능)
// 하단 callout 추가 가능
{
  "steps": [
    { "num": "01", "title": "단계명", "body": "설명", "hasImage": true }
  ],
  "callout": "한 줄 인사이트"      // 선택
}

// 타입 D — 불릿 리스트
{ "list": ["항목1", "항목2"] }

// 타입 E — 콜아웃 단독
{ "callout": "핵심 메시지" }
```

**절대 쓰지 말 것 (구버전 필드명 — 렌더러가 인식 못함):**

| ❌ 구 필드명 | ✅ 표준 필드명 |
|---|---|
| `c.desc`, `c.name`, `c.dept`, `c.task`, `c.label` | `c.body`, `c.title`, `c.eyebrow` |
| `el.quoteText`, `el.quoteSource` | `el.quote`, `el.source` |
| `el.sectionDesc` | `el.desc` |
| `el.listItems` | `el.list` |
| `el.tools` | `el.chips` |
| `el.closingTitle`, `el.closingSubtitle` | `el.title`, `el.subtitle` |

### 2단계: figma-plugin/code.js 업데이트

`figma-plugin/code.js` 상단의 SLIDE_DATA 영역을 찾아 데이터를 주입한다.
반드시 마커 주석 사이의 한 줄만 교체한다:

```javascript
// [SLIDE_DATA_START]
const SLIDE_DATA = { "project": "...", "slides": [...] };
// [SLIDE_DATA_END]
```

### 3단계: 사용자에게 안내

code.js 업데이트 후 아래 내용을 안내한다:

> Figma 앱을 열고, 플러그인 메뉴에서 **ppt-maker → Figma**를 실행하세요.
> 프로젝트 정보가 표시되면 **Generate** 버튼을 클릭하면 슬라이드가 자동 생성됩니다.
> (플러그인이 없다면: Figma → 메뉴 → Plugins → Development → Import plugin from manifest
> → `figma-plugin/manifest.json` 선택)

**주의**: SLIDE_DATA에 들어가는 텍스트는 HTML 태그 없이 순수 텍스트만. 특수문자는 JS 문자열 이스케이프 적용.

---

## Figma 폰트 주의사항

Figma 플러그인(`figma-plugin/code.js`)은 **Noto Sans KR**을 기본 폰트로 사용한다.

- **이유**: Inter는 한글 글리프가 없어 한국어 텍스트가 더블클릭 전까지 표시되지 않음
- **Noto Sans KR**은 Figma에 기본 내장되어 있으며 한글을 즉시 렌더링함
- `F` 객체를 절대 `Inter`로 되돌리지 말 것

사용 중인 폰트 가중치 (Noto Sans KR 기준):
| 용도 | style |
|---|---|
| `reg` | Regular |
| `med`, `semi` | Medium |
| `bold` | Bold |
| `black` | Black |
