// ppt-maker → Figma Plugin
// Claude Code가 아래 SLIDE_DATA를 프로젝트 데이터로 업데이트한 뒤
// Figma에서 플러그인 실행 → Generate 버튼 한 번으로 슬라이드 생성

// ─── SLIDE_DATA (Claude Code가 자동 업데이트하는 영역) ──────────────────────
// [SLIDE_DATA_START]
const SLIDE_DATA = {"project":"engelbart-abc-work","slides":[{"index":0,"file":"slide-01-title.html","layout":"layout-title","theme":"","elements":{"eyebrow":"Douglas Engelbart Framework","title":"더글러스 엥겔바트의 작업 구분 3단계","subtitle":"A 작업 · B 작업 · C 작업 — 우리는 어디에 서 있는가"}},{"index":1,"file":"slide-02-overview.html","layout":"layout-content","theme":"","elements":{"eyebrow":"Douglas Engelbart","title":"작업은 3개 층위로 나뉜다","steps":[{"num":"A","title":"본업 수행","body":"각자 맡은 일을 알아서 잘 하는 것. 기획·개발·마케팅·영업·운영 등 실무 그 자체.","hasImage":true},{"num":"B","title":"방식 개선","body":"A 작업을 더 잘할 수 있도록 방식을 설계하는 일. 자동화·템플릿·협업 도구 도입.","hasImage":true},{"num":"C","title":"체계 구축","body":"B 작업을 지속적으로 할 수 있는 구조를 만드는 일. 조직이 스스로 발전하는 체계.","hasImage":true}],"callout":"대부분의 조직은 A에만 집중한다. B·C가 없으면 성장의 천장이 생긴다."}},{"index":2,"file":"slide-03-a-work.html","layout":"layout-content","theme":"","elements":{"eyebrow":"A 작업","title":"개인이 원래 해야 하는 일","cards":[{"eyebrow":"사업 기획 / 제품개발 / 경영","body":"회사가 나아갈 방향과 제품을 만드는 핵심 업무"},{"eyebrow":"물류 운영","body":"입출고, 재고 관리, 배송 등 물리적 운영"},{"eyebrow":"마케팅 기획 / 운영 / 성과관리","body":"브랜드 성장과 채널 운영, 수치 기반 성과 추적"},{"eyebrow":"경영지원 / 행정","body":"결재, 계약, 재무, 인사 등 내부 운영 지원"},{"eyebrow":"제품 판매 / 영업","body":"채널 입점, 거래처 관리, 매출 확대"},{"eyebrow":"사무실 이전 / 짐 나르기","body":"팀 전체가 움직여야 하는 일도 A 작업이다"}]}},{"index":3,"file":"slide-04-diagnosis.html","layout":"layout-content","theme":"","elements":{"eyebrow":"현재 진단","title":"우리는 A 작업을 잘 하고 있을까?","stat":"?","statLabel":"10점 만점에 몇 점?","callout":"중요한 건 잘잘못 구분이 아니라 '되게끔 하는 것'","items":["샘플 배송 지연","인쇄물 감리 누락","샘플 패키징 미완","부자재 적치 미비","런칭 일정 지연","마켓 대응 공백","아마존 수출 준비"]}},{"index":4,"file":"slide-05-b-work.html","layout":"layout-content","theme":"","elements":{"eyebrow":"B 작업","title":"일하는 방식을 개선하는 일","cards":[{"eyebrow":"물류","body":"입출고 및 전체 재고 현황 대시보드 구성"},{"eyebrow":"마케팅","body":"성과 현황 및 추이 대시보드 구성"},{"eyebrow":"경영지원","body":"결재 프로세스 재정비, 자금 현황 및 추이 대시보드"},{"eyebrow":"영업","body":"영업 프로세스 재정비, 우선순위 정의"}],"chips":["반복작업 자동화","업무 템플릿 제정","협업 도구 도입","회의 방식 개선"]}},{"index":5,"file":"slide-06-b-action.html","layout":"layout-content","theme":"","elements":{"eyebrow":"B 작업 실행 방안","title":"어떻게 실행할 것인가","cards":[{"eyebrow":"업무 티켓 시스템","body":"모든 업무를 가시화하고 우선순위를 명확히"},{"eyebrow":"업무 자동화","body":"반복 작업을 줄여 핵심 업무 집중 시간 확보"},{"eyebrow":"시스템 개발","body":"맞춤형 내부 도구로 운영 효율 극대화"},{"eyebrow":"일정 관리 / 공유","body":"팀 전체 일정을 투명하게 공유하고 조율"},{"eyebrow":"커뮤니케이션 규칙 제정","body":"채널별 목적과 응답 규칙을 정해 소통 비용 절감"}]}},{"index":6,"file":"slide-07-c-work.html","layout":"layout-content","theme":"","elements":{"eyebrow":"C 작업","title":"우리가 자꾸 발전할 수 있는 체계를 만드는 일","cards":[{"eyebrow":"A","title":"본업 수행","body":"본업을 잘 수행한다"},{"eyebrow":"B","title":"방식 개선","body":"방식을 지속 개선한다"},{"eyebrow":"C","title":"체계 구축","body":"개선 자체를 설계한다"},{"eyebrow":"회고 문화 정착","body":"매 분기 B 작업 성과를 점검하고 다음 개선 과제를 정의"},{"eyebrow":"지식 체계화","body":"노하우·의사결정 맥락을 문서화해 조직 자산으로 축적"}],"chips":["A·B·C 세 층위가 함께 돌아갈 때 — 조직은 스스로 성장한다"]}}]};
// [SLIDE_DATA_END]
// ─────────────────────────────────────────────────────────────────────────────

