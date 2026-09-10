(function (global) {
  const pending = new Map();
  const DEFAULT_TIMEOUT = 310000;

  function id() {
    return global.crypto && global.crypto.randomUUID
      ? global.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function verify(options = {}) {
    const requestId = id();
    const claim = options.claim || 'human_presence';
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        pending.delete(requestId);
        resolve(false);
      }, options.timeout || DEFAULT_TIMEOUT);
      pending.set(requestId, { resolve, timer });
      try {
        global.postMessage(
          {
            type: 'HPP_REQUEST',
            requestId,
            options: { claim, threshold: options.threshold },
          },
          global.location.origin,
        );
      } catch {
        clearTimeout(timer);
        pending.delete(requestId);
        resolve(false);
      }
    });
  }

  global.addEventListener('message', (event) => {
    if (event.source !== global) return;
    if (event.origin !== global.location.origin) return;
    if (!event.data || event.data.type !== 'HPP_RESPONSE') return;
    const p = pending.get(event.data.requestId);
    if (!p) return;
    clearTimeout(p.timer);
    pending.delete(event.data.requestId);
    p.resolve(event.data.verified === true);
  });

  global.HPP = Object.freeze({ verify });
})(window);
