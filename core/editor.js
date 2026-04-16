/**
 * editor.js — 브라우저 인라인 편집기 (순수 JavaScript)
 * E 키 또는 우측 상단 버튼으로 편집 모드 토글
 *
 * 기능:
 *  - 텍스트 인라인 편집 (contenteditable)
 *  - Bold / Italic / Underline / 폰트 크기 / 색상
 *  - localStorage 저장 (새로고침 후에도 유지)
 *  - Undo / Redo (Ctrl+Z / Ctrl+Y)
 *  - PDF 내보내기 (애니메이션 리셋 후 인쇄)
 *  - HTML 내보내기
 */
(function () {
  'use strict';

  // ── 상태 ──────────────────────────────────────────────
  let isEditorActive = false;
  const history = [];
  const redoStack = [];
  const MAX_HISTORY = 50;

  // localStorage 키: 슬라이드 파일마다 독립 저장
  const STORAGE_KEY = 'slide-edit:' + location.pathname;
  let isDirty = false;

  // ── DOM 준비 후 초기화 ────────────────────────────────
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    loadFromStorage();   // 저장된 내용 복원
    buildToggleButton();
    buildToolbar();
    buildToast();
    attachKeyboard();
    markEditableElements();
  }

  // ── localStorage 저장 / 복원 ──────────────────────────
  function loadFromStorage() {
    const slide = document.querySelector('.slide');
    if (!slide) return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      slide.innerHTML = saved;
      markEditableElements();
    }
  }

  function saveToStorage() {
    const slide = document.querySelector('.slide');
    if (!slide) return;
    localStorage.setItem(STORAGE_KEY, slide.innerHTML);
    isDirty = false;
    updateSaveBtn();
    showToast('저장됨 ✓');
  }

  function markDirty() {
    if (!isDirty) {
      isDirty = true;
      updateSaveBtn();
    }
  }

  function updateSaveBtn() {
    const btn = document.getElementById('tb-save');
    if (!btn) return;
    if (isDirty) {
      btn.innerHTML = '💾 저장 <span style="color:#d97706;font-size:15px;line-height:1;">*</span>';
      btn.title = '저장되지 않은 변경사항이 있습니다 (Ctrl+S)';
    } else {
      btn.innerHTML = '💾 저장';
      btn.title = '변경사항 저장 (Ctrl+S)';
    }
  }

  // ── 편집 모드 토글 버튼 ──────────────────────────────
  function buildToggleButton() {
    const btn = document.createElement('button');
    btn.id = 'editor-toggle';
    btn.innerHTML = '<span class="toggle-dot"></span> 편집 모드';
    btn.title = 'E 키로 토글';
    btn.addEventListener('click', toggleEditor);
    document.body.appendChild(btn);
  }

  function toggleEditor() {
    isEditorActive = !isEditorActive;
    document.body.classList.toggle('editor-active', isEditorActive);

    const btn = document.getElementById('editor-toggle');
    btn.innerHTML = isEditorActive
      ? '<span class="toggle-dot"></span> 편집 중'
      : '<span class="toggle-dot"></span> 편집 모드';

    if (isEditorActive) {
      enableEditing();
    } else {
      disableEditing();
    }
  }

  // ── 편집 가능 요소 마킹 ──────────────────────────────
  function markEditableElements() {
    const slide = document.querySelector('.slide');
    if (!slide) return;

    const textTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'span', 'div'];
    textTags.forEach(tag => {
      slide.querySelectorAll(tag).forEach(el => {
        if (el.children.length === 0 || el.textContent.trim()) {
          el.setAttribute('data-editable', 'true');
        }
      });
    });
  }

  // ── 편집 활성 ─────────────────────────────────────────
  function enableEditing() {
    document.querySelectorAll('[data-editable]').forEach(el => {
      el.contentEditable = 'true';
      el.addEventListener('focus', onFocusEditable);
      el.addEventListener('blur', onBlurEditable);
      el.addEventListener('input', onInput);
    });
    saveSnapshot();
  }

  function disableEditing() {
    document.querySelectorAll('[data-editable]').forEach(el => {
      el.contentEditable = 'false';
      el.removeEventListener('focus', onFocusEditable);
      el.removeEventListener('blur', onBlurEditable);
    });
    clearToolbarState();
  }

  let currentTarget = null;

  function onFocusEditable(e) {
    currentTarget = e.target;
    updateToolbarState();
  }

  function onBlurEditable() {
    currentTarget = null;
    clearToolbarState();
  }

  function onInput() {
    markDirty();
    clearTimeout(onInput._timer);
    onInput._timer = setTimeout(saveSnapshot, 500);
  }

  // ── Undo / Redo ──────────────────────────────────────
  function saveSnapshot() {
    const slide = document.querySelector('.slide');
    if (!slide) return;
    const snap = slide.innerHTML;
    if (history.length && history[history.length - 1] === snap) return;
    history.push(snap);
    if (history.length > MAX_HISTORY) history.shift();
    redoStack.length = 0;
  }

  function undo() {
    if (history.length <= 1) { showToast('더 이상 실행 취소할 수 없습니다'); return; }
    const current = history.pop();
    redoStack.push(current);
    const prev = history[history.length - 1];
    restoreSnapshot(prev);
    markDirty();
    showToast('실행 취소');
  }

  function redo() {
    if (!redoStack.length) { showToast('다시 실행할 내용이 없습니다'); return; }
    const next = redoStack.pop();
    history.push(next);
    restoreSnapshot(next);
    markDirty();
    showToast('다시 실행');
  }

  function restoreSnapshot(html) {
    const slide = document.querySelector('.slide');
    if (!slide) return;
    slide.innerHTML = html;
    if (isEditorActive) {
      markEditableElements();
      enableEditing();
    }
  }

  // ── 포맷 툴바 (상단 가로) ────────────────────────────
  function buildToolbar() {
    const tb = document.createElement('div');
    tb.id = 'editor-toolbar';

    tb.innerHTML = `
      <!-- 편집 모드 표시 -->
      <div class="toolbar-section">
        <span style="font-size:11px;font-weight:700;color:#2563eb;white-space:nowrap;letter-spacing:-0.01em;">✏️ 편집 중</span>
      </div>

      <div class="toolbar-divider"></div>

      <!-- 저장 -->
      <div class="toolbar-section">
        <button class="tb-btn tb-btn-save" id="tb-save" title="변경사항 저장 (Ctrl+S)">💾 저장</button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- 서식 -->
      <div class="toolbar-section">
        <span class="toolbar-label">서식</span>
        <button class="tb-btn" id="tb-bold"   title="굵게 (Ctrl+B)"><b>B</b></button>
        <button class="tb-btn" id="tb-italic" title="기울임 (Ctrl+I)"><i>I</i></button>
        <button class="tb-btn" id="tb-under"  title="밑줄 (Ctrl+U)"><u>U</u></button>
        <button class="tb-btn" id="tb-strike" title="취소선">S̶</button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- 폰트 크기 -->
      <div class="toolbar-section">
        <span class="toolbar-label">크기</span>
        <button class="tb-btn" id="tb-font-dec" title="크기 줄이기">A−</button>
        <input class="tb-input" id="tb-font-size" type="number" min="8" max="200" placeholder="px">
        <button class="tb-btn" id="tb-font-inc" title="크기 키우기">A+</button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- 색상 -->
      <div class="toolbar-section">
        <span class="toolbar-label">색상</span>
        <span style="font-size:11px;color:#9ca3af;">T</span>
        <input class="tb-color" id="tb-color-text" type="color" value="#1a1a1a" title="텍스트 색상">
        <span style="font-size:11px;color:#9ca3af;margin-left:4px;">bg</span>
        <input class="tb-color" id="tb-color-bg" type="color" value="#ffffff" title="배경 색상">
      </div>

      <div class="toolbar-divider"></div>

      <!-- 정렬 -->
      <div class="toolbar-section">
        <span class="toolbar-label">정렬</span>
        <button class="tb-btn" id="tb-align-left"   title="왼쪽">⬛︎≡</button>
        <button class="tb-btn" id="tb-align-center" title="가운데">≡</button>
        <button class="tb-btn" id="tb-align-right"  title="오른쪽">≡⬛︎</button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- 시스템 -->
      <div class="toolbar-section">
        <span class="toolbar-label">시스템</span>
        <button class="tb-btn" id="tb-undo"        title="실행 취소 (Ctrl+Z)">↩ 취소</button>
        <button class="tb-btn" id="tb-redo"        title="다시 실행 (Ctrl+Y)">↪ 다시</button>
        <button class="tb-btn" id="tb-reset"       title="저장된 내용 초기화" style="color:#ef4444;">✕ 초기화</button>
        <button class="tb-btn" id="tb-export"      title="HTML 파일로 저장">⬇ HTML</button>
        <button class="tb-btn" id="tb-pdf"         title="PDF 저장 (Ctrl+P)">📄 PDF</button>
      </div>

      <!-- 닫기 -->
      <button class="tb-btn" id="tb-close" title="편집 모드 종료 (E)">✕</button>
    `;

    document.body.appendChild(tb);
    attachToolbarEvents();
  }

  function attachToolbarEvents() {
    // 저장
    document.getElementById('tb-save')  ?.addEventListener('click', saveToStorage);

    // 서식
    document.getElementById('tb-bold')  ?.addEventListener('click', () => execCmd('bold'));
    document.getElementById('tb-italic')?.addEventListener('click', () => execCmd('italic'));
    document.getElementById('tb-under') ?.addEventListener('click', () => execCmd('underline'));
    document.getElementById('tb-strike')?.addEventListener('click', () => execCmd('strikeThrough'));

    // 폰트 크기
    document.getElementById('tb-font-dec')?.addEventListener('click', () => changeFontSize(-2));
    document.getElementById('tb-font-inc')?.addEventListener('click', () => changeFontSize(+2));
    document.getElementById('tb-font-size')?.addEventListener('change', (e) => {
      setFontSize(parseInt(e.target.value, 10));
    });

    // 색상
    document.getElementById('tb-color-text')?.addEventListener('input', (e) => {
      execCmd('foreColor', e.target.value);
    });
    document.getElementById('tb-color-bg')?.addEventListener('input', (e) => {
      if (currentTarget) currentTarget.style.backgroundColor = e.target.value;
    });

    // 정렬
    document.getElementById('tb-align-left')  ?.addEventListener('click', () => execCmd('justifyLeft'));
    document.getElementById('tb-align-center')?.addEventListener('click', () => execCmd('justifyCenter'));
    document.getElementById('tb-align-right') ?.addEventListener('click', () => execCmd('justifyRight'));

    // 시스템
    document.getElementById('tb-undo')  ?.addEventListener('click', undo);
    document.getElementById('tb-redo')  ?.addEventListener('click', redo);
    document.getElementById('tb-reset') ?.addEventListener('click', resetStorage);
    document.getElementById('tb-export')?.addEventListener('click', exportHTML);
    document.getElementById('tb-pdf')   ?.addEventListener('click', exportPDF);
    document.getElementById('tb-close') ?.addEventListener('click', toggleEditor);
  }

  function execCmd(cmd, value) {
    document.execCommand(cmd, false, value || null);
    saveSnapshot();
  }

  function changeFontSize(delta) {
    if (!currentTarget) return;
    const current = parseInt(window.getComputedStyle(currentTarget).fontSize, 10) || 20;
    currentTarget.style.fontSize = (current + delta) + 'px';
    document.getElementById('tb-font-size').value = current + delta;
    markDirty();
    saveSnapshot();
  }

  function setFontSize(px) {
    if (!currentTarget || isNaN(px)) return;
    currentTarget.style.fontSize = px + 'px';
    markDirty();
    saveSnapshot();
  }

  function updateToolbarState() {
    if (!currentTarget) return;
    const styles = window.getComputedStyle(currentTarget);
    const sizeEl = document.getElementById('tb-font-size');
    if (sizeEl) sizeEl.value = parseInt(styles.fontSize, 10);
  }

  function clearToolbarState() {
    const sizeEl = document.getElementById('tb-font-size');
    if (sizeEl) sizeEl.value = '';
  }

  // ── localStorage 초기화 ──────────────────────────────
  function resetStorage() {
    if (!confirm('저장된 편집 내용을 모두 삭제하고 원본으로 되돌릴까요?\n(이 작업은 되돌릴 수 없습니다)')) return;
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  }

  // ── HTML 내보내기 ─────────────────────────────────────
  function exportHTML() {
    const html = document.documentElement.outerHTML;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `slide-exported-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('HTML 내보내기 완료');
  }

  // ── PDF 내보내기 ──────────────────────────────────────
  // presentation.html(전체 슬라이드)과 개별 슬라이드 파일 모두 지원.
  // 주의: presentation.html에서는 JS가 .slide-wrapper를 display:none + scale transform으로
  // 관리하므로, 인쇄 전 명시적으로 모든 래퍼를 펼치고 transform을 제거해야 전체 페이지 출력됨.
  function exportPDF() {
    // 1. 편집 모드 일시 비활성
    const wasActive = isEditorActive;
    if (wasActive) {
      document.body.classList.remove('editor-active');
      document.querySelectorAll('[contenteditable]').forEach(el => {
        el.contentEditable = 'false';
      });
    }

    // 2. 애니메이션 비활성 (opacity:0 인쇄 방지)
    const animEls = document.querySelectorAll('[data-anim]');
    animEls.forEach(el => el.classList.add('print-ready'));

    // 3. 멀티슬라이드 대응: slide-wrapper 전체 펼치기 + transform 제거
    const wrappers = document.querySelectorAll('.slide-wrapper');
    const allSlides = document.querySelectorAll('.slide');
    const savedTransforms = [];

    wrappers.forEach(w => {
      w.style.display = 'block';
      w.style.position = 'relative';
      w.style.width = '1280px';
      w.style.height = '720px';
      w.style.pageBreakAfter = 'always';
      w.style.breakAfter = 'page';
    });

    allSlides.forEach(s => {
      savedTransforms.push(s.style.transform);
      s.style.transform = 'none';
      s.style.width = '1280px';
      s.style.height = '720px';
      s.style.boxShadow = 'none';
    });

    document.body.style.overflow = 'visible';
    document.documentElement.style.overflow = 'visible';

    showToast('인쇄 대화상자 → "PDF로 저장" 선택 (용지: 가로 1280×720)');

    // 4. iframe 안이면 viewer에 위임 (전체 PDF 출력)
    if (window.parent !== window) {
      // 복원
      animEls.forEach(el => el.classList.remove('print-ready'));
      wrappers.forEach(w => {
        w.style.display = ''; w.style.position = '';
        w.style.width = ''; w.style.height = '';
        w.style.pageBreakAfter = ''; w.style.breakAfter = '';
      });
      allSlides.forEach((s, i) => {
        s.style.transform = savedTransforms[i] || '';
        s.style.width = ''; s.style.height = ''; s.style.boxShadow = '';
      });
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (wasActive) document.body.classList.add('editor-active');
      window.parent.postMessage({ type: 'ppt-export-pdf' }, '*');
      showToast('전체 PDF 내보내기 중...');
      return;
    }

    // 5. 레이아웃 안정화 후 인쇄
    requestAnimationFrame(() => {
      setTimeout(() => {
        window.print();

        // 5. 인쇄 후 복원
        animEls.forEach(el => el.classList.remove('print-ready'));

        wrappers.forEach(w => {
          w.style.display = '';
          w.style.position = '';
          w.style.width = '';
          w.style.height = '';
          w.style.pageBreakAfter = '';
          w.style.breakAfter = '';
        });

        allSlides.forEach((s, i) => {
          s.style.transform = savedTransforms[i] || '';
          s.style.width = '';
          s.style.height = '';
          s.style.boxShadow = '';
        });

        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';

        // scale 재계산
        window.dispatchEvent(new Event('resize'));

        if (wasActive) {
          document.body.classList.add('editor-active');
          document.querySelectorAll('[data-editable]').forEach(el => {
            el.contentEditable = 'true';
          });
        }
      }, 300);
    });
  }

  // ── 토스트 알림 ──────────────────────────────────────
  function buildToast() {
    const toast = document.createElement('div');
    toast.id = 'editor-toast';
    document.body.appendChild(toast);
  }

  function showToast(msg) {
    const toast = document.getElementById('editor-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => toast.classList.remove('show'), 1800);
  }

  // ── 전역 노출 (build.js autoprint에서 호출) ───────────
  window._pptExportPDF = exportPDF;

  // ── 키보드 단축키 ─────────────────────────────────────
  function attachKeyboard() {
    document.addEventListener('keydown', (e) => {
      // E 키 — 편집 모드 토글
      if (e.key === 'e' || e.key === 'E') {
        if (!e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT') {
          if (!isEditorActive || document.activeElement.contentEditable !== 'true') {
            e.preventDefault();
            toggleEditor();
            return;
          }
        }
      }

      if (!isEditorActive) return;

      // Ctrl+S — 저장
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveToStorage();
      }

      // Ctrl+Z — 실행 취소
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Ctrl+Y / Ctrl+Shift+Z — 다시 실행
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }

      // Ctrl+P — PDF 내보내기
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        exportPDF();
      }
    });
  }
})();