figma.showUI(__html__, { width: 300, height: 280 });

if (SLIDE_DATA) {
  figma.ui.postMessage({ type: 'ready', project: SLIDE_DATA.project, count: SLIDE_DATA.slides.length });
} else {
  figma.ui.postMessage({ type: 'no-data' });
}

// ─── 상수 ────────────────────────────────────────────────────────────────────
const W = 1280, H = 720, GAP = 120;
const PX = 80, PY = 64;

// ─── 테마 색상표 ─────────────────────────────────────────────────────────────
const THEMES = {
  'default':      { bg:'#ffffff', surface:'#f8f9fa', text:'#1a1a1a', muted:'#6b7280', light:'#9ca3af', accent:'#2563eb', accentBg:'#eff6ff', accentLight:'#dbeafe', border:'#e5e7eb' },
  'theme-dark':   { bg:'#0d0c0a', surface:'#1a1917', text:'#f0ede8', muted:'#9c9690', light:'#5a5550', accent:'#63b3ed', accentBg:'#1a2a3a', accentLight:'#2a4a6a', border:'#2a2825' },
  'theme-tech':   { bg:'#0f172a', surface:'#1e293b', text:'#f1f5f9', muted:'#94a3b8', light:'#64748b', accent:'#06b6d4', accentBg:'#0c2a32', accentLight:'#164e63', border:'#1e293b' },
  'theme-minimal':{ bg:'#fafaf9', surface:'#f5f5f4', text:'#0a0a0a', muted:'#57534e', light:'#a8a29e', accent:'#0a0a0a', accentBg:'#f5f5f4', accentLight:'#e7e5e4', border:'#e7e5e4' },
  'theme-warm':   { bg:'#fffbeb', surface:'#fef3c7', text:'#1c1917', muted:'#78716c', light:'#a8a29e', accent:'#d97706', accentBg:'#fef3c7', accentLight:'#fde68a', border:'#fde68a' },
};

// ─── 색상 헬퍼 ───────────────────────────────────────────────────────────────
function hex(h) {
  const n = parseInt(h.replace('#',''), 16);
  return { r:((n>>16)&255)/255, g:((n>>8)&255)/255, b:(n&255)/255 };
}

