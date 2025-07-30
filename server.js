const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Health check route
app.get('/', (req, res) => {
  res.send('VisionCheck backend running!');
});

// Endpoint to receive vision test answers and return a score
app.post('/api/submit-test', (req, res) => {
  const { testType, answers } = req.body;
  if (!testType || !answers) {
    return res.status(400).json({ error: 'Missing testType or answers' });
  }

  // Simple example: score based on number of correct answers compared to hardcoded correct answers
  // You can customize this scoring logic later
  const correctAnswers = { snellen: ['E', 'FP', 'TOZ'], ishihara: ['12', '8', '29'] };
  const correct = correctAnswers[testType] || [];
  let score = 0;
  answers.forEach((ans, i) => {
    if (ans === correct[i]) score++;
  });
  const percentage = (score / correct.length) * 100;

  res.json({ success: true, score: percentage });
});

// Start server on specified port
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
