# Figma 변환 가이드

사용자가 "피그마로 변환해줘" 또는 유사한 요청을 하면 이 가이드를 따른다.

---

## 슬라이드 HTML 컨벤션 (Figma 호환 필수)

모든 슬라이드는 아래 구조를 따른다. `layout-*` + `theme-*` 클래스가 없으면 Figma 변환 시 레이아웃을 인식할 수 없어 플레이스홀더만 생성됨.

```html
<div class="slide layout-content theme-dark">
  <p class="slide-eyebrow">섹션명</p>
  <h1 class="slide-title">슬라이드 제목</h1>
  <div class="slide-title-bar"></div>
  <div class="slide-body-content">
    <!-- class="card" / class="slide-list" / class="callout" / class="img-placeholder" -->
  </div>
</div>
```

---

## 변환 절차

### 1단계: 슬라이드 데이터 추출

모든 슬라이드 HTML을 읽고 아래 **표준 스키마**에 맞춰 SLIDE_DATA JSON을 직접 구성한다. 스크립트 실행 없이 코드로 처리한다.

```json
{
  "project": "프로젝트폴더명",
  "slides": [
    {
      "index": 0,
      "file": "slide-01-title.html",
      "layout": "layout-title",
      "theme": "",
      "elements": { ... }
    }
  ]
}
```

**레이아웃별 `elements` 필드:**

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
// 타입 A-1 — 뱃지 + 가로 카드 행 (3개 이하)
{ "cardLayout": "rows", "cards": [{ "badge": "C", "badgeStyle": "accent", "accent": true, "eyebrow": "레이블", "title": "제목", "body": "설명" }] }

// 타입 A-2 — 카드 그리드 (1~6개) + 선택적 칩 띠
{ "cards": [{ "eyebrow": "레이블", "title": "제목", "body": "설명" }], "chips": ["칩1"] }

// 타입 B — 수치 강조 + 항목 리스트
{ "stat": "84%", "statLabel": "설명", "callout": "인사이트", "items": ["항목1"] }

// 타입 C — 흐름 단계 (이미지 플레이스홀더 가능)
{ "steps": [{ "num": "01", "title": "단계명", "body": "설명", "hasImage": true }], "callout": "인사이트" }

// 타입 D — 불릿 리스트
{ "list": ["항목1", "항목2"] }

// 타입 E — 콜아웃 단독
{ "callout": "핵심 메시지" }
```

**절대 쓰지 말 것 (구버전 필드명):**

| ❌ 구 필드명 | ✅ 표준 필드명 |
|---|---|
| `c.desc`, `c.name`, `c.label` | `c.body`, `c.title`, `c.eyebrow` |
| `el.quoteText`, `el.quoteSource` | `el.quote`, `el.source` |
| `el.sectionDesc` | `el.desc` |
| `el.listItems` | `el.list` |
| `el.tools` | `el.chips` |
| `el.closingTitle`, `el.closingSubtitle` | `el.title`, `el.subtitle` |

### 2단계: figma-plugin/code.js 업데이트

마커 주석 사이의 한 줄만 교체한다:

```javascript
// [SLIDE_DATA_START]
const SLIDE_DATA = { "project": "...", "slides": [...] };
// [SLIDE_DATA_END]
```

### 3단계: 사용자 안내

> Figma 앱을 열고, 플러그인 메뉴에서 **ppt-maker → Figma**를 실행하세요.
> 프로젝트 정보가 표시되면 **Generate** 버튼을 클릭하면 슬라이드가 자동 생성됩니다.
> (최초 등록: Figma → Plugins → Development → Import plugin from manifest → `figma-plugin/manifest.json`)

**주의**: SLIDE_DATA 텍스트는 HTML 태그 없이 순수 텍스트만. 특수문자는 JS 이스케이프 적용.

---

## Figma 폰트 주의사항

- 기본 폰트: **Noto Sans KR** (한글 즉시 렌더링)
- Inter는 한글 글리프 없음 — 절대 Inter로 되돌리지 말 것

| 용도 | style |
|---|---|
| `reg` | Regular |
| `med`, `semi` | Medium |
| `bold` | Bold |
| `black` | Black |
