/// <reference types="chrome"/>
// content.ts
(() => {
  // 1. Detect environment – never throws
  let ctx = /** @type {Context} */ ({ type: 'WEB_CONTENT', src: 'WEB' });
  try {
    const host = window.location.hostname.toLowerCase();
    if (host.includes('mail.google.com')) ctx = { type: 'GMAIL_EMAIL', src: 'GMAIL' };
    else if (host.includes('outlook.live.com') || host.includes('outlook.office.com')) ctx = { type: 'OUTLOOK_EMAIL', src: 'OUTLOOK' };
    else if (host.includes('mail.yahoo.com')) ctx = { type: 'YAHOO_EMAIL', src: 'YAHOO' };
  } catch (e) {
    // location blocked by CSP → fallback
  }


interface ElementVisibility {
    getBoundingClientRect: () => DOMRect;
}

const isVisible = (el: Element | ElementVisibility | null): boolean => {
    if (!el || !el.getBoundingClientRect) return false;
    try {
        const s: CSSStyleDeclaration = window.getComputedStyle(el as Element);
        const r: DOMRect = el.getBoundingClientRect();
        return s.display !== 'none' &&
                     s.visibility !== 'hidden' &&
                     parseFloat(s.opacity) > 0 &&
                     r.width > 0 &&
                     r.height > 0;
    } catch {
        return false;
    }
};

  // -----------------------------------------------------------------
  // 3. Main-content selector list (ordered)
  // -----------------------------------------------------------------
  const MAIN_SELECTORS = [
    // Gmail
    '.a3s', '.ii.gt', '[data-message-id]',
    // Outlook
    '[data-app-section="reading-pane"]', '.message-content',
    // Yahoo
    '.msg-body',
    // Generic
    'main', 'article', '[role="main"]', '#content', '.content', 'body'
  ];

  const getMainElement = () => {
    for (const sel of MAIN_SELECTORS) {
      try {
        const el = document.querySelector(sel);
        if (el && isVisible(el) && (el.textContent || '').trim().length > 80) return el;
      } catch {}
    }
    return document.body || document.documentElement;
  };

  // -----------------------------------------------------------------
  // 4. Clean text – removes scripts, normalises whitespace
  // -----------------------------------------------------------------
interface CleanableElement extends Node {
    cloneNode(deep?: boolean): CleanableElement;
    querySelectorAll(selectors: string): NodeListOf<Element>;
    textContent: string;
}

const cleanText = (el: HTMLElement | null): string => {
    try {
        const clone = el!.cloneNode(true) as HTMLElement;
        clone.querySelectorAll('script,style,noscript,iframe,svg').forEach(x => x.remove());
        return clone.textContent.replace(/\s+/g, ' ').trim();
    } catch {
        return '';
    }
};

  // -----------------------------------------------------------------
  // 5. Link extraction + risk flags – safe URL parsing
  // -----------------------------------------------------------------
  const extractLinks = () => {
    const result = [];
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]') || []);
    for (const a of links) {
      if (!a.href || a.href === '#') continue;
      const href = a.href;
      const text = (a.textContent || '').trim();
      const visible = isVisible(a);
      const factors = [];

      try {
        const u = new URL(href);
        if (u.protocol === 'http:') factors.push('no_https');
        if (/(\d{1,3}\.){3}\d{1,3}/.test(href)) factors.push('ip_address');
        if (/\.(tk|ml|ga|cf|gq|xyz|top)$/.test(u.hostname)) factors.push('free_domain');
        if (/javascript:/i.test(href)) factors.push('js_link');
        if (!visible) factors.push('hidden');
      } catch {
        factors.push('invalid_url');
      }

      result.push({
        text,
        href,
        title: a.title || '',
        isSuspicious: factors.length > 0,
        riskFactors: factors
      });
    }
    return result;
  };

 
  // 6. Email metadata – defensive selectors
  const extractMetadata = () => {
    if (!ctx.type.includes('EMAIL')) return null;

    try {
      if (ctx.src === 'GMAIL') {
        const senderEl = document.querySelector('[email]');
        const subjEl = document.querySelector('h2, .hP');
        const timeEl = document.querySelector('span.gK, time');

        return {
          sender: {
            name: senderEl?.getAttribute('name') || senderEl?.textContent || '',
            email: senderEl?.getAttribute('email') || '',
            domain: (senderEl?.getAttribute('email') || '').split('@')[1] || ''
          },
          subject: subjEl?.textContent?.trim() || document.title,
          timestamp: timeEl?.getAttribute('title') || timeEl?.textContent || ''
        };
      }

      // ---- Outlook ----
      if (ctx.src === 'OUTLOOK') {
        const senderName = document.querySelector('[data-testid="senderName"]')?.textContent || '';
        const senderMail = document.querySelector('[data-testid="senderEmail"]')?.textContent || '';
        const subj = document.querySelector('[data-testid="subject"]')?.textContent || '';

        return {
          sender: {
            name: senderName,
            email: senderMail,
            domain: senderMail.split('@')[1] || ''
          },
          subject: subj,
          timestamp: new Date().toISOString()
        };
      }
    } catch (e) {
      // fall through
    }
    return null;
  };


  const buildPayload = () => {
    const errors = [];
    interface EmailMetadata {
        sender: {
            name: string;
            email: string;
            domain: string;
        } | null;
        subject: string;
        timestamp: string;
        recipients?: any[];
    }

    interface Link {
        text: string;
        href: string;
        title: string;
        isSuspicious: boolean;
        riskFactors: string[];
    }

    let mainEl: Element | null,
        text: string = '',
        html: string = '',
        links: Link[] = [],
        meta: EmailMetadata | null = null;

    try { mainEl = getMainElement(); } catch (e) { errors.push('main_el'); mainEl = document.body; }
    try { text = cleanText(mainEl as HTMLElement); } catch (e) { errors.push('clean_text'); }
    try { html = mainEl?.innerHTML || ''; } catch (e) { errors.push('html'); }
    try { links = extractLinks(); } catch (e) { errors.push('links'); }
    try { meta = extractMetadata(); } catch (e) { errors.push('metadata'); }

    const payload = {
      type: ctx.type,
      content: text,
      html,
      confidence: text.length > 500 ? 'HIGH' : text.length > 150 ? 'MEDIUM' : 'LOW',
      contentLength: text.length,
      hasUsefulContent: text.length > 100,
      links,
      metadata: meta || {
        sender: null,
        subject: document.title,
        timestamp: new Date().toISOString(),
        recipients: []
      },
      url: window.location.href,
      source: ctx.src,
      extractionMethod: 'LIGHT_DOM',
      qualityScore: Math.min(
        100,
        30 +
        (text.length > 300 ? 30 : 0) +
        (links.length ? 20 : 0) +
        (meta ? 20 : 0)
      ),
      extractionErrors: errors
    };

    return payload;
  };


  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request?.action !== 'SCAN_EMAIL') return false;

    try {
      const payload = buildPayload();
      // structuredClone ensures no circular refs
      sendResponse({ data: structuredClone(payload) });
    } catch (e: Error | any) {
      sendResponse({
        data: {
          type: 'FALLBACK_CONTENT',
          content: '',
          html: '',
          confidence: 'LOW',
          contentLength: 0,
          hasUsefulContent: false,
          links: [],
          metadata: { sender: null, subject: '', timestamp: '' },
          url: window.location.href,
          source: 'ERROR',
          extractionMethod: 'CRASH',
          qualityScore: 0,
          extractionErrors: ['runtime_crash', e?.message || '']
        }
      });
    }
    return true;
  });


  let settled = false;
  const settle = () => {
    if (settled) return;
    settled = true;
    setTimeout(() => {
      try {
        chrome.runtime.sendMessage({
          type: 'EMAIL_SCANNED',
          data: buildPayload()
        });
      } catch {}
    }, 300);
  };

  try {
    const observer = new MutationObserver(() => {
      if (document.body && !settled) settle();
    });
    observer.observe(document, { childList: true, subtree: true });
    if (document.body) settle();
  } catch {
    setTimeout(settle, 500);
  }
})();