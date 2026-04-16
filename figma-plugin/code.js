// ppt-maker → Figma Plugin
// Claude Code가 아래 SLIDE_DATA를 프로젝트 데이터로 업데이트한 뒤
// Figma에서 플러그인 실행 → Generate 버튼 한 번으로 슬라이드 생성

// ─── SLIDE_DATA (Claude Code가 자동 업데이트하는 영역) ──────────────────────
// [SLIDE_DATA_START]
const SLIDE_DATA = {"project":"hufs-opensource-5w","slides":[{"index":0,"file":"slide-01-q1.html","layout":"layout-content","theme":"theme-dark","elements":{"eyebrow":"오픈소스SW 5주차 과제","title":"1번 과제","cardLayout":"rows","cards":[{"badge":"결과","badgeStyle":"accent","eyebrow":"git rm --cached -f 실행 결과","title":"deleted: test.txt","body":"스테이지에서 deleted 마킹 / 워킹 디렉토리는 untracked 상태로 남음"},{"badge":"01","badgeStyle":"accent","eyebrow":"해결 방법 1","title":"git add test.txt","body":"현재 내용으로 다시 스테이지에 등록"},{"badge":"02","badgeStyle":"accent","eyebrow":"해결 방법 2","title":"git restore --staged test.txt","body":"staged의 deleted 취소 → unstaged modified 상태로 복원"}]}},{"index":1,"file":"slide-02-q2.html","layout":"layout-two-col","theme":"theme-dark","elements":{"eyebrow":"오픈소스SW 5주차 과제","title":"2번 과제","colTitles":["Method 01","Method 02"],"cards":[{"eyebrow":"스테이지에서 강제 제거","title":"git rm --cached a.txt","body":"파일은 워킹 디렉토리에 남고, 스테이지에서만 제거됨"},{"eyebrow":"add 취소","title":"git restore --staged a.txt","body":"git add를 취소하여 unstaged 상태로 되돌림"}],"callout":"두 방법 모두 a.txt를 커밋에서 제외할 수 있으나, 이미 추적 중인 파일이면 rm --cached 사용"}},{"index":2,"file":"slide-03-q34.html","layout":"layout-content","theme":"theme-dark","elements":{"eyebrow":"오픈소스SW 5주차 과제","title":"3번 & 4번 과제","steps":[{"num":"03","title":"3번 과제 스크린샷","body":"이미지를 삽입하세요","hasImage":true},{"num":"04","title":"4번 과제 스크린샷","body":"이미지를 삽입하세요","hasImage":true}]}}]};
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

// Auto Layout 텍스트: x/y 없이 부모 프레임에 바로 append
function txtAL(p, w, content, size, font, fillHex, op=1, lh=140, tr=-2, align='LEFT') {
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
  p.appendChild(t); return t;
}

// Auto Layout 프레임 생성
function mkALFrame(name, mode='VERTICAL', spacing=0, pTop=0, pRight=0, pBottom=0, pLeft=0) {
  const f = figma.createFrame();
  f.name = name;
  f.fills = [];
  f.layoutMode = mode;
  f.itemSpacing = spacing;
  f.paddingTop    = pTop;
  f.paddingRight  = pRight;
  f.paddingBottom = pBottom;
  f.paddingLeft   = pLeft;
  f.primaryAxisSizingMode   = 'AUTO';
  f.counterAxisSizingMode   = 'FIXED';
  return f;
}

