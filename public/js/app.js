/* ============================================
   Et-SI — Main Application
   ============================================ */

(function () {
  'use strict';

  // ---- State ----
  const state = {
    messages: [],  // { role, content }
    streaming: false,
    currentView: 'chat'
  };

  // ---- DOM refs ----
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  const dom = {
    sidebar: $('#sidebar'),
    overlay: $('#sidebar-overlay'),
    chatMessages: $('#chat-messages'),
    chatForm: $('#chat-form'),
    chatInput: $('#chat-input'),
    btnSend: $('#btn-send'),
    btnMenu: $('#btn-menu'),
    btnNewChat: $('#btn-new-chat'),
    personasGrid: $('#personas-grid'),
    apiKeyInput: $('#api-key-input'),
    btnSaveKey: $('#btn-save-key'),
    btnToggleKey: $('#btn-toggle-key'),
    keyStatus: $('#key-status')
  };

  // ---- Sidebar ----
  function openSidebar() {
    dom.sidebar.classList.remove('hidden');
    dom.overlay.classList.remove('hidden');
  }

  function closeSidebar() {
    dom.sidebar.classList.add('hidden');
    dom.overlay.classList.add('hidden');
  }

  dom.btnMenu.addEventListener('click', () => {
    dom.sidebar.classList.contains('hidden') ? openSidebar() : closeSidebar();
  });

  dom.overlay.addEventListener('click', closeSidebar);

  // ---- Navigation ----
  function switchView(viewName) {
    $$('.view').forEach(v => v.classList.remove('active'));
    const target = $(`#view-${viewName}`);
    if (target) target.classList.add('active');

    $$('.sidebar-item').forEach(btn => btn.classList.remove('active'));
    const sideBtn = $(`.sidebar-item[data-view="${viewName}"]`);
    if (sideBtn) sideBtn.classList.add('active');

    state.currentView = viewName;
    closeSidebar();
  }

  $$('.sidebar-item').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });

  // ---- API Key ----
  function getApiKey() {
    return localStorage.getItem('etsi_api_key') || '';
  }

  function loadApiKey() {
    const key = getApiKey();
    if (key) {
      dom.apiKeyInput.value = key;
      dom.keyStatus.textContent = 'Clé enregistrée';
      dom.keyStatus.className = 'success';
    }
  }

  dom.btnSaveKey.addEventListener('click', () => {
    const key = dom.apiKeyInput.value.trim();
    if (!key) {
      dom.keyStatus.textContent = 'Veuillez entrer une clé';
      dom.keyStatus.className = 'error';
      return;
    }
    localStorage.setItem('etsi_api_key', key);
    dom.keyStatus.textContent = 'Clé enregistrée';
    dom.keyStatus.className = 'success';
  });

  dom.btnToggleKey.addEventListener('click', () => {
    const input = dom.apiKeyInput;
    input.type = input.type === 'password' ? 'text' : 'password';
  });

  // ---- Markdown rendering ----
  function renderMarkdown(text) {
    let html = text;

    // Escape HTML
    html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Code blocks
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Headers
    html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Bold and italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Blockquotes
    html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');

    // Horizontal rules
    html = html.replace(/^---$/gm, '<hr>');

    // Tables
    html = html.replace(/^(\|.+\|)\n(\|[\s\-:|]+\|)\n((?:\|.+\|\n?)+)/gm, (match, headerRow, sepRow, bodyRows) => {
      const headers = headerRow.split('|').filter(c => c.trim());
      const rows = bodyRows.trim().split('\n').map(r => r.split('|').filter(c => c.trim()));

      let table = '<div class="table-wrapper"><table><thead><tr>';
      headers.forEach(h => { table += `<th>${h.trim()}</th>`; });
      table += '</tr></thead><tbody>';
      rows.forEach(row => {
        table += '<tr>';
        row.forEach(cell => { table += `<td>${cell.trim()}</td>`; });
        table += '</tr>';
      });
      table += '</tbody></table></div>';
      return table;
    });

    // Unordered lists
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');

    // Paragraphs — wrap remaining lines
    html = html.replace(/^(?!<[a-z])((?!<\/)[^\n]+)$/gm, '<p>$1</p>');

    // Clean up empty paragraphs and double breaks
    html = html.replace(/<p>\s*<\/p>/g, '');
    html = html.replace(/\n{2,}/g, '');

    return html;
  }

  // ---- Chat UI ----
  function scrollToBottom() {
    requestAnimationFrame(() => {
      dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;
    });
  }

  function hideWelcome() {
    const welcome = dom.chatMessages.querySelector('.welcome-screen');
    if (welcome) welcome.remove();
  }

  function addUserMessage(text) {
    hideWelcome();
    const div = document.createElement('div');
    div.className = 'msg msg-user';
    div.innerHTML = `<div class="msg-bubble">${escapeHtml(text)}</div>`;
    dom.chatMessages.appendChild(div);
    scrollToBottom();
  }

  function createAssistantMessage() {
    hideWelcome();
    const div = document.createElement('div');
    div.className = 'msg msg-assistant';
    div.innerHTML = `
      <div class="msg-bubble">
        <div class="typing-indicator"><span></span><span></span><span></span></div>
      </div>`;
    dom.chatMessages.appendChild(div);
    scrollToBottom();
    return div;
  }

  function updateAssistantMessage(div, text) {
    const bubble = div.querySelector('.msg-bubble');
    bubble.innerHTML = renderMarkdown(text);
    scrollToBottom();
  }

  function addErrorMessage(text) {
    const div = document.createElement('div');
    div.className = 'msg msg-error';
    div.innerHTML = `<div class="msg-bubble">${escapeHtml(text)}</div>`;
    dom.chatMessages.appendChild(div);
    scrollToBottom();
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ---- Streaming Chat ----
  async function sendMessage(userText) {
    if (state.streaming || !userText.trim()) return;

    const apiKey = getApiKey();
    if (!apiKey) {
      addErrorMessage('Configurez votre clé API Anthropic dans les paramètres.');
      return;
    }

    state.streaming = true;
    dom.btnSend.disabled = true;
    dom.chatInput.disabled = true;

    addUserMessage(userText);
    state.messages.push({ role: 'user', content: userText });

    const assistantDiv = createAssistantMessage();
    let fullText = '';

    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: state.messages,
          apiKey: apiKey
        })
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: 'Erreur réseau' }));
        throw new Error(err.error || `Erreur ${resp.status}`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const payload = line.slice(6).trim();

          if (payload === '[DONE]') continue;

          try {
            const data = JSON.parse(payload);
            if (data.error) throw new Error(data.error);
            if (data.text) {
              fullText += data.text;
              updateAssistantMessage(assistantDiv, fullText);
            }
          } catch (e) {
            if (e.message && !e.message.includes('JSON')) throw e;
          }
        }
      }

      if (fullText) {
        state.messages.push({ role: 'assistant', content: fullText });
      }

    } catch (err) {
      if (!fullText) {
        assistantDiv.remove();
      }
      addErrorMessage(err.message || 'Erreur de communication avec le serveur');
    } finally {
      state.streaming = false;
      dom.chatInput.disabled = false;
      dom.chatInput.focus();
      updateSendButton();
    }
  }

  // ---- New chat ----
  function newChat() {
    state.messages = [];
    dom.chatMessages.innerHTML = '';

    // Restore welcome screen
    dom.chatMessages.innerHTML = `
      <div class="welcome-screen">
        <div class="welcome-icon">?</div>
        <h2>Et si…</h2>
        <p>Décrivez une réforme de politique publique et je simulerai ses impacts sur 20 profils types, l'économie et l'environnement.</p>
        <div class="example-chips">
          <button class="chip" data-prompt="Et si 50 % des adultes adoptaient les recommandations du PNNS ?">PNNS & alimentation</button>
          <button class="chip" data-prompt="Et si les circuits courts passaient de 7 % à 17 % de la consommation alimentaire ?">Circuits courts</button>
          <button class="chip" data-prompt="Et si le prix des transports en commun dépendait du revenu de chacun, avec une tarification progressive de ±20 % à ±60 % ?">Tarification sociale TC</button>
          <button class="chip" data-prompt="Et si on mettait une taxe de 15 € sur chaque billet d'avion intérieur pour baisser le prix du train d'environ 2,30 € par billet ?">Train vs avion</button>
        </div>
      </div>`;

    bindChips();
  }

  dom.btnNewChat.addEventListener('click', newChat);

  // ---- Form handling ----
  function updateSendButton() {
    dom.btnSend.disabled = !dom.chatInput.value.trim() || state.streaming;
  }

  dom.chatInput.addEventListener('input', () => {
    updateSendButton();
    // Auto-resize textarea
    dom.chatInput.style.height = 'auto';
    dom.chatInput.style.height = Math.min(dom.chatInput.scrollHeight, 120) + 'px';
  });

  dom.chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!dom.btnSend.disabled) {
        dom.chatForm.dispatchEvent(new Event('submit'));
      }
    }
  });

  dom.chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = dom.chatInput.value.trim();
    if (text) {
      dom.chatInput.value = '';
      dom.chatInput.style.height = 'auto';
      updateSendButton();
      sendMessage(text);
    }
  });

  // ---- Chips & examples ----
  function bindChips() {
    $$('.chip, .example-card').forEach(el => {
      el.addEventListener('click', () => {
        const prompt = el.dataset.prompt;
        if (prompt) {
          switchView('chat');
          sendMessage(prompt);
        }
      });
    });
  }

  // ---- Personas rendering ----
  function renderPersonas() {
    const personas = window.ETSI.PERSONAS;
    dom.personasGrid.innerHTML = personas.map(p => `
      <div class="persona-card">
        <div class="persona-header">
          <div class="persona-avatar" style="background:${p.color}">
            ${p.nom.charAt(0)}
          </div>
          <div>
            <div class="persona-name">${p.nom}</div>
            <div class="persona-title">${p.profil}</div>
          </div>
        </div>
        <div class="persona-details">
          <span class="persona-detail-label">Âge</span><span>${p.age} ans</span>
          <span class="persona-detail-label">Revenu</span><span>${p.revenu.toLocaleString('fr-FR')} €/mois</span>
          <span class="persona-detail-label">Décile</span><span>${p.decile}</span>
          <span class="persona-detail-label">Lieu</span><span>${p.loc}</span>
        </div>
      </div>
    `).join('');
  }

  // ---- Init ----
  function init() {
    loadApiKey();
    renderPersonas();
    bindChips();
    dom.chatInput.focus();
  }

  init();
})();
