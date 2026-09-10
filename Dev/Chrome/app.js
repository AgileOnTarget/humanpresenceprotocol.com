const result = document.getElementById('result');

function successUrl() {
  try {
    const here = new URL(window.location.href);
    if (here.hostname === 'humanpresenceprotocol.com' || here.hostname === 'www.humanpresenceprotocol.com') {
      return 'https://humanpresenceprotocol.com/Dev/Chrome/success.html';
    }
    return new URL('success.html', here).href;
  } catch {
    return 'success.html';
  }
}

function showVerifiedOnPage() {
  const title = document.querySelector('h1');
  if (title) title.textContent = 'You have been verified as a human.';
  const lead = document.querySelector('.lead');
  if (lead) {
    lead.textContent = 'The page received a Boolean success result from Human Presence Protocol. It did not receive biometric data, keys, or a verifier session token.';
  }
  const button = document.getElementById('verify');
  if (button) button.hidden = true;
  if (result) result.textContent = 'Verified.';
}

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
      showVerifiedOnPage();
      window.location.replace(successUrl());
      return;
    }
    result.textContent = 'Verification was not completed.';
  } catch {
    window.clearTimeout(missing);
    result.textContent = 'Verification was not completed.';
  }
};