// ─── 폰트 ────────────────────────────────────────────────────────────────────
// Noto Sans KR supports Korean glyphs; Inter does not.
// Using Noto Sans KR as primary to prevent blank text until double-click.
const F = {
  reg:   { family:'Noto Sans KR', style:'Regular' },
  med:   { family:'Noto Sans KR', style:'Medium'  },
  semi:  { family:'Noto Sans KR', style:'Medium'  },
  bold:  { family:'Noto Sans KR', style:'Bold'    },
  black: { family:'Noto Sans KR', style:'Black'   },
  gReg:  { family:'Georgia',      style:'Regular' },
  gBold: { family:'Georgia',      style:'Bold'    },
};

async function loadFonts() {
  // Load Noto Sans KR variants; fall back gracefully if a weight is missing
  await Promise.allSettled(Object.values(F).map(f => figma.loadFontAsync(f)));
}

function fonts(theme) {
  const m = theme === 'theme-minimal';
  return {
    reg:   m ? F.gReg  : F.reg,
    med:   m ? F.gBold : F.med,
    semi:  m ? F.gBold : F.semi,
    bold:  m ? F.gBold : F.bold,
    black: m ? F.gBold : F.black,
  };
}

// ─── 기본 노드 헬퍼 ──────────────────────────────────────────────────────────
let _page = null;

function mkFrame(name, idx, bgHex) {
  const f = figma.createFrame();
  f.name = name; f.resize(W, H);
  f.x = idx * (W + GAP); f.y = 0;
  f.fills = [{ type:'SOLID', color:hex(bgHex) }];
  f.clipsContent = true;
  if (_page) _page.appendChild(f);
  return f;
}

function rct(p, x, y, w, h, fillHex, op=1, r=0, strokeHex=null, sOp=1) {
  const n = figma.createRectangle();
  n.x = x; n.y = y; n.resize(Math.max(w,1), Math.max(h,1));
  n.fills = [{ type:'SOLID', color:hex(fillHex), opacity:op }];
  if (r) n.cornerRadius = r;
  if (strokeHex) {
    n.strokes = [{ type:'SOLID', color:hex(strokeHex), opacity:sOp }];
    n.strokeWeight = 1; n.strokeAlign = 'INSIDE';
  }
  p.appendChild(n); return n;
}

function txt(p, x, y, w, content, size, font, fillHex, op=1, lh=140, tr=-2, align='LEFT') {
  if (!content && content !== 0) return null;
  const t = figma.createText();
  t.fontName = font; t.fontSize = size;
  t.characters = String(content);
  t.fills = [{ type:'SOLID', color:hex(fillHex), opacity:op }];
  t.lineHeight   = { value:lh, unit:'PERCENT' };
  t.letterSpacing = { value:tr, unit:'PERCENT' };
  t.textAlignHorizontal = align;
  if (w) { t.resize(w, 100); t.textAutoResize = 'HEIGHT'; }
  else   { t.textAutoResize = 'WIDTH_AND_HEIGHT'; }
  t.x = x; t.y = y;
  p.appendChild(t); return t;
}

function placeholder(p, x, y, w, h, label='Image') {
  const f = figma.createFrame();
  f.name = `[ ${label} ]`; f.x = x; f.y = y;
  f.resize(Math.max(w,1), Math.max(h,1));
  f.fills   = [{ type:'SOLID', color:hex('#888888'), opacity:0.08 }];
  f.strokes = [{ type:'SOLID', color:hex('#888888'), opacity:0.3  }];
  f.strokeWeight = 1; f.strokeAlign = 'INSIDE';
  f.dashPattern = [6,4]; f.cornerRadius = 8;
  p.appendChild(f); return f;
}

// chips 행 그리기 헬퍼
function drawChips(f, chips, startX, y, C, fn) {
  let cx = startX;
  (chips || []).forEach(chip => {
    const cw = chip.length * 10 + 40;
    rct(f, cx, y, cw, 36, C.surface, 1, 18, C.border, 0.8);
    txt(f, cx+14, y+9, cw-28, chip, 13, fn.med, C.text, 1, 100, 0);
    cx += cw + 10;
  });
}

