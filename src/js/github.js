// ---- GitHub API ----

const GITHUB_API = 'https://api.github.com';

async function verifyToken() {
  const token = document.getElementById('github-token').value.trim();
  const statusEl = document.getElementById('github-status');

  if (!token) {
    showGitHubStatus('Please enter a token.', 'error');
    return;
  }

  showGitHubStatus('Verifying...', '');

  try {
    const res = await githubRequest('GET', '/user', token);
    if (res.login) {
      state.github.token = token;
      state.github.username = res.login;

      // Pre-fill repo name with username prefix
      const repoNameInput = document.getElementById('repo-name');
      if (repoNameInput) {
        repoNameInput.value = state.projectData.repoName || 'my-project';
      }

      showGitHubStatus(`Connected as @${res.login}`, 'success');

      setTimeout(() => {
        populateRecap();
        goToStep('recap');
      }, 800);
    }
  } catch (err) {
    showGitHubStatus('Invalid token or network error. Please check and retry.', 'error');
  }
}

function showGitHubStatus(msg, type) {
  const el = document.getElementById('github-status');
  el.textContent = msg;
  el.className = `status-message ${type}`;
  el.style.display = msg ? 'block' : 'none';
}

async function githubRequest(method, path, token, body) {
  const opts = {
    method,
    headers: {
      Authorization: `token ${token || state.github.token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${GITHUB_API}${path}`, opts);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || `GitHub API error ${res.status}`);
  }
  return data;
}

// Exposed for generator.js
window.githubRequest = githubRequest;
