window.BJ = window.BJ || {};

BJ.QUESTIONS = {
  algebra: [
    { q: 'Solve for x:  3x + 5 = 20', a: 5 },
    { q: 'Solve for x:  2x − 7 = 11', a: 9 },
    { q: 'Solve for x:  x ÷ 4 = 6', a: 24 },
    { q: 'Solve for x:  5x = 45', a: 9 },
    { q: 'Solve for x:  x + 17 = 30', a: 13 },
    { q: 'Solve for x:  4(x − 2) = 20', a: 7 },
    { q: 'Solve for x:  2x + 3 = x + 10', a: 7 },
    { q: 'Solve for x:  6x − 4 = 4x + 8', a: 6 },
    { q: 'Solve for x:  x ÷ 3 + 2 = 7', a: 15 },
    { q: 'Solve for x:  7 − x = 2', a: 5 },
    { q: 'Solve for x:  3(x + 1) = 24', a: 7 },
    { q: 'Solve for x:  10 − 2x = 4', a: 3 },
    { q: 'Solve for x:  x² = 64,  x > 0', a: 8 },
    { q: 'Solve for x:  9x − 3 = 6x + 12', a: 5 },
    { q: 'Solve for x:  −3x = 21', a: -7 },
    { q: 'Solve for x:  x − 8 = −3', a: 5 },
    { q: 'Solve for x:  4x + 1 = 29', a: 7 },
    { q: 'Solve for x:  (x + 6) ÷ 2 = 9', a: 12 },
    { q: 'Solve for x:  5(2x − 1) = 45', a: 5 },
    { q: 'Solve for x:  8 = 2x − 6', a: 7 },
    { q: 'Solve for x:  12 ÷ x = 3', a: 4 },
    { q: 'Solve for x:  x² − 1 = 80,  x > 0', a: 9 },
    { q: 'Solve for x:  3x − 2 = 2x + 4', a: 6 },
    { q: 'Solve for x:  0.5x = 11', a: 22 },
    { q: 'Solve for x:  2(x + 3) − 4 = 12', a: 5 },
    { q: 'Solve for x:  15 − 3x = −6', a: 7 },
    { q: 'Solve for x:  x ÷ 2 − 3 = 1', a: 8 },
    { q: 'Solve for x:  7x + 2 = 5x + 16', a: 7 },
    { q: 'Solve for x:  √x = 6', a: 36 },
    { q: 'If f(x) = 2x + 1, what is f(4)?', a: 9 },
    { q: 'If y = 3x − 2 and x = 5, what is y?', a: 13 },
    { q: 'Solve for x:  2³ + x = 10', a: 2 },
    { q: 'Solve for x:  x + x + x = 27', a: 9 },
    { q: 'Solve for x:  11 − x = x + 1', a: 5 },
    { q: 'Solve for x:  4x − 9 = 3', a: 3 },
    { q: 'Solve for x:  (x − 1)² = 0', a: 1 },
    { q: 'Solve for x:  6 + 2x = 3x', a: 6 },
    { q: 'Solve for x:  100 ÷ x = 25', a: 4 },
    { q: 'What is the slope of  y = 4x − 7?', a: 4 },
    { q: 'Solve for x:  2x + 2x = 32', a: 8 },
  ],
  weird: [
    { q: 'What is the largest prime number?' },
    { q: 'What is 1 ÷ 0?' },
    { q: 'Find the integer x where  x = x + 1' },
    { q: 'What is the last digit of π?' },
    { q: 'Find the integer x where  x² = −1' },
    { q: 'What integer is equal to √2?' },
    { q: 'What is ∞ − ∞?' },
    { q: 'What is 0 ÷ 0?' },
    { q: 'What is the largest integer?' },
    { q: 'What is the smallest odd perfect number?' },
    { q: 'How many sides does a circle have?' },
    { q: 'How many numbers are there between 0 and 1?' },
    { q: 'Find whole numbers a, b, c > 0 where  a³ + b³ = c³.  What is a?' },
    { q: '"This statement is false."  Enter 1 if true, 0 if false.' },
  ],
};

BJ.questionBag = (() => {
  const bags = { algebra: [], weird: [] };
  const draw = kind => {
    if (!bags[kind].length) {
      bags[kind] = BJ.QUESTIONS[kind].map((_, i) => i);
      for (let i = bags[kind].length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bags[kind][i], bags[kind][j]] = [bags[kind][j], bags[kind][i]];
      }
    }
    return BJ.QUESTIONS[kind][bags[kind].pop()];
  };
  return {
    next(weirdChance) {
      const weird = Math.random() < weirdChance;
      const item = draw(weird ? 'weird' : 'algebra');
      return { text: item.q, answer: weird ? null : item.a, weird };
    },
  };
})();

BJ.checkAnswer = (question, input) => {
  if (question.weird) return false;
  const s = String(input).replace(/[−–]/g, '-').replace(/\s+/g, '').replace(/^[a-z]=/i, '');
  return /^-?\d+$/.test(s) && Number(s) === question.answer;
};