// ─── 레이아웃 렌더러 ─────────────────────────────────────────────────────────

function renderTitle(f, el, C, fn) {
  // layout-title 전용 패딩: 80px top, 100px sides (slide-base.css 기준)
  const tPX = 100, tPY = 80;
  // 우측 하단 장식 원 — CSS: right:-120 bottom:-120 width:480 height:480
  rct(f, W - 480 + 120, H - 480 + 120, 480, 480, C.accent, 0.08, 240);
  let y = tPY;
  // --font-size-small(16) + letter-spacing-wide(0.05em)
  if (el.eyebrow) { txt(f, tPX, y, W-2*tPX, el.eyebrow, 16, fn.semi, C.accent, 1, 100, 50); y += 40; }
  // --font-size-display(72) + line-height-tight(120%) + letter-spacing-tight(-3%)
  if (el.title) {
    const t = txt(f, tPX, y, 880, el.title, 72, fn.black, C.text, 1, 120, -3);
    y += (t ? t.height : 160) + 40;
  }
  rct(f, tPX, y, 40, 2, C.text, 0.2); y += 24;
  // --font-size-h3(28) + line-height-normal(160%)
  if (el.subtitle) { txt(f, tPX, y, 640, el.subtitle, 28, fn.reg, C.muted, 1, 160, 0); y += 80; }
  // --font-size-small(16)
  if (el.meta)     { txt(f, tPX, y, 400, el.meta, 16, fn.reg, C.muted, 0.7, 100, 0); }
}

function renderSection(f, el, C, fn) {
  f.fills = [{ type:'SOLID', color:hex(C.accent) }];
  const WHITE = '#ffffff';
  // 장식용 대형 글자 (title 첫 글자) — 오른쪽 절반에 배경 장식
  if (el.title) {
    const big = figma.createText();
    big.fontName = fn.black; big.fontSize = 320;
    big.characters = el.title.charAt(0);
    big.fills = [{ type:'SOLID', color:hex(WHITE), opacity:0.08 }];
    big.textAutoResize = 'WIDTH_AND_HEIGHT';
    f.appendChild(big);
    big.x = W/2 - 80; big.y = H/2 - 220;
  }
  // 중앙 배치: x=0, w=W, CENTER 정렬
  let y = H/2 - 72;
  if (el.sectionLabel) {
    const sl = txt(f, 0, y, W, el.sectionLabel, 12, fn.semi, WHITE, 0.7, 100, 18, 'CENTER');
    y += sl ? sl.height + 12 : 24;
  }
  if (el.title) {
    const tt = txt(f, 0, y, W, el.title, 52, fn.bold, WHITE, 1, 120, -2, 'CENTER');
    y += tt ? tt.height + 20 : 72;
  }
  if (el.desc) {
    txt(f, 0, y, W, el.desc, 20, fn.reg, WHITE, 0.75, 160, 0, 'CENTER');
  }
}

