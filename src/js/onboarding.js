// ---- Onboarding — conversational questionnaire ----

const QUESTIONS = [
  {
    id: 'problem',
    label: 'What problem are you trying to solve?',
    hint: 'Don\'t think about the solution yet. Just the problem.',
    placeholder: 'e.g. I always lose track of my budget at the end of the month...',
    type: 'textarea',
    field: 'problem',
  },
  {
    id: 'audience',
    label: 'Who is this for?',
    hint: 'Yourself? A specific type of person? Be specific.',
    placeholder: 'e.g. Freelancers who juggle multiple clients...',
    type: 'textarea',
    field: 'audience',
  },
  {
    id: 'name',
    label: 'What do you want to call this project?',
    hint: 'A working name is fine — you can change it later.',
    placeholder: 'e.g. BudgetPal',
    type: 'input',
    field: 'name',
  },
  {
    id: 'description',
    label: 'Describe your project in 1-2 sentences.',
    hint: 'What does it do, for who, and what makes it different?',
    placeholder: 'e.g. A Mac app that tracks your freelance income and flags when you\'re about to miss a tax deadline...',
    type: 'textarea',
    field: 'description',
  },
  {
    id: 'features',
    label: 'What are the 3-5 features that must be in version 1?',
    hint: 'List the bare minimum. One per line.',
    placeholder: 'Track income by client\nSet monthly budget targets\nExport to CSV',
    type: 'textarea',
    field: 'features',
    transform: v => v.split('\n').map(l => l.trim()).filter(Boolean),
  },
  {
    id: 'stack',
    label: 'What technology stack do you want to use?',
    hint: 'Not sure? Just describe what kind of app it is (Mac app, website, mobile app...).',
    placeholder: 'e.g. Swift/SwiftUI Mac app, or React web app, or Python CLI...',
    type: 'input',
    field: 'stack',
  },
  {
    id: 'deadline',
    label: 'By when do you want to ship version 1?',
    hint: 'A realistic date is better than an optimistic one. More time = less token usage per day.',
    placeholder: '',
    type: 'date',
    field: 'deadline',
    validate: validateDeadline,
  },
];

let currentQuestionIndex = 0;
let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];
let whisperApiKey = null; // Set if user provides OpenAI key

function initOnboarding() {
  renderQuestion(0);
}

function renderQuestion(idx) {
  const q = QUESTIONS[idx];
  if (!q) return;

  const container = document.getElementById('question-container');
  const progress = document.getElementById('onboarding-progress');

  const pct = Math.round(((idx) / QUESTIONS.length) * 100);
  progress.style.width = `${pct}%`;

  let inputHtml = '';
  if (q.type === 'textarea') {
    inputHtml = `<textarea
      class="question-input"
      id="q-input"
      placeholder="${q.placeholder}"
      rows="4"
    ></textarea>`;
  } else if (q.type === 'input') {
    inputHtml = `<input
      class="question-input"
      id="q-input"
      type="text"
      placeholder="${q.placeholder}"
    />`;
  } else if (q.type === 'date') {
    const today = new Date().toISOString().split('T')[0];
    inputHtml = `<input
      class="question-input"
      id="q-input"
      type="date"
      min="${today}"
    />`;
  }

  // Pre-fill with existing value
  const existingValue = q.field === 'features'
    ? (state.projectData.features || []).join('\n')
    : state.projectData[q.field] || '';

  container.innerHTML = `
    <div class="question-wrapper">
      <div class="question-label">${q.label}</div>
      ${q.hint ? `<div class="question-hint">${q.hint}</div>` : ''}
      ${inputHtml}
      <div id="q-validation" class="status-message"></div>
      <div class="question-nav">
        ${idx > 0 ? '<button class="btn-secondary" onclick="prevQuestion()">Back</button>' : ''}
        <button class="btn-primary" onclick="nextQuestion()" style="margin-top:0;">
          ${idx === QUESTIONS.length - 1 ? 'Continue' : 'Next'}
        </button>
      </div>
    </div>
  `;

  const input = document.getElementById('q-input');
  if (existingValue) input.value = existingValue;
  input.focus();

  // Allow Enter to advance (except textarea)
  if (q.type === 'input' || q.type === 'date') {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') nextQuestion();
    });
  }
}

function nextQuestion() {
  const q = QUESTIONS[currentQuestionIndex];
  const input = document.getElementById('q-input');
  const val = input.value.trim();

  if (!val) {
    showQValidation('Please answer this question to continue.', 'error');
    return;
  }

  if (q.validate) {
    const err = q.validate(val);
    if (err) {
      showQValidation(err, 'error');
      return;
    }
  }

  // Save value
  const transformed = q.transform ? q.transform(val) : val;
  state.projectData[q.field] = transformed;

  // Auto-generate repo name from project name
  if (q.field === 'name') {
    state.projectData.repoName = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  currentQuestionIndex++;

  if (currentQuestionIndex >= QUESTIONS.length) {
    goToStep('github');
  } else {
    renderQuestion(currentQuestionIndex);
  }
}

function prevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderQuestion(currentQuestionIndex);
  }
}

function showQValidation(msg, type) {
  const el = document.getElementById('q-validation');
  el.textContent = msg;
  el.className = `status-message ${type}`;
  el.style.display = 'block';
}

function validateDeadline(val) {
  const selected = new Date(val);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.round((selected - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return 'Deadline must be in the future.';
  if (diffDays < 7) {
    // Allow but warn — we'll show it inline
    showQValidation(`That's only ${diffDays} day(s). Very tight — the agents will run daily but may not have enough cycles. You can still proceed.`, 'error');
  }
  if (diffDays > 365) {
    showQValidation(`${Math.round(diffDays / 30)} months gives the agents plenty of time. Good.`, 'success');
  }
  return null; // No blocking error
}

// ---- Voice input ----

function toggleVoice() {
  if (isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
}

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
    mediaRecorder.onstop = transcribeAudio;
    mediaRecorder.start();

    isRecording = true;
    const btn = document.getElementById('voice-btn');
    btn.classList.add('recording');
    document.getElementById('voice-label').textContent = 'Stop recording';
  } catch (err) {
    alert('Microphone access denied. Please allow microphone access to use voice input.');
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach(t => t.stop());
  }
  isRecording = false;
  const btn = document.getElementById('voice-btn');
  btn.classList.remove('recording');
  document.getElementById('voice-label').textContent = 'Transcribing...';
}

async function transcribeAudio() {
  if (!whisperApiKey) {
    // Prompt for OpenAI key if not set
    const key = prompt('Enter your OpenAI API key to use voice input (optional):');
    if (!key) {
      document.getElementById('voice-label').textContent = 'Answer by voice';
      return;
    }
    whisperApiKey = key;
  }

  const blob = new Blob(audioChunks, { type: 'audio/webm' });
  const formData = new FormData();
  formData.append('file', blob, 'audio.webm');
  formData.append('model', 'whisper-1');

  try {
    const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${whisperApiKey}` },
      body: formData,
    });
    const data = await res.json();
    if (data.text) {
      const input = document.getElementById('q-input');
      input.value = data.text.trim();
      input.focus();
    }
  } catch (err) {
    console.error('Transcription failed:', err);
  }

  document.getElementById('voice-label').textContent = 'Answer by voice';
}