// Auto Layout 카드 프레임 (크기 고정, 내부 수직 정렬)
function mkCardFrame(name, w, fillHex, op=1, r=12, strokeHex=null, sOp=1, pad=24) {
  const f = figma.createFrame();
  f.name = name;
  f.fills = [{ type:'SOLID', color:hex(fillHex), opacity:op }];
  if (r) f.cornerRadius = r;
  if (strokeHex) {
    f.strokes = [{ type:'SOLID', color:hex(strokeHex), opacity:sOp }];
    f.strokeWeight = 1; f.strokeAlign = 'INSIDE';
  }
  f.layoutMode = 'VERTICAL';
  f.itemSpacing = 6;
  f.paddingTop    = pad;
  f.paddingRight  = pad;
  f.paddingBottom = pad;
  f.paddingLeft   = pad;
  f.primaryAxisSizingMode = 'AUTO';
  f.counterAxisSizingMode = 'FIXED';
  f.resize(Math.max(w, 1), 10);
  return f;
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

// 절대좌표 placeholder (Auto Layout 컨테이너 안에서 사용)
function placeholderAL(p, w, h, label='Image') {
  const f = figma.createFrame();
  f.name = `[ ${label} ]`;
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
  const tPX = 100, tPY = 80;
  // 장식 원 (절대좌표 유지)
  rct(f, W - 480 + 120, H - 480 + 120, 480, 480, C.accent, 0.08, 240);

  // 텍스트 컨텐츠 컨테이너: VERTICAL Auto Layout
  const container = mkALFrame('title-content', 'VERTICAL', 0);
  container.x = tPX; container.y = tPY;
  container.resize(W - 2*tPX, 10);
  f.appendChild(container);

  if (el.eyebrow) {
    const ew = txtAL(container, W-2*tPX, el.eyebrow, 16, fn.semi, C.accent, 1, 100, 50);
    if (ew) { ew.layoutGrow = 0; }
  }

  // eyebrow 아래 gap
  if (el.eyebrow) {
    const spacer1 = figma.createFrame();
    spacer1.name = 'spacer'; spacer1.resize(1, 16); spacer1.fills = [];
    container.appendChild(spacer1);
  }

  if (el.title) {
    txtAL(container, 880, el.title, 72, fn.black, C.text, 1, 120, -3);
    const spacer2 = figma.createFrame();
    spacer2.name = 'spacer'; spacer2.resize(1, 32); spacer2.fills = [];
    container.appendChild(spacer2);
  }

  // 구분선 (얇은 직사각형)
  const divider = figma.createFrame();
  divider.name = 'divider'; divider.resize(40, 2);
  divider.fills = [{ type:'SOLID', color:hex(C.text), opacity:0.2 }];
  container.appendChild(divider);

  const spacer3 = figma.createFrame();
  spacer3.name = 'spacer'; spacer3.resize(1, 16); spacer3.fills = [];
  container.appendChild(spacer3);

  if (el.subtitle) txtAL(container, 640, el.subtitle, 28, fn.reg, C.muted, 1, 160, 0);

  if (el.meta) {
    const spacer4 = figma.createFrame();
    spacer4.name = 'spacer'; spacer4.resize(1, 24); spacer4.fills = [];
    container.appendChild(spacer4);
    txtAL(container, 400, el.meta, 16, fn.reg, C.muted, 0.7, 100, 0);
  }
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
    const AW = 24, AG = 6;
    const stepW = Math.floor((W - 2*PX - (n-1)*(AW + AG*2)) / n);
    const codeLines  = el.codeBlock ? el.codeBlock.split('\n').length : 0;
    const calloutH   = el.callout   ? 60  : 0;
    const codeBlockH = el.codeBlock ? Math.max(codeLines * 23 + 28, 80) : 0;
    const extrasH    = calloutH + (calloutH ? 12 : 0) + codeBlockH + (codeBlockH ? 12 : 0);
    const hasAnyImg  = el.steps.some(s => s.hasImage);

    // 이미지 없는 step은 내용 높이 기준으로 상한 설정 (세로 늘어짐 방지)
    const stepsH = hasAnyImg
      ? bodyH - extrasH
      : Math.min(bodyH - extrasH, 220);

    // n >= 4이면 모든 카드 동일한 스타일(isLast 강조 없음), n <= 3이면 마지막 카드 accent
    const useLastAccent = n <= 3 && hasAnyImg;

    el.steps.forEach((step, i) => {
      const sx      = PX + i * (stepW + AW + AG*2);
      const imgH    = step.hasImage ? Math.floor(stepsH * 0.75) : 0;
      const cardY   = bodyY + imgH;
      const cardH   = stepsH - imgH;
      const isLast  = i === n - 1;
      const doAccent = useLastAccent && isLast;

      if (step.hasImage) placeholder(f, sx, bodyY, stepW, imgH, `이미지 ${i+1}`);

      rct(f, sx, cardY, stepW, cardH,
          doAccent ? C.accentBg : C.surface, 1, 12,
          doAccent ? C.accent   : C.border,  1);

      let ty = cardY + 16;
      // 스텝 번호: 원형 배지
      if (step.num !== undefined && step.num !== null) {
        const BADGE = 28;
        rct(f, sx+16, ty, BADGE, BADGE, C.accent, 1, 14);
        txt(f, sx+16, ty + Math.floor((BADGE-16)/2), BADGE, String(step.num), 13, fn.bold, '#ffffff', 1, 100, 0, 'CENTER');
        ty += BADGE + 10;
      }
      if (step.title) {
        const tt = txt(f, sx+16, ty, stepW-32, step.title, 17, fn.bold, C.text, 1, 130, -1);
        ty += (tt ? tt.height : 24) + 6;
      }
      if (step.body) txt(f, sx+16, ty, stepW-32, step.body, 13, fn.reg, C.muted, 1, 150, 0);

      if (i < n-1) {
        const ax = sx + stepW + AG;
        const ay = bodyY + Math.floor(stepsH/2) - 8;
        txt(f, ax, ay, AW, '\u2192', 13, fn.bold, C.accent, 0.7, 100, 0);
      }
    });

    let extraY = bodyY + stepsH + 12;

    // codeBlock: 다크 코드 블록 렌더링 (줄 수에 따라 높이 자동 계산)
    if (el.codeBlock) {
      rct(f, PX, extraY, W-2*PX, codeBlockH, '#1e293b', 1, 8);
      txt(f, PX+24, extraY+14, W-2*PX-48, el.codeBlock, 13, fn.semi, '#7dd3fc', 1, 175, 0);
      extraY += codeBlockH + 12;
    }

    if (el.callout) {
      rct(f, PX, extraY, W-2*PX, calloutH, C.accentBg, 1, 8, C.border, 0.5);
      rct(f, PX, extraY, 4, calloutH, C.accent, 1);
      txt(f, PX+20, extraY+18, W-2*PX-36, el.callout, 16, fn.semi, C.text, 1, 130, 0);
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
  if (el.cards && el.cards.length && el.cardLayout === 'rows') {
    const BADGE = 56, BADGE_GAP = 24;
    const cardW = W - 2*PX - BADGE - BADGE_GAP;
    const ROW_G = 16;

    // 행 컨테이너: Auto Layout VERTICAL
    const rowsContainer = mkALFrame('rows', 'VERTICAL', ROW_G);
    rowsContainer.resize(W - 2*PX, 10);
    rowsContainer.x = PX; rowsContainer.y = bodyY;
    f.appendChild(rowsContainer);

    el.cards.forEach((c, i) => {
      // 각 행: HORIZONTAL Auto Layout (뱃지 + 카드)
      const rowFrame = mkALFrame(`row-${i}`, 'HORIZONTAL', BADGE_GAP);
      rowFrame.counterAxisAlignItems = 'CENTER';
      rowFrame.primaryAxisSizingMode = 'FIXED';
      rowFrame.counterAxisSizingMode = 'AUTO';
      rowFrame.resize(W - 2*PX, 10);
      rowsContainer.appendChild(rowFrame);

      // 뱃지 원 (절대 크기 고정 프레임으로 표현)
      const bs = c.badgeStyle || 'muted';
      const badgeBg   = bs === 'accent' ? C.accent : C.surface;
      const badgeStroke = bs === 'accent' ? null : C.border;
      const badgeText = bs === 'accent' ? '#ffffff' : (bs === 'outline' ? C.accent : C.muted);
      const badgeFrame = figma.createFrame();
      badgeFrame.name = 'badge';
      badgeFrame.resize(BADGE, BADGE);
      badgeFrame.cornerRadius = BADGE / 2;
      badgeFrame.fills = [{ type:'SOLID', color:hex(badgeBg) }];
      if (badgeStroke) {
        badgeFrame.strokes = [{ type:'SOLID', color:hex(badgeStroke), opacity:0.8 }];
        badgeFrame.strokeWeight = 1; badgeFrame.strokeAlign = 'INSIDE';
      }
      badgeFrame.layoutMode = 'VERTICAL';
      badgeFrame.primaryAxisAlignItems = 'CENTER';
      badgeFrame.counterAxisAlignItems = 'CENTER';
      badgeFrame.primaryAxisSizingMode = 'FIXED';
      badgeFrame.counterAxisSizingMode = 'FIXED';
      rowFrame.appendChild(badgeFrame);
      if (c.badge) txtAL(badgeFrame, null, c.badge, 28, fn.black, badgeText, 1, 100, -2, 'CENTER');

      // 카드 프레임 (Auto Layout)
      const isAccent = !!c.accent;
      const cardFrame = mkCardFrame(`card-${i}`, cardW,
        isAccent ? C.accentBg : C.surface, 1, 16,
        isAccent ? C.accentLight : C.border, 0.8, 24);
      rowFrame.appendChild(cardFrame);
      if (c.eyebrow) txtAL(cardFrame, cardW-48, c.eyebrow, 13, fn.semi, C.accent, 1, 100, 50);
      if (c.title)   txtAL(cardFrame, cardW-48, c.title,   22, fn.bold, C.text,   1, 130, -2);
      if (c.body)    txtAL(cardFrame, cardW-48, c.body,    16, fn.reg,  C.muted,  1, 160,  0);
    });
    return;
  }

  // ── CARDS GRID (+ 하단 chips) ─────────────────────────────────────────────
  if (el.cards && el.cards.length) {
    const n      = el.cards.length;
    const perRow = n <= 3 ? n : Math.ceil(n / 2);
    const g      = 16;
    const cw     = Math.floor((W - 2*PX - g*(perRow-1)) / perRow);

    // 그리드 컨테이너: HORIZONTAL wrap 역할을 VERTICAL rows로 구현
    // 행별로 HORIZONTAL Auto Layout 프레임 생성
    const gridContainer = mkALFrame('grid', 'VERTICAL', g);
    gridContainer.resize(W - 2*PX, 10);
    gridContainer.x = PX; gridContainer.y = bodyY;
    gridContainer.primaryAxisSizingMode = 'AUTO';
    f.appendChild(gridContainer);

    // 행 단위로 그룹화
    for (let r = 0; r < Math.ceil(n / perRow); r++) {
      const rowFrame = mkALFrame(`grid-row-${r}`, 'HORIZONTAL', g);
      rowFrame.primaryAxisSizingMode = 'FIXED';
      rowFrame.counterAxisSizingMode = 'AUTO';
      rowFrame.resize(W - 2*PX, 10);
      gridContainer.appendChild(rowFrame);

      for (let c = 0; c < perRow; c++) {
        const idx = r * perRow + c;
        if (idx >= n) break;
        const card = el.cards[idx];
        const cardFrame = mkCardFrame(`card-${idx}`, cw, C.surface, 1, 12, C.border, 0.8, 24);
        rowFrame.appendChild(cardFrame);
        if (card.eyebrow) txtAL(cardFrame, cw-48, card.eyebrow, 13, fn.semi, C.accent, 1, 100, 18);
        if (card.title)   txtAL(cardFrame, cw-48, card.title,   18, fn.bold, C.text,   1, 130, -1);
        if (card.body)    txtAL(cardFrame, cw-48, card.body,    15, fn.reg,  C.muted,  1, 150,  0);
      }
    }

    // chips 띠
    if (el.chips && el.chips.length) {
      const chipsY = gridContainer.y + gridContainer.height + 12;
      drawChips(f, el.chips, PX, chipsY, C, fn);
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
  const gap = 20;
  const colW = Math.floor((W - 2*PX - gap) / 2);
  const rx = PX + colW + gap;
  const ct = el.colTitles || [];

  if (el.eyebrow) { txt(f, PX, y, W-2*PX, el.eyebrow, 13, fn.semi, C.accent, 1, 100, 50); y += 28; }
  if (el.title)   { txt(f, PX, y, W-2*PX, el.title,   38, fn.bold, C.text,   1, 120, -3); y += 56; }
  rct(f, PX, y, 40, 4, C.accent, 1, 99); y += 24;

  const calloutH = el.callout ? 60 : 0;
  const bodyH = H - y - PY - (calloutH ? calloutH + 12 : 0);

  // ── 컬럼 컨테이너: HORIZONTAL Auto Layout ────────────────────────────────
  const colsContainer = mkALFrame('cols', 'HORIZONTAL', gap);
  colsContainer.primaryAxisSizingMode = 'FIXED';
  colsContainer.counterAxisSizingMode = 'AUTO';
  colsContainer.resize(W - 2*PX, 10);
  colsContainer.x = PX; colsContainer.y = y;
  f.appendChild(colsContainer);

  // ── 2장 카드 → 좌/우 분할 렌더링 ────────────────────────────────────────────
  if (el.cards && el.cards.length === 2 && !el.list) {
    const CARD_STYLES = [
      { bg: '#fff5f5', border: '#fca5a5', labelColor: '#dc2626' },
      { bg: '#eff6ff', border: '#bfdbfe', labelColor: C.accent  },
    ];
    el.cards.forEach((c, i) => {
      const cs = CARD_STYLES[i];
      const colTitle = ct[i];

      // 컬럼 wrapper (VERTICAL)
      const colWrap = mkALFrame(`col-${i}`, 'VERTICAL', 8);
      colWrap.primaryAxisSizingMode = 'AUTO';
      colWrap.counterAxisSizingMode = 'FIXED';
      colWrap.resize(colW, 10);
      colsContainer.appendChild(colWrap);

      if (colTitle) txtAL(colWrap, colW, colTitle, 13, fn.semi, cs.labelColor, 1, 100, 10);

      // 카드 Auto Layout
      const cardFrame = mkCardFrame(`card-${i}`, colW, cs.bg, 1, 12, cs.border, 1, 20);
      cardFrame.itemSpacing = 10;
      colWrap.appendChild(cardFrame);

      if (c.eyebrow) txtAL(cardFrame, colW-40, c.eyebrow, 13, fn.semi, cs.labelColor, 1, 100, 10);
      if (c.title)   txtAL(cardFrame, colW-40, c.title,   22, fn.bold, C.text,        1, 130, -1);
      if (c.body)    txtAL(cardFrame, colW-40, c.body,    15, fn.reg,  C.muted,       1, 160,  0);
      if (c.code) {
        const codeFrame = figma.createFrame();
        codeFrame.name = 'code'; codeFrame.resize(colW-40, 56);
        codeFrame.fills = [{ type:'SOLID', color:hex('#1e293b') }];
        codeFrame.cornerRadius = 8;
        codeFrame.layoutMode = 'VERTICAL';
        codeFrame.paddingTop = 10; codeFrame.paddingLeft = 16; codeFrame.paddingRight = 16; codeFrame.paddingBottom = 10;
        codeFrame.primaryAxisSizingMode = 'AUTO';
        codeFrame.counterAxisSizingMode = 'FIXED';
        cardFrame.appendChild(codeFrame);
        txtAL(codeFrame, colW-72, c.code, 14, fn.semi, '#7dd3fc', 1, 160, 0);
      }
    });
  } else {
    // ── 원래 동작: 왼쪽=list, 오른쪽=cards ────────────────────────────────────

    // 왼쪽 컬럼
    const leftCol = mkALFrame('left-col', 'VERTICAL', 8);
    leftCol.primaryAxisSizingMode = 'AUTO';
    leftCol.counterAxisSizingMode = 'FIXED';
    leftCol.resize(colW, 10);
    colsContainer.appendChild(leftCol);

    if (ct[0]) txtAL(leftCol, colW, ct[0], 13, fn.semi, C.accent, 1, 100, 10);
    if (el.list && el.list.length) {
      el.list.slice(0,5).forEach(item => {
        // bullet item: HORIZONTAL AL
        const bulletRow = mkALFrame('bullet', 'HORIZONTAL', 12);
        bulletRow.primaryAxisSizingMode = 'FIXED';
        bulletRow.counterAxisSizingMode = 'AUTO';
        bulletRow.counterAxisAlignItems = 'MIN';
        bulletRow.resize(colW, 10);
        leftCol.appendChild(bulletRow);
        const dot = figma.createFrame();
        dot.name = 'dot'; dot.resize(8, 8);
        dot.cornerRadius = 4;
        dot.fills = [{ type:'SOLID', color:hex(C.accent) }];
        dot.layoutGrow = 0;
        bulletRow.appendChild(dot);
        txtAL(bulletRow, colW-20, item, 16, fn.reg, C.text, 1, 160, 0);
      });
    } else {
      placeholderAL(leftCol, colW, 200, 'Left');
    }

    // 오른쪽 컬럼
    const rightCol = mkALFrame('right-col', 'VERTICAL', 12);
    rightCol.primaryAxisSizingMode = 'AUTO';
    rightCol.counterAxisSizingMode = 'FIXED';
    rightCol.resize(colW, 10);
    colsContainer.appendChild(rightCol);

    if (ct[1]) txtAL(rightCol, colW, ct[1], 13, fn.semi, C.accent, 1, 100, 10);
    if (el.cards && el.cards.length) {
      el.cards.slice(0,4).forEach((c, ci) => {
        const cardFrame = mkCardFrame(`card-${ci}`, colW, C.surface, 1, 10, C.border, 0.8, 18);
        cardFrame.itemSpacing = 6;
        rightCol.appendChild(cardFrame);
        if (c.eyebrow) txtAL(cardFrame, colW-36, c.eyebrow, 12, fn.semi, C.accent, 1, 100, 10);
        if (c.title)   txtAL(cardFrame, colW-36, c.title,   17, fn.semi, C.text,   1, 130, -1);
        if (c.body)    txtAL(cardFrame, colW-36, c.body,    14, fn.reg,  C.muted,  1, 150,  0);
      });
    } else {
      placeholderAL(rightCol, colW, 200, 'Right');
    }
  }

  // ── Callout (하단 고정) ───────────────────────────────────────────────────
  if (el.callout) {
    const calloutFrame = mkCardFrame('callout', W-2*PX, C.accentBg, 1, 8, C.border, 0.5, 18);
    calloutFrame.x = PX;
    calloutFrame.y = H - PY - calloutH;
    f.appendChild(calloutFrame);
    // 왼쪽 강조 바: 절대좌표로 슬라이드에 직접 추가
    rct(f, PX, H - PY - calloutH, 4, calloutH, C.accent, 1);
    txtAL(calloutFrame, W-2*PX-36, el.callout, 16, fn.semi, C.text, 1, 130, 0);
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
  // 헤더: eyebrow(좌) + meta(우) → title → subtitle → 대형 이미지 플레이스홀더
  let y = PY;
  if (el.eyebrow || el.meta) {
    if (el.eyebrow) txt(f, PX,       y, (W-2*PX)*0.55, el.eyebrow, 13, fn.semi, C.accent, 1, 100, 50);
    if (el.meta)    txt(f, PX, y, W-2*PX, el.meta, 13, fn.reg, C.muted, 1, 100, 0, 'RIGHT');
    y += 28;
  }
  if (el.title)   { const t = txt(f, PX, y, W-2*PX, el.title,   38, fn.bold, C.text,  1, 120, -3); y += (t ? t.height : 56) + 8; }
  if (el.subtitle){ const t = txt(f, PX, y, W-2*PX, el.subtitle, 16, fn.reg,  C.muted, 1, 150,  0); y += (t ? t.height : 24) + 20; }
  // 이미지 플레이스홀더 — 나머지 공간 전체 사용
  const phH = H - y - PY;
  placeholder(f, PX, y, W-2*PX, phH, el.placeholderLabel || '이미지 삽입');
}

function renderClosing(f, el, C, fn) {
  f.fills = [{ type:'SOLID', color:hex(C.text) }];
  const W_ = C.bg;

  // 중앙 정렬 컨테이너: VERTICAL Auto Layout
  const container = mkALFrame('closing-content', 'VERTICAL', 20);
  container.primaryAxisAlignItems = 'CENTER';
  container.counterAxisAlignItems = 'CENTER';
  container.primaryAxisSizingMode = 'AUTO';
  container.counterAxisSizingMode = 'FIXED';
  container.resize(W, 10);
  f.appendChild(container);

  if (el.title)    txtAL(container, W, el.title,    52, fn.black, W_, 1,    120, -3, 'CENTER');
  if (el.subtitle) txtAL(container, W, el.subtitle, 28, fn.reg,   W_, 0.55, 160,  0, 'CENTER');

  // chips — HORIZONTAL Auto Layout
  if (el.chips && el.chips.length) {
    const chipsRow = mkALFrame('chips', 'HORIZONTAL', 12);
    chipsRow.primaryAxisSizingMode = 'AUTO';
    chipsRow.counterAxisSizingMode = 'AUTO';
    container.appendChild(chipsRow);

    const chipW = chip => chip.length * 9 + 40;
    el.chips.forEach(chip => {
      const cw = chipW(chip);
      const chipFrame = figma.createFrame();
      chipFrame.name = chip; chipFrame.resize(cw, 40);
      chipFrame.cornerRadius = 20;
      chipFrame.fills = [{ type:'SOLID', color:hex('#ffffff'), opacity:0.08 }];
      chipFrame.layoutMode = 'VERTICAL';
      chipFrame.primaryAxisAlignItems = 'CENTER';
      chipFrame.counterAxisAlignItems = 'CENTER';
      chipFrame.primaryAxisSizingMode = 'FIXED';
      chipFrame.counterAxisSizingMode = 'FIXED';
      chipsRow.appendChild(chipFrame);
      txtAL(chipFrame, cw-32, chip, 14, fn.reg, W_, 0.7, 100, 0, 'CENTER');
    });
  }

  // 수직 중앙: constraints CENTER로 설정
  container.constraints = { horizontal: 'CENTER', vertical: 'CENTER' };
  container.x = 0;
  container.y = H / 2 - 100; // 초기 추정값; Figma가 constraints로 자동 조정
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