function renderContent(f, el, C, fn) {
  // ── 헤더 영역 ──────────────────────────────────────────────────────────────
  let y = PY;
  // --font-size-xs(13) eyebrow, --font-size-h2(38) title
  if (el.eyebrow) { txt(f, PX, y, W-2*PX, el.eyebrow, 13, fn.semi, C.accent, 1, 100, 50); y += 28; }
  if (el.title)   { txt(f, PX, y, W-2*PX, el.title,   38, fn.bold, C.text,   1, 120, -3); y += 56; }
  rct(f, PX, y, 40, 4, C.accent, 1, 99); y += 24;

  const bodyY = y;
  const bodyH = H - bodyY - PY;

  // ── STEPS (흐름 카드 + 이미지 플레이스홀더) ───────────────────────────────
  if (el.steps && el.steps.length) {
    const n = el.steps.length;
    const AW = 28, AG = 8; // 화살표 너비 + 여백
    const stepW = Math.floor((W - 2*PX - (n-1)*(AW + AG*2)) / n);
    const calloutH = el.callout ? 56 : 0;
    const stepsH   = bodyH - calloutH - (calloutH ? 12 : 0);

    el.steps.forEach((step, i) => {
      const sx   = PX + i * (stepW + AW + AG*2);
      const imgH = step.hasImage ? Math.floor(stepsH * 0.42) : 0;
      const cardY = bodyY + imgH;
      const cardH = stepsH - imgH;
      const isLast = i === n - 1;

      if (step.hasImage) placeholder(f, sx, bodyY, stepW, imgH, `이미지 ${i+1}`);

      rct(f, sx, cardY, stepW, cardH,
          isLast ? C.accentBg : C.surface, 1, 12,
          isLast ? C.accent   : C.border,  1);

      let ty = cardY + 20;
      if (step.num) {
        const nt = txt(f, sx+16, ty, stepW-32, step.num, 28, fn.black,
                       isLast ? C.accent : C.muted, 0.5, 100, -2);
        ty += (nt ? nt.height : 36) + 6;
      }
      if (step.title) {
        const tt = txt(f, sx+16, ty, stepW-32, step.title, 20, fn.bold, C.text, 1, 130, -1);
        ty += (tt ? tt.height : 28) + 6;
      }
      if (step.body) txt(f, sx+16, ty, stepW-32, step.body, 16, fn.reg, C.muted, 1, 150, 0);

      // 화살표
      if (i < n-1) {
        const ax = sx + stepW + AG;
        const ay = bodyY + Math.floor(stepsH/2) - 10;
        txt(f, ax, ay, AW, '\u2192', 16, fn.bold, C.accent, 1, 100, 0);
      }
    });

    if (el.callout) {
      const cy = bodyY + stepsH + 12;
      rct(f, PX, cy, W-2*PX, 56, C.accentBg, 1, 8, C.border, 0.5);
      rct(f, PX, cy, 4, 56, C.accent, 1);
      txt(f, PX+20, cy+16, W-2*PX-36, el.callout, 16, fn.semi, C.text, 1, 130, 0);
    }
    return;
  }

  // ── STAT + ITEMS (수치 강조 + 목록) ─────────────────────────────────────
  if (el.stat !== undefined) {
    const colW = Math.floor((W - 2*PX - 48) / 2);
    const rx   = PX + colW + 48;

    // 왼쪽: 수치
    const st = txt(f, PX, y, colW, el.stat, 96, fn.black, C.accent, 1, 100, -4);
    let ly = y + (st ? st.height : 108) + 8;
    if (el.statLabel) {
      txt(f, PX, ly, colW, el.statLabel, 18, fn.reg, C.muted, 1, 140, 0);
      ly += 36;
    }
    if (el.callout) {
      ly += 16;
      rct(f, PX, ly, colW, 64, C.accentBg, 1, 8, C.border, 0.5);
      rct(f, PX, ly, 4, 64, C.accent, 1);
      txt(f, PX+16, ly+14, colW-24, el.callout, 16, fn.semi, C.text, 1, 135, 0);
    }

    // 오른쪽: 항목 리스트
    if (el.items && el.items.length) {
      let iy = y;
      el.items.forEach(item => {
        const iw = W - 2*PX - colW - 48;
        rct(f, rx, iy, iw, 48, C.surface, 1, 8, C.border, 0.6);
        txt(f, rx+16, iy+14, iw-32, item, 16, fn.reg, C.muted, 1, 120, 0);
        iy += 56;
      });
    }
    return;
  }

  // ── CARDS ROWS (뱃지 + 가로 행) — cardLayout: "rows" ────────────────────
  // HTML: .level-row { grid: 56px badge + 1fr card }, badge circle 56px, font h3(28)
  // card: padding md(24) lg(40), label small(16), title h4(22), desc small(16)
  if (el.cards && el.cards.length && el.cardLayout === 'rows') {
    const BADGE = 56, BADGE_GAP = 24;
    const cardW  = W - 2*PX - BADGE - BADGE_GAP;
    const ROW_G  = 16;
    const rowH   = Math.floor((bodyH - ROW_G*(el.cards.length-1)) / el.cards.length);

    el.cards.forEach((c, i) => {
      const ry = bodyY + i*(rowH + ROW_G);
      const bx = PX, cardX = PX + BADGE + BADGE_GAP;
      const badgeCY = ry + rowH/2 - BADGE/2;

      // 뱃지 원
      const bs = c.badgeStyle || 'muted';
      const badgeBg     = bs === 'accent' ? C.accent : C.surface;
      const badgeStroke = bs === 'accent' ? null      : C.border;
      const badgeText   = bs === 'accent' ? '#ffffff' : (bs === 'outline' ? C.accent : C.muted);
      rct(f, bx, badgeCY, BADGE, BADGE, badgeBg, 1, BADGE/2, badgeStroke, 0.8);
      if (c.badge) txt(f, bx, badgeCY + (BADGE-28)/2, BADGE, c.badge, 28, fn.black, badgeText, 1, 100, -2, 'CENTER');

      // 카드 배경
      const isAccent = !!c.accent;
      rct(f, cardX, ry, cardW, rowH, isAccent ? C.accentBg : C.surface, 1, 16,
          isAccent ? C.accentLight : C.border, 0.8);

      // 카드 내용 — 수직 중앙 정렬
      const PAD = 24;
      let ty = ry + PAD;
      if (c.eyebrow) {
        txt(f, cardX+PAD, ty, cardW-PAD*2, c.eyebrow, 13, fn.semi, C.accent, 1, 100, 50);
        ty += 22;
      }
      if (c.title) {
        const tt = txt(f, cardX+PAD, ty, cardW-PAD*2, c.title, 22, fn.bold, C.text, 1, 130, -2);
        ty += (tt ? tt.height : 30) + 8;
      }
      if (c.body) txt(f, cardX+PAD, ty, cardW-PAD*2, c.body, 16, fn.reg, C.muted, 1, 160, 0);
    });
    return;
  }

  // ── CARDS GRID (+ 하단 chips) ─────────────────────────────────────────────
  if (el.cards && el.cards.length) {
    const chipsH    = (el.chips && el.chips.length) ? 52 : 0;
    const cardsAreaH = bodyH - chipsH - (chipsH ? 12 : 0);

    const n      = el.cards.length;
    // 1~3 → 1행, 4~6 → 2행
    const perRow = n <= 3 ? n : Math.ceil(n / 2);
    const rows   = Math.ceil(n / perRow);
    const g      = 16;
    const cw     = Math.floor((W - 2*PX - g*(perRow-1)) / perRow);
    const ch     = Math.floor((cardsAreaH - g*(rows-1)) / rows);

    el.cards.forEach((c, i) => {
      const col = i % perRow;
      const row = Math.floor(i / perRow);
      const cx  = PX + col*(cw+g);
      const cy  = bodyY + row*(ch+g);

      rct(f, cx, cy, cw, ch, C.surface, 1, 12, C.border, 0.8);
      let ty = cy + 24;
      if (c.eyebrow) {
        txt(f, cx+24, ty, cw-48, c.eyebrow, 13, fn.semi, C.accent, 1, 100, 18);
        ty += 22;
      }
      if (c.title) {
        const tt = txt(f, cx+24, ty, cw-48, c.title, 18, fn.bold, C.text, 1, 130, -1);
        ty += (tt ? tt.height : 26) + 6;
      }
      if (c.body) txt(f, cx+24, ty, cw-48, c.body, 15, fn.reg, C.muted, 1, 150, 0);
    });

    // chips 띠
    if (chipsH) {
      const chipY = bodyY + cardsAreaH + 12;
      drawChips(f, el.chips, PX, chipY, C, fn);
    }
    return;
  }

  // ── BULLET LIST ───────────────────────────────────────────────────────────
  if (el.list && el.list.length) {
    el.list.forEach(item => {
      rct(f, PX, y+9, 8, 8, C.accent, 1, 4);
      txt(f, PX+24, y, W-2*PX-24, item, 20, fn.reg, C.text, 1, 160, 0);
      y += 48;
    });
    return;
  }

  // ── CALLOUT ONLY ──────────────────────────────────────────────────────────
  if (el.callout) {
    rct(f, PX, y, W-2*PX, 72, C.accentBg, 1, 8, C.border, 0.5);
    rct(f, PX, y, 4, 72, C.accent, 1);
    txt(f, PX+20, y+22, W-2*PX-32, el.callout, 20, fn.semi, C.text, 1, 140, 0);
    return;
  }

  // ── FALLBACK ──────────────────────────────────────────────────────────────
  placeholder(f, PX, bodyY, W-2*PX, bodyH, 'Content');
}

