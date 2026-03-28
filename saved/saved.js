(() => {
  'use strict';

  const listEl = document.getElementById('list');
  const emptyEl = document.getElementById('empty');
  const noResultsEl = document.getElementById('no-results');
  const countEl = document.getElementById('count');
  const searchEl = document.getElementById('search');

  let allWords = [];

  function esc(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function formatDate(ts) {
    const d = new Date(ts);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function buildAiHtml(ai) {
    if (!ai) return '';
    const labelClass = ai.source === 'gemini' ? 'ai-label-gemini' : 'ai-label-claude';
    const labelText = ai.source === 'gemini' ? '&#10022; Gemini' : '&#9679; Claude';
    return `
      <div class="ai-section">
        <div class="ai-label ${labelClass}">${labelText}</div>
        <p class="ai-summary">${esc(ai.summary)}</p>
      </div>
    `;
  }

  function buildDictHtml(dict, hasAi) {
    if (!dict || !dict.meanings || dict.meanings.length === 0) return '';

    let meaningsHtml = '';
    for (const meaning of dict.meanings) {
      let defsHtml = '';
      for (const def of meaning.definitions) {
        defsHtml += `<li class="def-item">${esc(def.definition)}</li>`;
        if (def.example) {
          defsHtml += `<p class="def-example">"${esc(def.example)}"</p>`;
        }
      }
      meaningsHtml += `
        <div class="meaning">
          <span class="pos">${esc(meaning.partOfSpeech)}</span>
          <ol class="def-list">${defsHtml}</ol>
        </div>
      `;
    }

    return `
      <div class="dict-section">
        ${hasAi ? '<div class="dict-label">Definitions</div>' : ''}
        ${meaningsHtml}
      </div>
    `;
  }

  function buildCard(entry) {
    const phoneticHtml = entry.dictionary?.phonetic
      ? `<span class="word-phonetic">${esc(entry.dictionary.phonetic)}</span>`
      : '';

    const bodyContent = buildAiHtml(entry.ai) + buildDictHtml(entry.dictionary, !!entry.ai);

    return `
      <div class="word-card" data-text="${esc(entry.text)}">
        <div class="word-card-header">
          <span class="word-title">${esc(entry.text)}</span>
          ${phoneticHtml}
          <span class="word-date">${formatDate(entry.savedAt)}</span>
          <button class="word-delete" aria-label="Delete" title="Remove">&times;</button>
          <span class="word-expand">&#9660;</span>
        </div>
        <div class="word-card-body">
          ${bodyContent || '<p style="color:#999;font-size:14px;">No summary or definitions saved.</p>'}
        </div>
      </div>
    `;
  }

  function render(words) {
    const query = searchEl.value.trim().toLowerCase();
    const filtered = query
      ? words.filter((w) => w.text.toLowerCase().includes(query))
      : words;

    countEl.textContent = words.length > 0 ? `${words.length} word${words.length !== 1 ? 's' : ''}` : '';

    if (words.length === 0) {
      listEl.innerHTML = '';
      emptyEl.style.display = '';
      noResultsEl.style.display = 'none';
      return;
    }

    emptyEl.style.display = 'none';

    if (filtered.length === 0) {
      listEl.innerHTML = '';
      noResultsEl.style.display = '';
      return;
    }

    noResultsEl.style.display = 'none';
    listEl.innerHTML = filtered.map(buildCard).join('');
  }

  function loadWords() {
    chrome.runtime.sendMessage({ type: 'GET_SAVED_WORDS' }, (res) => {
      allWords = res?.words || [];
      render(allWords);
    });
  }

  // ── Events ──

  listEl.addEventListener('click', (e) => {
    // Delete button
    const deleteBtn = e.target.closest('.word-delete');
    if (deleteBtn) {
      e.stopPropagation();
      const card = deleteBtn.closest('.word-card');
      const text = card.dataset.text;
      chrome.runtime.sendMessage({ type: 'UNSAVE_WORD', text }, () => {
        allWords = allWords.filter((w) => w.text !== text);
        render(allWords);
      });
      return;
    }

    // Toggle expand
    const header = e.target.closest('.word-card-header');
    if (header) {
      const card = header.closest('.word-card');
      card.classList.toggle('expanded');
    }
  });

  searchEl.addEventListener('input', () => {
    render(allWords);
  });

  // ── Init ──

  loadWords();
})();
