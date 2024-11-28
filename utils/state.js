// utils/state.js

const state = {
    questionQueue: [],
    currentQuestion: null,
    scores: {},
    answeredUsers: new Set(),
  };
  
  function generateMathProblem() {
    const num1 = Math.floor(Math.random() * 50) + 1;
    const num2 = Math.floor(Math.random() * 50) + 1;
    const operator = ['+', '-', '*'][Math.floor(Math.random() * 3)];
    const question = `${num1} ${operator} ${num2}`;
    return { question, answer: eval(question), id: Date.now() };
  }
  
  function initializeQueue() {
    if (state.questionQueue.length === 0) {
      for (let i = 0; i < 10; i++) {
        state.questionQueue.push(generateMathProblem());
      }
    }
  }
  
  module.exports = {
    state,
    generateMathProblem,
    initializeQueue,
  };
  