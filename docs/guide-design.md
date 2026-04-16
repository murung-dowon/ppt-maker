# 슬라이드 디자인 가이드

PPT 슬라이드 제작 요청 시 이 가이드를 참고한다.

---

## 디자인 원칙

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

테마 선택:

| 테마 | 느낌 | 어울리는 상황 |
|---|---|---|
| 기본 (없음) | 클린 화이트 | 일반 사내 발표 |
| `theme-dark` | 테크 다크 | IR, 기술 발표 |
| `theme-tech` | 딥 네이비 | SaaS, 개발자 대상 |
| `theme-minimal` | 에디토리얼 | 브랜드, 전략 문서 |
| `theme-warm` | 크림/앰버 | 팀 공유, 소비자향 |

---

## 자주 쓰는 컴포넌트 패턴

```html
<!-- 수치 강조 카드 3개 나열 -->
<div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:var(--space-md);">
  <div class="card" style="text-align:center;">
    <div style="font-size:var(--font-size-display); font-weight:var(--font-weight-black); color:var(--color-accent);">84%</div>
    <div style="font-size:var(--font-size-small); color:var(--color-text-muted);">설명 텍스트</div>
  </div>
</div>

<!-- 타임라인 (좌→우 흐름) -->
<div style="display:flex; gap:var(--space-md); align-items:flex-start;">
  <div style="text-align:center; flex:1;">
    <div class="badge lg">1</div>
    <div style="margin-top:var(--space-sm); font-weight:var(--font-weight-semibold);">단계명</div>
    <div style="font-size:var(--font-size-small); color:var(--color-text-muted);">설명</div>
  </div>
</div>

<!-- 인사이트 강조 -->
<div class="callout">핵심 인사이트 한 줄</div>
```

---

## 애니메이션 사용 원칙
- 제목: `data-anim="slide-up" data-delay="1"`
- 부제목/본문: `data-anim="fade-in" data-delay="2"`
- 카드 여러 개: 각각 `data-delay="2"`, `"3"`, `"4"` 순차 등장
- 모든 요소에 애니메이션 넣지 말 것 — 주요 요소 3~4개까지만
