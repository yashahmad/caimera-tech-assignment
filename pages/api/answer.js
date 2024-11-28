import { state } from '../../utils/state';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { username, answer } = req.body;

  if (!username || answer === undefined) {
    res.status(400).json({ error: 'Invalid request. Username and answer are required.' });
    return;
  }

  if (!state.currentQuestion) {
    res.status(400).json({ error: 'No active question at the moment. Please wait for the next question.' });
    return;
  }

  if (state.answeredUsers.has(username)) {
    res.status(400).json({ error: 'You have already answered this question.' });
    return;
  }

  const isCorrect = parseFloat(answer) === state.currentQuestion.answer;

  if (isCorrect) {
    if (!state.scores[username]) {
      state.scores[username] = 0;
    }
    state.scores[username] += 1;

    state.answeredUsers.add(username);
    state.currentQuestion = null;
    res.status(200).json({ message: 'Correct answer! You are the first to answer.' });
  } else {
    res.status(200).json({ message: 'Incorrect answer. Try again!' });
  }
}