function renderTwoCol(f, el, C, fn) {
  let y = PY;
  const mid = W/2 - PX/2, cw = mid - PX;
  if (el.eyebrow) { txt(f, PX, y, W-2*PX, el.eyebrow, 13, fn.semi, C.accent, 1, 100, 50); y += 28; }
  if (el.title)   { txt(f, PX, y, W-2*PX, el.title,   38, fn.bold, C.text,   1, 120, -3); y += 56; }
  rct(f, PX, y, 40, 4, C.accent, 1, 99); y += 24;

  const bodyH = H - y - PY;
  const ct = el.colTitles || [];
  const rx = PX + mid;

  if (ct[0]) { txt(f, PX, y, cw, ct[0], 13, fn.semi, C.accent, 1, 100, 10); }
  const lTop = y + (ct[0] ? 28 : 0);
  if (el.list && el.list.length) {
    let ly = lTop;
    el.list.slice(0,5).forEach(item => {
      rct(f, PX, ly+8, 8, 8, C.accent, 1, 4);
      txt(f, PX+20, ly, cw-20, item, 16, fn.reg, C.text, 1, 160, 0);
      ly += 40;
    });
  } else {
    placeholder(f, PX, lTop, cw, bodyH-(ct[0]?28:0), 'Left');
  }

  if (ct[1]) { txt(f, rx, y, cw, ct[1], 13, fn.semi, C.accent, 1, 100, 10); }
  const rTop = y + (ct[1] ? 28 : 0);
  if (el.cards && el.cards.length) {
    let cy = rTop;
    const ch = Math.min((bodyH-(ct[1]?28:0)) / el.cards.length - 12, 120);
    el.cards.slice(0,4).forEach(c => {
      rct(f, rx, cy, cw, ch, C.surface, 1, 10, C.border, 0.8);
      let ty = cy + 18;
      if (c.title) { txt(f, rx+18, ty, cw-36, c.title, 17, fn.semi, C.text,  1, 130, -1); ty += 28; }
      if (c.body)  { txt(f, rx+18, ty, cw-36, c.body,  14, fn.reg,  C.muted, 1, 150,  0); }
      cy += ch + 12;
    });
  } else {
    placeholder(f, rx, rTop, cw, bodyH-(ct[1]?28:0), 'Right');
  }
}

