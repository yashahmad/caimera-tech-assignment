import { state, initializeQueue } from '../../utils/state';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');

  // Initialize the queue and assign the first question if not already set
  initializeQueue();
  if (!state.currentQuestion && state.questionQueue.length > 0) {
    state.currentQuestion = state.questionQueue.shift();
    state.answeredUsers.clear();
  }

  const sendUpdates = () => {
    if (!state.currentQuestion && state.questionQueue.length > 0) {
      state.currentQuestion = state.questionQueue.shift();
      state.answeredUsers.clear();
    }

    const data = JSON.stringify({
      currentQuestion: state.currentQuestion,
      scores: state.scores,
    });

    res.write(`data: ${data}\n\n`);
  };

  sendUpdates();

  const interval = setInterval(() => {
    sendUpdates();
  }, 1000);

  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
}
