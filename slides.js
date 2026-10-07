window.BJ = window.BJ || {};

BJ.SECTIONS = {
  intro: 'Intro',
  game: 'Bijo Snake',
  framework: 'Knowledge framework',
  scope: 'Scope',
  pure: 'Pure vs applied',
  perspectives: 'Perspectives',
  methods: 'Methods and tools',
  ethics: 'Ethics',
  back: 'Back to Bijo',
  wrap: 'Wrap up',
};

BJ.DECK = [
  {
    id: 'title', section: 'intro', type: 'title', minutes: 1,
    title: 'Mathematics',
    subtitle: 'A TOK area of knowledge, feat. Bijo',
    notes: 'Have everyone open the link and type their first name. Check the player count in the panel. Once everyone is in, start. Do not explain the game or why Bijo is here.',
  },
  {
    id: 'what-is-math', section: 'intro', type: 'bullets', minutes: 2, peek: true,
    title: 'What is math?',
    items: [
      'The study of numbers?',
      'The study of patterns?',
      'A language?',
      'A game with made-up rules?',
      { kind: 'aside', text: 'Mathematicians still argue about this.' },
    ],
    notes: 'Ask the room for a definition before revealing anything. Then reveal one at a time. Remember the last one, "a game with made-up rules". It comes back in Perspectives.',
  },
  {
    id: 'kinds', section: 'intro', type: 'bullets', minutes: 2,
    title: 'Three ways to know math',
    items: [
      { term: 'Knowing that', text: '7 is a prime number' },
      { term: 'Knowing how', text: 'solving 3_x_ + 5 = 20' },
      { term: 'Map-like', text: 'seeing how algebra, geometry and stats fit together' },
      { kind: 'aside', text: 'People call math the most certain AoK. Let’s test that.' },
    ],
    notes: 'These are the three kinds of AoK knowledge from our intro unit: propositional (knowing that), procedural (knowing how) and map-like (the big picture). Ask: which one do math tests mostly check? Usually knowing how.',
  },
  {
    id: 'play1', section: 'game', type: 'game', panel: 'play', minutes: 6,
    title: 'Bijo Snake',
    notes: 'Say nothing about math. Just let them play. Suggested run: first 2 minutes normal with no questions. Then set math questions to about 30% and leave weird questions at 10%. Around minute 4, raise the speed and spawn rate. Use force pause or a banner if it gets loud. Post "Last 60 seconds" near the end, block new games, then move on.',
  },
  {
    id: 'math-before', section: 'game', type: 'poll', minutes: 2, scale: true,
    title: 'How much math was in that game?',
    poll: 'math-before',
    options: ['None', 'A little', 'Some', 'A lot', 'All of it'],
    notes: 'Everyone votes, then press Next to show results. Most people will say 1 to 3. Do not argue. We ask this exact question again at the very end.',
  },
  {
    id: 'where-math', section: 'game', type: 'stats', minutes: 2,
    title: 'So where was the math?',
    items: [
      'Random algebra questions popped up',
      'Some of them were strange',
      'Other than that, it was just a game. Right?',
      { kind: 'aside', text: 'Hold that thought.' },
    ],
    notes: 'Read the class numbers out loud. If anyone got "The answer was ???", do not explain it yet. We come back to those in Methods.',
  },
  {
    id: 'framework', section: 'framework', type: 'bullets', minutes: 2,
    title: 'How TOK looks at an AoK',
    items: [],
    visual: {
      kind: 'quad',
      steps: 4,
      boxes: [
        { head: 'Scope', text: 'What counts as math?' },
        { head: 'Perspectives', text: 'How do people see it?' },
        { head: 'Methods and tools', text: 'How does math make knowledge?' },
        { head: 'Ethics', text: 'What are right and wrong uses?' },
      ],
    },
    notes: 'Same knowledge framework from the AoK intro. We go through all four parts, then use Bijo Snake to tie them together.',
  },
  {
    id: 'scope', section: 'scope', type: 'bullets', minutes: 2,
    title: 'Scope: what counts as math?',
    items: [
      'Number, shape, change, chance and logic',
      'Branches: algebra, geometry, calculus, statistics, number theory and more',
      'Most AoKs hold several subjects. Math mostly holds one.',
      { kind: 'aside', text: 'So why is math its own AoK instead of part of natural sciences?' },
    ],
    notes: 'Steer toward: math does not use experiments or observation. Its truths come from proof. Science depends on math, but math does not depend on experiments.',
  },
  {
    id: 'is-it-math', section: 'scope', type: 'multipoll', minutes: 2.5,
    title: 'Is it math?',
    sub: 'Vote on each one.',
    poll: 'is-math',
    items: ['Sudoku', 'Chess', 'Music', 'Knitting', 'Origami', 'Bijo Snake'],
    options: ['Math', 'Not math'],
    facts: [
      'No arithmetic at all. Pure logic.',
      'Chess engines search huge trees of possible moves.',
      'An octave is a 2 : 1 frequency ratio.',
      'Crochet can model hyperbolic geometry.',
      'Fold patterns pack satellite solar panels.',
      'Stay tuned.',
    ],
    notes: 'Votes first. Next shows results, then Next again shows a fact for each. Daina Taimina crocheted hyperbolic planes in 1997. The Miura fold packed solar panels for a Japanese satellite in 1995. Leave Bijo Snake as a cliffhanger.',
  },
  {
    id: 'group-q', section: 'scope', type: 'question', minutes: 1.5, timer: 120,
    question: 'What other subjects could be grouped with math? Why aren’t they?',
    sub: 'Talk at your table.',
    notes: 'From the AoK intro scope questions. Likely answers: computer science, logic, physics, music, economics. Push back: is math defined by its content (numbers) or by its method (proof)?',
  },
  {
    id: 'pure-applied', section: 'pure', type: 'split', minutes: 1.5,
    title: 'Pure vs applied',
    left: { head: 'Pure math', items: ['Math for its own sake', 'Asks: is it true?', 'Judged by proof and beauty', 'Example: prime numbers'] },
    right: { head: 'Applied math', items: ['Math used to solve problems', 'Asks: does it work?', 'Judged by results', 'Example: weather forecasts'] },
    notes: 'Keep it quick. The split looks clean. The next few slides break it.',
  },
  {
    id: 'hardy', section: 'pure', type: 'quote', minutes: 2,
    quote: 'No one has yet discovered any warlike purpose to be served by the theory of numbers or relativity, and it seems unlikely that anyone will do so for many years.',
    by: 'G. H. Hardy, A Mathematician’s Apology (1940)',
    items: [
      'Hardy loved number theory because it was useless',
      '1977: RSA encryption is built on prime numbers',
      'Today number theory protects online payments and passwords',
      { kind: 'aside', text: 'The credit cards in Bijo Snake? Hardy’s useless math protects the real ones.' },
    ],
    notes: 'Hardy was proud that his math had no practical use. Within 40 years his favorite field became the base of internet security. Ask: was number theory ever really pure, or just not applied yet?',
  },
  {
    id: 'pure-or-applied', section: 'pure', type: 'multipoll', minutes: 2.5,
    title: 'Pure or applied?',
    sub: 'Sort each one.',
    poll: 'pure-applied',
    items: ['Prime numbers', 'Imaginary numbers', 'Knot theory', 'Non-Euclidean geometry', 'Boolean logic', 'Graph theory'],
    options: ['Pure', 'Applied', 'Both'],
    notes: 'Let them vote, then show results. The next slide reveals the twist.',
  },
  {
    id: 'twist', section: 'pure', type: 'bullets', minutes: 1.5,
    title: 'Plot twist: all six started pure',
    items: [
      'Prime numbers became encryption',
      { with: true, text: 'Imaginary numbers became electrical engineering' },
      'Knot theory became DNA research',
      { with: true, text: 'Non-Euclidean geometry became relativity and GPS' },
      'Boolean logic became every computer chip',
      { with: true, text: 'Graph theory became map routing' },
    ],
    notes: 'Details if asked: Boole published his logic in 1854 and Claude Shannon used it for circuits in 1937. Non-Euclidean geometry from the 1800s became the math of Einstein’s general relativity (1915), and GPS clocks need relativity corrections. Graph theory started with Euler’s Konigsberg bridges puzzle in 1736.',
  },
  {
    id: 'pure-applied-q', section: 'pure', type: 'question', minutes: 2.5, timer: 150,
    question: 'To what extent can we differentiate between pure and applied math?',
    sub: 'Use Hardy and the six examples.',
    notes: 'Possible angles: the difference is the intention of the mathematician, not the math itself. Or: all math is potentially applied, we just do not know when. Or: applied problems also create new pure math (calculus grew out of physics).',
  },
  {
    id: 'invented', section: 'perspectives', type: 'poll', minutes: 1,
    title: 'Is math invented or discovered?',
    poll: 'invented',
    options: ['Invented', 'Discovered', 'Some of both', 'Not sure'],
    notes: 'Quick vote. Show results, then go to the three views.',
  },
  {
    id: 'three-views', section: 'perspectives', type: 'bullets', minutes: 2,
    title: 'Three ways to see math',
    items: [
      { term: 'Platonism', text: 'math is discovered. 2 + 2 = 4 was true before any humans.' },
      { term: 'Formalism', text: 'math is a game of symbols and rules.' },
      { term: 'Intuitionism', text: 'math is built inside human minds.' },
      { kind: 'aside', text: 'Which one matches how you voted?' },
    ],
    notes: 'Platonism: numbers exist in an abstract world that we find (Plato, and many mathematicians, including Godel). Formalism: math is following rules with symbols, and meaning does not matter (linked to David Hilbert). Intuitionism: math only exists as mental constructions (L. E. J. Brouwer). Discovered matches Platonism. Invented matches the other two.',
  },
  {
    id: 'formalism', section: 'perspectives', type: 'bullets', minutes: 1,
    title: 'Math as a game',
    items: [
      'Bijo Snake has rules nobody discovered',
      'Inside the game, the rules are always true',
      'Break one and the game ends',
      { kind: 'aside', text: 'Is math just a much bigger game?' },
    ],
    visual: { kind: 'demo', name: 'wall' },
    notes: 'This is formalism with Bijo. "Stay inside the board" is not true about the universe. It is true inside the game. Ask: is 2 + 2 = 4 the same kind of truth?',
  },
  {
    id: 'whose-math', section: 'perspectives', type: 'bullets', minutes: 2,
    title: 'Whose math?',
    items: [
      'Babylon used base 60. That is why an hour has 60 minutes.',
      'The Maya used base 20 and had their own zero.',
      'Brahmagupta (628 CE) wrote rules for zero. He said 0 ÷ 0 = 0.',
      { kind: 'aside', text: 'Today we call it undefined. Who decided that?' },
    ],
    notes: 'Math looks universal, but the notation, the base and even some answers were choices made by cultures. Was Brahmagupta wrong, or did the rules change? Remember 0 ÷ 0 from the game questions.',
  },
  {
    id: 'cultures', section: 'perspectives', type: 'poll', minutes: 1,
    title: 'Where does math belong?',
    sub: 'C. P. Snow (1959) said there are two cultures: the sciences and the humanities.',
    poll: 'cultures',
    options: ['Sciences', 'Humanities', 'Both', 'Neither'],
    notes: 'From the AoK intro perspectives slide. Math has no experiments, so is it a science? It is not about human experience, so is it a humanity? Class KQ: to what extent is it helpful to think of disciplines as cultures?',
  },
  {
    id: 'proof', section: 'methods', type: 'bullets', minutes: 1.5,
    title: 'Methods: proof',
    items: [
      'Start with axioms: things we agree to accept',
      'Use logic, one step at a time',
      'Reach a theorem',
      'Once proven, it is true forever',
      { kind: 'aside', text: 'No lab, no experiments. New evidence can’t overturn it.' },
    ],
    visual: { kind: 'flow', at: 1, boxes: ['Axioms', 'Logic', 'Theorem'] },
    notes: 'Deductive proof is the method from the AoK intro list. Example: Euclid proved there are infinitely many primes around 300 BCE. It is still true and still taught. Compare with science, where new evidence can overturn a theory.',
  },
  {
    id: 'circles', section: 'methods', type: 'poll', minutes: 3,
    title: 'What comes next?',
    sub: 'Put dots on a circle and connect every pair. Count the regions.',
    poll: 'circles',
    options: ['32', '31', '30', 'Something else'],
    visual: { kind: 'demo', name: 'circles', revealAt: 2 },
    reveal: 'The pattern broke at 6 dots. Spotting a pattern is induction. In math it is only a guess until it is proven.',
    notes: 'Most people say 32. It is 31, with the dots placed so no three lines meet at one point. The doubling pattern breaks at 6 dots. Formula: (n choose 4) + (n choose 2) + 1. This is the inductive vs deductive point from the methods list.',
  },
  {
    id: 'one-is-two', section: 'methods', type: 'proof', minutes: 3,
    title: 'Proof that 1 = 2',
    sub: 'Find the mistake.',
    lines: [
      'Let  _a_ = _b_',
      'Multiply by _a_:   _a_² = _ab_',
      'Subtract _b_²:   _a_² − _b_² = _ab_ − _b_²',
      'Factor:   (_a_ + _b_)(_a_ − _b_) = _b_(_a_ − _b_)',
      'Divide by (_a_ − _b_):   _a_ + _b_ = _b_',
      'Since _a_ = _b_:   2_b_ = _b_',
      'Divide by _b_:   2 = 1',
    ],
    mistake: 4,
    note: 'If _a_ = _b_, then _a_ − _b_ = 0. That line divides by zero.',
    notes: 'Give them a minute to find it. The mistake is dividing by (a − b), which is zero. Callback: "What is 1 ÷ 0?" was one of the game questions. Dividing by zero breaks math, so it is left undefined.',
  },
  {
    id: 'who-checks', section: 'methods', type: 'bullets', minutes: 1.5,
    title: 'Who checks a proof?',
    items: [
      '1993: Andrew Wiles proves Fermat’s Last Theorem',
      'Reviewers find a gap. He fixes it a year later.',
      '1976: the Four Color Theorem is proven with a computer',
      'No person has checked every case by hand',
      { kind: 'aside', text: 'Is it knowledge if no one can read the whole proof?' },
    ],
    notes: 'Wiles announced in 1993, fixed the gap with Richard Taylor in 1994, and it was published in 1995. Appel and Haken’s computer checked almost 2,000 cases. Proof depends on a community of experts, and now on machines too.',
  },
  {
    id: 'weird', section: 'methods', type: 'weird', minutes: 2.5,
    title: 'Remember the ??? questions?',
    categories: [
      { head: 'Proven impossible', examples: ['What is the largest prime number?', 'What integer is equal to √2?'] },
      { head: 'Undefined', examples: ['What is 1 ÷ 0?', 'What is ∞ − ∞?'] },
      { head: 'Nobody knows yet', examples: ['What is the smallest odd perfect number?'] },
      { head: 'Depends on definitions', examples: ['How many sides does a circle have?'] },
    ],
    punchline: 'Every answer counted as wrong. On purpose.',
    notes: 'Euclid proved there is no largest prime around 300 BCE. Nobody knows if any odd perfect number exists. A circle has 0, 1, 2 or infinitely many sides depending on how you define a side. Ask: if a question has no answer, is it still a math question?',
  },
  {
    id: 'limits', section: 'methods', type: 'bullets', minutes: 2.5, timer: 90,
    title: 'Can math answer everything?',
    items: [
      '1930: David Hilbert says “We must know. We will know.”',
      '1931: Kurt Gödel proves some true statements can never be proven',
      'Any rule system strong enough for arithmetic has gaps',
      { kind: 'tok', text: 'If math has limits, why do we trust it more than any other AoK?' },
    ],
    notes: 'Godel’s incompleteness theorem: any consistent system of rules that can do basic arithmetic has true statements it cannot prove. Fun fact: Godel first announced it at a conference in Konigsberg in 1930, the day before Hilbert’s famous speech there. Use the TOK question for a quick table discussion.',
  },
  {
    id: 'neutral', section: 'ethics', type: 'bullets', minutes: 1,
    title: 'Ethics: is math neutral?',
    items: [
      'A formula does not care who it affects',
      'People choose the data, the numbers and the goal',
      'Hidden math makes decisions about you every day',
      { kind: 'aside', text: 'Grades, credit scores, what your feed shows you.' },
    ],
    notes: 'Cathy O’Neil’s book Weapons of Math Destruction (2016) describes algorithms that are hidden, used at a huge scale, and can cause harm. This sets up the ethics activity.',
  },
  {
    id: 'fair', section: 'ethics', type: 'multipoll', minutes: 3.5,
    title: 'Fair or not?',
    sub: 'Vote on each one.',
    poll: 'fair',
    items: [
      'Someone secretly changed your game settings while you played',
      'Some questions had no right answer and ended your game',
      'A game says a rare item drops 1% of the time. It is really 0.1%.',
      '2020: exams were canceled, so a statistical model helped set IB grades',
    ],
    options: ['Fair', 'Unfair', 'Depends'],
    notes: 'This is the ethics activity. Let everyone vote, show results, then ask a few people to defend their vote. 2020 IB: May exams were canceled because of COVID. Grades came from coursework, predicted grades and data about each school. Many students got lower grades than expected, there were protests, and the IB revised results in August 2020.',
  },
  {
    id: 'confession', section: 'ethics', type: 'bullets', minutes: 1.5,
    title: 'Confession',
    items: [
      'I controlled your game the whole time',
      'Speed, spawns, question odds, pauses, all of it',
      'You could not see any of it',
      { kind: 'aside', text: 'Did it feel fair while you were playing?' },
    ],
    visual: { kind: 'image', src: 'admin-shot.png', at: 1, alt: 'The control panel used to run your game' },
    notes: 'Show them the control panel. Most algorithms work like this: you see the result, never the settings. Who should be allowed to set the numbers?',
  },
  {
    id: 'ethics-q', section: 'ethics', type: 'question', minutes: 3.5, timer: 180,
    question: 'Who is responsible when math is used unfairly: the math, the person who built it, or the person who used it?',
    sub: 'Then: how can we know when a method should not be used?',
    notes: 'The second question comes straight from the AoK intro ethics KQs. Push: math itself seems neutral, but choosing a model, its data and where to use it are human choices.',
  },
  {
    id: 'coords', section: 'back', type: 'bullets', minutes: 2,
    title: 'The board is a coordinate plane',
    items: [
      'You said the math was the random questions. Look closer.',
      'Bijo’s board is 12 by 9 tiles. Each tile is a point (_x_, _y_).',
      'Descartes came up with coordinates in 1637',
      'On screens _y_ goes down. In math class it goes up.',
      { kind: 'aside', text: 'Neither is wrong. It is a convention.' },
    ],
    visual: { kind: 'demo', name: 'grid', coordsAt: 2, axesAt: 4 },
    notes: 'Descartes’ La Geometrie (1637) joined algebra and geometry, so every shape could become an equation. Ask: who decided y goes down on screens? Conventions show part of math is human choice.',
  },
  {
    id: 'vectors', section: 'back', type: 'bullets', minutes: 1.5,
    title: 'Moving is adding vectors',
    items: [
      'Each direction is a vector',
      'Every move: new head = head + direction',
      'No U-turns: you can’t add the opposite vector',
    ],
    code: {
      at: 1,
      src: 'const UP    = [0, -1];\nconst DOWN  = [0,  1];\nconst LEFT  = [-1, 0];\nconst RIGHT = [1,  0];\n\nconst head = [hx + dir[0], hy + dir[1]];',
    },
    visual: { kind: 'demo', name: 'grid', coordsAt: 0, vectorAt: 0 },
    notes: 'This is the real game code. A direction is a pair of numbers, and moving is vector addition. A U-turn would add the negative of the current vector, so the game blocks it.',
  },
  {
    id: 'lerp', section: 'back', type: 'bullets', minutes: 2,
    title: 'Smooth movement is a straight line',
    items: [
      'Bijo slides between tiles with one formula',
      '_position_ = _from_ + (_to_ − _from_) × _t_',
      '_t_ goes from 0 to 1 during each move',
      'The golden dumpling uses the same formula for color',
    ],
    code: {
      at: 2,
      src: 'const t = moveTimer / moveDelay;  // 0 to 1\nconst x = from[0] + (to[0] - from[0]) * t;\nconst y = from[1] + (to[1] - from[1]) * t;',
    },
    visual: { kind: 'demo', name: 'lerp', tintAt: 4 },
    notes: 'When I asked for smoother movement, the fix was linear interpolation, which is the equation of a line. The golden dumpling mixes 39% gold into the picture with the same formula. Same math, once for motion and once for color.',
  },
  {
    id: 'crash', section: 'back', type: 'bullets', minutes: 1.5,
    title: 'Crashing is logic',
    items: [
      'The board is a set: {(_x_, _y_) : 0 ≤ _x_ < 12, 0 ≤ _y_ < 9}',
      'Leave the set and you crash',
      '|| means OR. That is Boolean logic from 1854.',
      { kind: 'aside', text: 'Pure math from 1854, running in your browser.' },
    ],
    code: {
      at: 2,
      src: 'if (head[0] < 0 || head[0] >= W ||\n    head[1] < 0 || head[1] >= H) {\n  return false;  // hit a wall\n}\nif (containsPos(state.body, head)) {\n  return false;  // hit yourself\n}',
    },
    visual: { kind: 'demo', name: 'grid', wallsAt: 1 },
    notes: 'Set notation and inequalities decide when you lose. George Boole published his algebra of logic in 1854 as pure math. Every if statement uses it now.',
  },
  {
    id: 'experiment', section: 'back', type: 'game', panel: 'experiment', minutes: 2.5,
    title: 'Experiment',
    notes: 'Mini activity. Turn math questions off for this one. Let everyone play for about 2 minutes. The game counts every Robux and credit card that spawns while people are playing. Then press Next to reveal the prediction. With default settings: (60 ÷ 2) × 0.8 = 24 per minute.',
  },
  {
    id: 'chance', section: 'back', type: 'bullets', minutes: 1.5,
    title: 'Chance runs the game',
    items: [
      'Every {spawnSecs} seconds there is a {spawnPct} chance an item spawns',
      'Prediction: {predicted} items per minute',
      'You measured: {measured} per minute',
      { kind: 'aside', text: 'Calculating it is deductive. Measuring it is inductive.' },
    ],
    code: {
      at: 1,
      src: 'if (Math.random() < control.spawn_chance) {\n  spawnItem();\n}',
    },
    visual: { kind: 'demo', name: 'probability' },
    notes: 'The demo runs hundreds of spawn attempts. The measured rate wobbles, then settles near the prediction. That is the law of large numbers. Our class measurement is inductive and the formula is deductive. Also: Math.random is not truly random. It is a formula that only looks random.',
  },
  {
    id: 'hamilton', section: 'back', type: 'bullets', minutes: 2,
    title: 'Can Bijo play perfectly?',
    items: [
      'A path through every tile that loops back is a Hamiltonian cycle',
      'Hamilton turned it into a puzzle in 1857',
      'A grid has one if a side is even. Ours is 12 wide.',
      'So a perfect game exists, proven without playing',
      { kind: 'aside', text: 'The same math plans delivery routes.' },
    ],
    visual: { kind: 'demo', name: 'hamilton' },
    notes: 'Theorem: an m by n grid (both at least 2) has a Hamiltonian cycle exactly when m times n is even. Hamilton sold it as the Icosian game in 1857. Following this loop, Bijo can fill the whole board without crashing. Pure math guarantees it before anyone plays.',
  },
  {
    id: 'float', section: 'back', type: 'bullets', minutes: 1,
    title: 'Computers do math... almost',
    items: [
      'Computers store numbers in binary',
      'Some decimals can never be stored exactly',
      'Applied math has to live with tiny errors',
      { kind: 'aside', text: 'Is computer math real math?' },
    ],
    code: {
      at: 2,
      src: '0.1 + 0.2;          // 0.30000000000000004\n0.1 + 0.2 === 0.3;  // false',
    },
    notes: '0.1 in binary repeats forever, like 1/3 in decimal, so the computer rounds it. In pure math 0.1 + 0.2 is exactly 0.3. Ask: which answer is true, the proven one or the one running the game?',
  },
  {
    id: 'model', section: 'back', type: 'split', minutes: 2,
    title: 'Bijo Snake is pure and applied',
    left: { head: 'The rules (pure)', items: ['A 12 by 9 grid is an abstract space', 'The rules work like axioms', 'A perfect game is a theorem', 'True even if nobody ever plays'] },
    right: { head: 'The running game (applied)', items: ['Code turns rules into motion', 'Timers, randomness and rounding', 'Built for a purpose: fun', 'Judged by whether it works'] },
    footer: 'Same game. Where is the line?',
    notes: 'Callback to the pure vs applied question. The game sits in both at once, which is the point: the line is blurry.',
  },
  {
    id: 'web', section: 'back', type: 'web', minutes: 2,
    title: 'Bijo connects to every AoK',
    nodes: [
      { aok: 'Arts', text: 'Pixel art, color blending, a 4 : 3 frame' },
      { aok: 'Natural sciences', text: 'Speed = distance ÷ time: one tile every 0.18 s' },
      { aok: 'Human sciences', text: 'Random rewards keep you playing' },
      { aok: 'History', text: 'Descartes 1637, the first snake game 1976, Nokia 1997' },
      { aok: 'Ethics', text: 'Hidden settings decided your game' },
    ],
    notes: 'Human sciences: psychologists call random rewards a variable ratio schedule (B. F. Skinner), the same idea behind loot boxes. History: Blockade (1976) was the first snake game, and Nokia put Snake on phones in 1997. Math is the glue between all of them.',
  },
  {
    id: 'effective-q', section: 'back', type: 'question', minutes: 3, timer: 180,
    question: 'Why is math so useful in areas of knowledge that have nothing to do with numbers?',
    sub: 'Eugene Wigner (1960) called it “the unreasonable effectiveness of mathematics.”',
    notes: 'Push: does math describe the world, or do we only notice the parts math can describe? Did math fit the game, or did we build the game to fit math?',
  },
  {
    id: 'math-after', section: 'wrap', type: 'poll', minutes: 1.5, scale: true,
    title: 'Now: how much math was in that game?',
    poll: 'math-after',
    compare: 'math-before',
    options: ['None', 'A little', 'Some', 'A lot', 'All of it'],
    notes: 'Same question as the start. Results show before and now side by side. Hopefully the class moved toward 5.',
  },
  {
    id: 'takeaways', section: 'wrap', type: 'bullets', minutes: 1, peek: true,
    title: 'What to take away',
    items: [
      'Math is certain, but only inside its own rules',
      'Pure and applied math blur together',
      'Math shapes other AoKs, and they shape math',
      'Math is never fully neutral',
    ],
    notes: 'Quick recap, then free play.',
  },
  {
    id: 'final', section: 'wrap', type: 'game', panel: 'final', minutes: 5,
    title: 'Free play',
    notes: 'Unblock new games, turn questions back on if you want, and let them play. The leaderboard shows the best scores of the day. Thank everyone.',
  },
];