function renderQuote(f, el, C, fn) {
  // layout-quote: padding 80px 120px, text-align center
  // quote-text: --font-size-h2(38), source: --font-size-body(20) + muted
  txt(f, 0, H/2-180, W, '\u201C', 120, fn.bold, C.accent, 0.2, 100, 0, 'CENTER');
  if (el.quote)  txt(f, 120, H/2-60, W-240, el.quote,  38, fn.semi, C.text,  1,   160, -3, 'CENTER');
  if (el.source) txt(f, 120, H/2+100, W-240, el.source, 20, fn.reg,  C.muted, 0.8, 160,  0, 'CENTER');
}

function renderImage(f, el, C, fn) {
  placeholder(f, 0, 0, W, H, 'Full Image');
  if (el.title || el.subtitle) {
    rct(f, 0, H-180, W, 180, '#000000', 0.55);
    if (el.title)    txt(f, PX, H-140, W-2*PX, el.title,    28, fn.bold, '#ffffff', 1,    120, -1);
    if (el.subtitle) txt(f, PX, H-100, W-2*PX, el.subtitle, 16, fn.reg,  '#ffffff', 0.75, 150,  0);
  }
}

function renderClosing(f, el, C, fn) {
  // layout-closing: bg=color-text, text-align center
  // closing-title: --font-size-h1(52) black, closing-subtitle: --font-size-h3(28) light
  f.fills = [{ type:'SOLID', color:hex(C.text) }];
  const W_ = C.bg;
  let y = H/2 - 90;
  if (el.title)    { const t = txt(f, 0, y, W, el.title,    52, fn.black, W_, 1,   120, -3, 'CENTER'); y += (t ? t.height : 74) + 20; }
  if (el.subtitle) { const t = txt(f, 0, y, W, el.subtitle, 28, fn.reg,   W_, 0.55, 160, 0, 'CENTER'); y += (t ? t.height : 40) + 36; }
  // chips — 전체 너비 계산 후 가운데 배치
  if (el.chips && el.chips.length) {
    const chipW   = chip => chip.length * 9 + 40;
    const totalW  = el.chips.reduce((s, c) => s + chipW(c) + 12, -12);
    let cx = Math.max(PX, (W - totalW) / 2);
    el.chips.forEach(chip => {
      const cw = chipW(chip);
      rct(f, cx, y, cw, 40, '#ffffff', 0.08, 20);
      txt(f, cx+16, y+11, cw-32, chip, 14, fn.reg, W_, 0.7, 100, 0);
      cx += cw + 12;
    });
  }
}

