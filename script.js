const tests = [
  {
    type: 'snellen',
    name: 'Snellen Chart Test',
    questions: [
      {
        id: 1, line: '20/200',
        question: 'What letter do you see?',
        options: ['E', 'F', 'P', "Can't see"],
        correct: 'E',
        chart: [['E']]
      },
      {
        id: 2, line: '20/100',
        question: 'Which letters do you see?',
        options: ['FP', 'TF', 'FZ', "Can't see"],
        correct: 'FP',
        chart: [['F','P']]
      },
      {
        id: 3, line: '20/50',
        question: 'Which letters do you see?',
        options: ['TOZ', 'LPZ', 'FED', "Can't see"],
        correct: 'TOZ',
        chart: [['T','O','Z']]
      }
    ]
  },
  {
    type: 'ishihara',
    name: 'Color Vision Test',
    questions: [
      {
        id: 1, line: 'Plate 1',
        question: 'What number do you see?',
        options: ['12', '8', '29', "Nothing"],
        correct: '12',
        chart: [['12']]
      },
      {
        id: 2, line: 'Plate 2',
        question: 'What number do you see?',
        options: ['8', '3', '6', "Nothing"],
        correct: '8',
        chart: [['8']]
      }
    ]
  }
];

const main = document.getElementById('main');
let currentTest, currentQIdx, userAnswers = [];

function showHome() {
  main.innerHTML = `
    <h2>Welcome to VisionCheck</h2>
    <p>Start your vision screening below. This does NOT replace professional checkups!</p>
    <button onclick="showTestMenu()">Start Test</button>
  `;
}

function showTestMenu() {
  main.innerHTML = `<h3>Select a Test</h3>` + tests.map((test,i) =>
    `<button onclick="startTest(${i})">${test.name}</button>`
  ).join('<br>') +
  `<div style="margin-top:18px"><button onclick="showHome()">Back</button></div>`;
}

function startTest(idx) {
  currentTest = tests[idx];
  currentQIdx = 0;
  userAnswers = [];
  showQuestion();
}

function showQuestion() {
  const q = currentTest.questions[currentQIdx];
  main.innerHTML = `
    <h3>${currentTest.name}</h3>
    <div class="test-question">
      <div><b>Question ${currentQIdx+1}:</b> ${q.question}</div>
      <div style="margin:13px 0 11px 0">
        ${q.chart.map(line => `<div style="font-size:1.7em;text-align:center">${line.join(' ')}</div>`).join('')}
        <div style="font-size:0.9em;color:grey;margin:3px 0">${q.line}</div>
      </div>
      <div class="options">
        ${q.options.map(opt =>
          `<label><input type="radio" name="q${q.id}" value="${opt}" onchange="selectOption('${opt}')"> ${opt}</label><br>`
        ).join('')}
      </div>
    </div>
    <button onclick="prevQ()" ${currentQIdx===0?'disabled':''}>Prev</button>
    <button id="nextBtn" onclick="nextQ()" disabled>${currentQIdx===currentTest.questions.length-1?'Finish':'Next'}</button>
    <div><button style="margin-top:14px;" onclick="showTestMenu()">Back to Test Menu</button></div>
  `;
  updateSelected();
}

function selectOption(opt) {
  userAnswers[currentQIdx] = opt;
  document.getElementById('nextBtn').disabled = false;
}

function updateSelected() {
  if(userAnswers[currentQIdx]) {
    const radios = document.getElementsByName('q'+currentTest.questions[currentQIdx].id);
    radios.forEach(r => { if(r.value===userAnswers[currentQIdx]) r.checked = true; });
    document.getElementById('nextBtn').disabled = false;
  }
}

function nextQ() {
  if(currentQIdx < currentTest.questions.length-1) {
    currentQIdx++;
    showQuestion();
  } else {
    showResult();
  }
}

function prevQ() {
  if(currentQIdx>0) {
    currentQIdx--;
    showQuestion();
  }
}

function showResult() {
  let correct=0;
  currentTest.questions.forEach((q,i)=>{
    if(userAnswers[i] === q.correct) correct++;
  });
  const score = Math.round((correct/currentTest.questions.length)*100);
  let advice = "Please consult an eye specialist for confirmation.";
  if(score === 100) advice = "Excellent! Your test shows no errors.";
  else if(score >= 70) advice = "Your results are good, but periodic checkups are important.";

  main.innerHTML = `
    <h3>Test Results</h3>
    <div class="result">Your score: <b>${score}%</b></div>
    <div>${advice}</div>
    <button onclick="showTestMenu()">Take Another Test</button>
    <div class="feedback">
      <h4>Your Feedback</h4>
      <textarea id="fb" rows="2" style="width:98%"></textarea><br>
      <button onclick="submitFB()">Submit Feedback</button>
    </div>
  `;
}

function submitFB() {
  const val=document.getElementById('fb').value||'';
  alert('Feedback received. Thank you!');
  showHome();
}

// Initial page load
showHome();
