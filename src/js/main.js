// ---- State ----

const state = {
  currentStep: 'landing',
  projectData: {
    name: '',
    description: '',
    problem: '',
    audience: '',
    features: [],
    deadline: '',
    stack: '',
    repoName: '',
    repoFullName: '',
    models: {
      manager: 'claude-opus-4-6',
      coder: 'claude-sonnet-4-6',
      reviewer: 'claude-sonnet-4-6',
      retro: 'claude-sonnet-4-6',
    }
  },
  github: {
    token: '',
    username: '',
  }
};

const STEPS = ['landing', 'onboarding', 'github', 'recap', 'generating', 'routines', 'done'];

// ---- Navigation ----

function showStep(stepId) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(`step-${stepId}`);
  if (el) {
    el.classList.add('active');
    window.scrollTo(0, 0);
  }
  state.currentStep = stepId;
}

function nextStep() {
  const idx = STEPS.indexOf(state.currentStep);
  if (idx < STEPS.length - 1) {
    showStep(STEPS[idx + 1]);
  }
}

function goToStep(stepId) {
  showStep(stepId);
}

// ---- Init ----

document.addEventListener('DOMContentLoaded', () => {
  showStep('landing');
  initOnboarding();
});