function renderSlide(slide, idx) {
  const C  = THEMES[slide.theme] || THEMES['default'];
  const fn = fonts(slide.theme);
  const el = slide.elements || {};
  const label = `${String(idx+1).padStart(2,'0')} \u2014 ${slide.file.replace('.html','')}`;
  const f = mkFrame(label, idx, C.bg);

  switch (slide.layout) {
    case 'layout-title':   renderTitle(f, el, C, fn);   break;
    case 'layout-section': renderSection(f, el, C, fn); break;
    case 'layout-content': renderContent(f, el, C, fn); break;
    case 'layout-two-col': renderTwoCol(f, el, C, fn);  break;
    case 'layout-quote':   renderQuote(f, el, C, fn);   break;
    case 'layout-image':   renderImage(f, el, C, fn);   break;
    case 'layout-closing': renderClosing(f, el, C, fn); break;
    default:               renderContent(f, el, C, fn); break;
  }
}

// ─── 메시지 핸들러 ───────────────────────────────────────────────────────────
figma.ui.onmessage = async (msg) => {
  if (msg.type !== 'generate') return;
  if (!SLIDE_DATA) {
    figma.ui.postMessage({ error:true, text:'슬라이드 데이터가 없습니다. Claude Code에 피그마 변환을 요청하세요.' });
    return;
  }
  try {
    await loadFonts();
    _page = figma.createPage();
    _page.name = SLIDE_DATA.project || 'ppt-maker';
    for (let i = 0; i < SLIDE_DATA.slides.length; i++) {
      figma.ui.postMessage({ progress:`${i+1} / ${SLIDE_DATA.slides.length}` });
      renderSlide(SLIDE_DATA.slides[i], i);
    }
    figma.viewport.scrollAndZoomIntoView(_page.children);
    figma.ui.postMessage({ done:true, text:`✅ ${SLIDE_DATA.slides.length}개 완료` });
  } catch(e) {
    figma.ui.postMessage({ error:true, text:`오류: ${e.message}` });
  }
};
