const result = document.getElementById('result');

document.getElementById('verify').onclick = async () => {
  result.textContent = 'Waiting for HPP…';
  try {
    const ok = await HPP.verify({ claim: 'human_presence' });
    if (ok === true) {
      location.href = 'success.html';
      return;
    }
    result.textContent = 'Verification was not completed.';
  } catch {
    result.textContent = 'Verification was not completed.';
  }
};