(() => {
  const escapeHtml = s => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  BJ.fmt = text => escapeHtml(text)
    .replace(/_([^_]+)_/g, '<i class="m">$1</i>')
    .replace(/\{([a-zA-Z]+)\}/g, '<span class="live" data-live="$1">?</span>');

  BJ.highlight = src => {
    const re = /(\/\/.*$)|('(?:[^'\\]|\\.)*')|\b(const|let|var|if|else|return|function|true|false|null|new)\b|\b(\d+(?:\.\d+)?)\b/gm;
    let out = '';
    let last = 0;
    for (const m of src.matchAll(re)) {
      out += escapeHtml(src.slice(last, m.index));
      const cls = m[1] ? 'c' : m[2] ? 's' : m[3] ? 'k' : 'n';
      out += `<span class="tok-${cls}">${escapeHtml(m[0])}</span>`;
      last = m.index + m[0].length;
    }
    return out + escapeHtml(src.slice(last));
  };

  const itemText = it => (typeof it === 'string' ? it : it.text);

  BJ.plan = slide => {
    switch (slide.type) {
      case 'bullets':
      case 'stats':
      case 'quote': {
        let s = 0;
        const items = (slide.items || []).map(it => (typeof it === 'object' && it.with ? s : ++s));
        const total = Math.max(s, slide.visual?.at ?? 0, slide.visual?.steps ?? 0, slide.code?.at ?? 0);
        return { items, total };
      }
      case 'poll': return { total: slide.visual?.revealAt ?? 1 };
      case 'multipoll': return { total: slide.facts ? 2 : 1 };
      case 'split': return { total: slide.footer ? 3 : 2 };
      case 'proof': return { total: 3 };
      case 'weird': return { total: slide.categories.length + 1 };
      case 'web': return { total: slide.nodes.length };
      case 'game': return { total: slide.panel === 'experiment' ? 1 : 0 };
      default: return { total: 0 };
    }
  };

  BJ.slideSteps = slide => BJ.plan(slide).total;

  BJ.slideLabel = slide => slide.title || slide.question || slide.id;

  function h(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function frag(e, step, list) {
    e.classList.add('frag');
    e.dataset.step = step;
    list.push(e);
    return e;
  }

  function pointList(items, steps, frags) {
    const ul = h('ul', 'points');
    items.forEach((it, i) => {
      const li = h('li', typeof it === 'object' && it.kind ? `pt pt--${it.kind}` : 'pt');
      if (typeof it === 'object' && it.term) {
        li.innerHTML = `<b class="term">${BJ.fmt(it.term)}:</b> ${BJ.fmt(it.text)}`;
      } else if (typeof it === 'object' && it.kind === 'tok') {
        li.innerHTML = `<span class="hl">${BJ.fmt(it.text)}</span>`;
      } else {
        li.innerHTML = BJ.fmt(itemText(it));
      }
      ul.appendChild(frag(li, steps[i], frags));
    });
    return ul;
  }

  function codeBlock(code, frags) {
    const pre = h('pre', 'code');
    pre.innerHTML = `<code>${BJ.highlight(code.src)}</code>`;
    return frag(pre, code.at ?? 0, frags);
  }

  function mountDemo(name, opts, env) {
    const canvas = h('canvas', 'demo-canvas');
    const make = BJ.demos[name];
    const demo = make(canvas, {
      ...opts,
      chance: () => env.control().spawn_chance,
    });
    demo.init?.();
    return { canvas, demo };
  }

  function visualFor(slide, env, frags, demos) {
    const v = slide.visual;
    if (!v) return null;
    const wrap = h('div', `visual visual--${v.kind}`);
    if (v.kind === 'demo') {
      const { canvas, demo } = mountDemo(v.name, v, env);
      wrap.appendChild(canvas);
      demos.push(demo);
    } else if (v.kind === 'image') {
      const img = h('img', 'shot');
      img.src = v.src;
      img.alt = v.alt || '';
      wrap.appendChild(img);
    } else if (v.kind === 'quad') {
      v.boxes.forEach((b, i) => {
        const box = h('div', 'quad-box', `<h3>${BJ.fmt(b.head)}</h3><p>${BJ.fmt(b.text)}</p>`);
        wrap.appendChild(frag(box, i + 1, frags));
      });
      return wrap;
    } else if (v.kind === 'flow') {
      v.boxes.forEach((b, i) => {
        if (i) wrap.appendChild(h('div', 'flow-arrow', '↓'));
        wrap.appendChild(h('div', 'flow-box', BJ.fmt(b)));
      });
    }
    return frag(wrap, v.at ?? 0, frags);
  }

  function peek(el) {
    const img = h('img', 'peek');
    img.src = 'bijo_forward.png';
    img.alt = '';
    el.appendChild(img);
  }

  function liveTokens(el, data) {
    const c = data.control;
    const s = data.summary || {};
    const minutes = (s.exp_ms || 0) / 60000;
    const values = {
      spawnSecs: String(Number((c.spawn_delay / 1000).toFixed(2))),
      spawnPct: `${Math.round(c.spawn_chance * 100)}%`,
      predicted: BJ.predictedRate(c).toFixed(1).replace(/\.0$/, ''),
      measured: minutes > 0.05 ? (s.exp_spawned / minutes).toFixed(1) : '?',
      qWeird: String(s.q_weird ?? 0),
    };
    el.querySelectorAll('[data-live]').forEach(span => {
      const v = values[span.dataset.live];
      if (v !== undefined) span.textContent = v;
    });
  }

  BJ.predictedRate = c => (60000 / c.spawn_delay) * c.spawn_chance;

  const renderers = {};

  renderers.title = (slide) => {
    const el = h('section', 'slide slide--title');
    el.appendChild(h('h1', 'title-big', BJ.fmt(slide.title)));
    el.appendChild(h('p', 'title-sub', BJ.fmt(slide.subtitle)));
    const img = h('img', 'title-bijo');
    img.src = 'bijo_forward.png';
    img.alt = 'Bijo';
    el.appendChild(img);
    return { el, frags: [] };
  };

  renderers.bullets = (slide, env) => {
    const frags = [];
    const demos = [];
    const { items } = BJ.plan(slide);
    const visual = visualFor(slide, env, frags, demos);
    const el = h('section', `slide slide--bullets${visual ? ' has-visual' : ''}${slide.code ? ' has-code' : ''}${visual && slide.visual.kind === 'quad' ? ' is-quad' : ''}`);
    el.appendChild(h('h2', 'slide-title', BJ.fmt(slide.title)));
    const body = h('div', 'slide-body');
    const text = h('div', 'text-col');
    if (slide.items.length) text.appendChild(pointList(slide.items, items, frags));
    if (slide.code) text.appendChild(codeBlock(slide.code, frags));
    body.appendChild(text);
    if (visual) body.appendChild(visual);
    el.appendChild(body);
    if (slide.peek) peek(el);
    return { el, frags, demos, update: data => liveTokens(el, data) };
  };

  renderers.quote = (slide) => {
    const frags = [];
    const { items } = BJ.plan(slide);
    const el = h('section', 'slide slide--quote');
    const q = h('figure', 'quote');
    q.innerHTML = `<blockquote>“${BJ.fmt(slide.quote)}”</blockquote><figcaption>${BJ.fmt(slide.by)}</figcaption>`;
    el.appendChild(q);
    el.appendChild(pointList(slide.items, items, frags));
    return { el, frags };
  };

  renderers.question = (slide) => {
    const el = h('section', 'slide slide--question');
    const note = h('div', 'note');
    note.appendChild(h('h2', 'q-text', BJ.fmt(slide.question)));
    if (slide.sub) note.appendChild(h('p', 'q-sub', BJ.fmt(slide.sub)));
    el.appendChild(note);
    peek(el);
    return { el, frags: [] };
  };

  renderers.split = (slide) => {
    const frags = [];
    const el = h('section', 'slide slide--split');
    el.appendChild(h('h2', 'slide-title', BJ.fmt(slide.title)));
    const cols = h('div', 'split-cols');
    [slide.left, slide.right].forEach((side, i) => {
      const col = h('div', `split-col split-col--${i ? 'right' : 'left'}`);
      col.appendChild(h('h3', null, BJ.fmt(side.head)));
      const ul = h('ul', 'points');
      side.items.forEach(t => ul.appendChild(h('li', 'pt', BJ.fmt(t))));
      col.appendChild(ul);
      cols.appendChild(frag(col, i + 1, frags));
    });
    el.appendChild(cols);
    if (slide.footer) el.appendChild(frag(h('p', 'split-footer', BJ.fmt(slide.footer)), 3, frags));
    return { el, frags };
  };

  renderers.proof = (slide) => {
    const frags = [];
    const el = h('section', 'slide slide--proof');
    el.appendChild(h('h2', 'slide-title', BJ.fmt(slide.title)));
    el.appendChild(h('p', 'slide-sub', BJ.fmt(slide.sub)));
    const ol = h('ol', 'proof-lines');
    slide.lines.forEach((line, i) => {
      const li = h('li', i === slide.mistake ? 'proof-line is-mistake' : 'proof-line', `<span>${BJ.fmt(line)}</span>`);
      ol.appendChild(frag(li, i < 4 ? 1 : 2, frags));
    });
    el.appendChild(ol);
    const note = frag(h('p', 'proof-note', BJ.fmt(slide.note)), 3, frags);
    el.appendChild(note);
    return {
      el,
      frags,
      setStep: step => el.classList.toggle('show-mistake', step >= 3),
    };
  };

  renderers.weird = (slide) => {
    const frags = [];
    const el = h('section', 'slide slide--weird');
    el.appendChild(h('h2', 'slide-title', BJ.fmt(slide.title)));
    el.appendChild(h('p', 'slide-sub', `<span class="live" data-live="qWeird">0</span> impossible questions came up while you played.`));
    const grid = h('div', 'weird-grid');
    slide.categories.forEach((cat, i) => {
      const col = h('div', 'weird-col');
      col.appendChild(h('h3', null, BJ.fmt(cat.head)));
      cat.examples.forEach(ex => col.appendChild(h('p', 'weird-q', BJ.fmt(ex))));
      grid.appendChild(frag(col, i + 1, frags));
    });
    el.appendChild(grid);
    el.appendChild(frag(h('p', 'weird-punch', BJ.fmt(slide.punchline)), slide.categories.length + 1, frags));
    return { el, frags, update: data => liveTokens(el, data) };
  };

  renderers.web = (slide) => {
    const frags = [];
    const el = h('section', 'slide slide--web');
    el.appendChild(h('h2', 'slide-title', BJ.fmt(slide.title)));
    const spots = [[330, 330], [1270, 330], [1270, 660], [330, 660], [800, 760]];
    const center = [800, 470];
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'web-lines');
    svg.setAttribute('viewBox', '0 0 1600 900');
    el.appendChild(svg);
    const img = h('img', 'web-bijo');
    img.src = 'bijo_forward.png';
    img.alt = 'Bijo';
    el.appendChild(img);
    slide.nodes.forEach((node, i) => {
      const [x, y] = spots[i];
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', center[0]);
      line.setAttribute('y1', center[1]);
      line.setAttribute('x2', x);
      line.setAttribute('y2', y);
      svg.appendChild(line);
      frag(line, i + 1, frags);
      const box = h('div', 'web-node', `<h3>${BJ.fmt(node.aok)}</h3><p>${BJ.fmt(node.text)}</p>`);
      box.style.left = `${x}px`;
      box.style.top = `${y}px`;
      el.appendChild(frag(box, i + 1, frags));
    });
    return { el, frags };
  };

  function tally(results, poll, count) {
    const counts = new Array(count).fill(0);
    for (const r of results?.[poll] || []) {
      if (r.choice < count) counts[r.choice] = r.votes;
    }
    const total = counts.reduce((a, b) => a + b, 0);
    return { counts, total };
  }

  renderers.poll = (slide, env) => {
    const frags = [];
    const demos = [];
    const el = h('section', `slide slide--poll${slide.visual ? ' has-visual' : ''}`);
    el.appendChild(h('h2', 'slide-title', BJ.fmt(slide.title)));
    if (slide.sub) el.appendChild(h('p', 'slide-sub', BJ.fmt(slide.sub)));

    if (slide.visual) {
      const { canvas, demo } = mountDemo(slide.visual.name, slide.visual, env);
      const wrap = h('div', 'poll-visual');
      wrap.appendChild(canvas);
      el.appendChild(wrap);
      demos.push(demo);
    }

    const list = h('div', `options${slide.options.length > 4 ? ' options--scale' : ''}`);
    const buttons = slide.options.map((label, i) => {
      const b = h('button', 'opt');
      b.type = 'button';
      b.innerHTML = `<span class="opt-fill"></span><span class="opt-fill opt-fill--before"></span>`
        + (slide.scale ? `<span class="opt-num">${i + 1}</span>` : '')
        + `<span class="opt-label">${BJ.fmt(label)}</span><span class="opt-pct"></span>`;
      if (env.mode !== 'student') b.disabled = true;
      b.addEventListener('click', () => {
        env.vote(slide.poll, i);
        buttons.forEach((x, j) => x.classList.toggle('is-picked', j === i));
      });
      list.appendChild(b);
      return b;
    });
    el.appendChild(list);

    const meta = h('p', 'poll-meta');
    el.appendChild(meta);
    if (slide.reveal) el.appendChild(frag(h('p', 'poll-reveal', BJ.fmt(slide.reveal)), slide.visual?.revealAt ?? 1, frags));

    const mine = env.myVote(slide.poll);
    if (mine !== undefined) buttons[mine]?.classList.add('is-picked');

    let step = 0;
    let lastData = null;

    function paint() {
      if (!lastData) return;
      const now = tally(lastData.results, slide.poll, slide.options.length);
      const before = slide.compare ? tally(lastData.results, slide.compare, slide.options.length) : null;
      const shown = step >= 1;
      el.classList.toggle('is-revealed', shown);
      buttons.forEach((b, i) => {
        const pct = now.total ? Math.round((now.counts[i] / now.total) * 100) : 0;
        b.querySelector('.opt-fill').style.width = shown ? `${pct}%` : '0%';
        let label = shown ? `${pct}%` : '';
        if (before) {
          const bp = before.total ? Math.round((before.counts[i] / before.total) * 100) : 0;
          b.querySelector('.opt-fill--before').style.width = shown ? `${bp}%` : '0%';
          label = shown ? `before ${bp}%  ·  now ${pct}%` : '';
        }
        b.querySelector('.opt-pct').textContent = label;
      });
      meta.textContent = `${now.total} ${now.total === 1 ? 'vote' : 'votes'}${shown && before ? `   (before: ${before.total})` : ''}`;
    }

    return {
      el,
      frags,
      demos,
      setStep: s => { step = s; paint(); },
      update: data => { lastData = data; paint(); },
    };
  };

  renderers.multipoll = (slide, env) => {
    const frags = [];
    const el = h('section', 'slide slide--multipoll');
    el.appendChild(h('h2', 'slide-title', BJ.fmt(slide.title)));
    if (slide.sub) el.appendChild(h('p', 'slide-sub', BJ.fmt(slide.sub)));
    const table = h('div', `mp-table${slide.items.length <= 4 ? ' mp-table--long' : ''}`);
    const rows = slide.items.map((item, r) => {
      const pollId = `${slide.poll}:${r}`;
      const row = h('div', 'mp-row');
      const labelCol = h('div', 'mp-label');
      labelCol.appendChild(h('span', 'mp-item', BJ.fmt(item)));
      if (slide.facts) labelCol.appendChild(frag(h('span', 'mp-fact', BJ.fmt(slide.facts[r])), 2, frags));
      row.appendChild(labelCol);
      const opts = h('div', 'mp-opts');
      const buttons = slide.options.map((label, i) => {
        const b = h('button', 'mp-opt', BJ.fmt(label));
        b.type = 'button';
        if (env.mode !== 'student') b.disabled = true;
        b.addEventListener('click', () => {
          env.vote(pollId, i);
          buttons.forEach((x, j) => x.classList.toggle('is-picked', j === i));
        });
        opts.appendChild(b);
        return b;
      });
      const mine = env.myVote(pollId);
      if (mine !== undefined) buttons[mine]?.classList.add('is-picked');
      row.appendChild(opts);
      const bar = h('div', 'mp-bar');
      const segs = slide.options.map((label, i) => {
        const seg = h('span', `mp-seg mp-seg--${i}`);
        bar.appendChild(seg);
        return seg;
      });
      row.appendChild(bar);
      table.appendChild(row);
      return { pollId, segs };
    });
    el.appendChild(table);
    const meta = h('p', 'poll-meta');
    if (!slide.facts) el.appendChild(meta);

    let step = 0;
    let lastData = null;
    function paint() {
      if (!lastData) return;
      const shown = step >= 1;
      el.classList.toggle('is-revealed', shown);
      let maxVotes = 0;
      rows.forEach(({ pollId, segs }) => {
        const t = tally(lastData.results, pollId, slide.options.length);
        maxVotes = Math.max(maxVotes, t.total);
        segs.forEach((seg, i) => {
          const pct = t.total ? (t.counts[i] / t.total) * 100 : 0;
          seg.style.width = `${pct}%`;
          seg.textContent = pct >= 12 ? `${slide.options[i]} ${Math.round(pct)}%` : '';
        });
      });
      meta.textContent = `${maxVotes} ${maxVotes === 1 ? 'person has' : 'people have'} voted`;
    }

    return {
      el,
      frags,
      setStep: s => { step = s; paint(); },
      update: data => { lastData = data; paint(); },
    };
  };

  renderers.stats = (slide) => {
    const frags = [];
    const { items } = BJ.plan(slide);
    const el = h('section', 'slide slide--stats');
    el.appendChild(h('h2', 'slide-title', BJ.fmt(slide.title)));
    const tiles = h('div', 'stat-row');
    const defs = [
      ['q_asked', 'math questions asked'],
      ['q_correct', 'answered right'],
      ['q_wrong', 'answered wrong'],
      ['q_weird', 'had the answer ???'],
    ];
    const nums = {};
    defs.forEach(([key, label]) => {
      const tile = h('div', `stat${key === 'q_weird' ? ' stat--weird' : ''}`);
      nums[key] = h('b', null, '0');
      tile.appendChild(nums[key]);
      tile.appendChild(h('span', null, label));
      tiles.appendChild(tile);
    });
    el.appendChild(tiles);
    el.appendChild(pointList(slide.items, items, frags));
    return {
      el,
      frags,
      update: data => {
        for (const [key] of defs) nums[key].textContent = String(data.summary?.[key] ?? 0);
      },
    };
  };

  function leaderboard(top, limit) {
    const ol = h('ol', 'board');
    (top || []).slice(0, limit).forEach(p => {
      const li = h('li');
      li.appendChild(h('span', 'board-name', BJ.fmt(p.name || '?')));
      li.appendChild(h('span', 'board-score', String(p.best)));
      ol.appendChild(li);
    });
    if (!ol.children.length) ol.appendChild(h('li', 'board-empty', 'No scores yet'));
    return ol;
  }

  renderers.game = (slide, env) => {
    const frags = [];
    const display = env.mode === 'display';
    const el = h('section', `slide slide--game panel--${slide.panel}${display ? ' is-display' : ''}`);
    const slot = h('div', 'game-slot');
    const side = h('aside', 'game-side');
    el.appendChild(display ? h('div', 'display-join') : slot);
    el.appendChild(side);

    if (display) {
      const join = el.querySelector('.display-join');
      const img = h('img', 'display-bijo');
      img.src = 'bijo_forward.png';
      img.alt = '';
      join.appendChild(img);
      join.appendChild(h('h2', null, slide.panel === 'experiment' ? 'Experiment time' : 'Play on your laptop'));
      join.appendChild(h('p', 'display-url', BJ.fmt(location.host || 'bijo-snake.vercel.app')));
    }

    side.appendChild(h('h2', 'side-title', BJ.fmt(slide.title)));
    const live = h('p', 'side-live');
    const best = h('p', 'side-best');
    const boardWrap = h('div', 'side-board');

    if (slide.panel === 'play') {
      side.appendChild(h('ul', 'side-keys',
        '<li><kbd>Arrows</kbd> or <kbd>WASD</kbd> to move</li>'
        + '<li><kbd>Space</kbd> to pause</li>'
        + '<li>Eat anything to grow</li>'));
    } else if (slide.panel === 'experiment') {
      side.appendChild(h('p', 'side-text', 'Just play. The game is counting every Robux and credit card that spawns.'));
      side.appendChild(h('div', 'exp-box',
        '<span class="exp-label">Measured</span><b class="live" data-live="measured">?</b><span class="exp-unit">items per minute</span>'));
      side.appendChild(frag(h('div', 'exp-box exp-box--predict',
        '<span class="exp-label">Predicted</span><b class="live" data-live="predicted">?</b>'
        + '<span class="exp-unit">(60 ÷ <span class="live" data-live="spawnSecs">?</span>) × <span class="live" data-live="spawnPct">?</span></span>'), 1, frags));
    } else {
      side.appendChild(h('p', 'side-text', 'Thanks for playing along. Highest score wins.'));
    }

    side.appendChild(live);
    if (slide.panel !== 'experiment') {
      side.appendChild(boardWrap);
      if (!display) side.appendChild(best);
    }

    return {
      el,
      frags,
      slot,
      update: data => {
        liveTokens(el, data);
        const s = data.summary || {};
        live.textContent = `${s.online ?? 0} online, ${s.playing ?? 0} playing`;
        best.textContent = data.best ? `Your best today: ${data.best}` : '';
        boardWrap.replaceChildren();
        if (data.control.show_leaderboard && slide.panel !== 'experiment') {
          boardWrap.appendChild(h('h3', null, 'Top scores'));
          boardWrap.appendChild(leaderboard(s.top, display ? 8 : slide.panel === 'final' ? 8 : 5));
        }
      },
    };
  };

  BJ.renderSlide = (slide, env) => {
    const r = (renderers[slide.type] || renderers.title)(slide, env);
    r.el.dataset.slide = slide.id;
    const demos = r.demos || [];
    const api = {
      el: r.el,
      slot: r.slot || null,
      demos,
      setStep(step) {
        for (const e of r.frags) e.classList.toggle('shown', Number(e.dataset.step) <= step);
        demos.forEach(d => d.setStep(step));
        r.setStep?.(step);
      },
      update(data) { r.update?.(data); },
      frame(now) { demos.forEach(d => d.frame(now)); },
    };
    return api;
  };
})();
