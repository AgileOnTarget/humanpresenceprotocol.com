const result = document.getElementById('result');

document.getElementById('verify').onclick = async () => {
  result.textContent = 'Waiting for HPP…';
  const missing = window.setTimeout(() => {
    if (document.getElementById('hpp-extension-modal')) return;
    if (result.textContent !== 'Waiting for HPP…') return;
    result.textContent = 'HPP Chrome extension not detected. In chrome://extensions, Reload Human Presence Protocol, then reload this page.';
  }, 1500);
  try {
    const ok = await HPP.verify({ claim: 'human_presence' });
    window.clearTimeout(missing);
    if (ok === true) {
      location.href = new URL('success.html', window.location.href).href;
      return;
    }
    result.textContent = 'Verification was not completed.';
  } catch {
    window.clearTimeout(missing);
    result.textContent = 'Verification was not completed.';
  }
};
