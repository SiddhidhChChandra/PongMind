# PongMind 🎮🧠

PongMind is an AI-powered Pong game that combines game development with artificial intelligence and reinforcement learning.

The project starts with a basic Pong implementation and gradually evolves into a game featuring adaptive AI opponents, multiple difficulty levels, power-ups, and eventually a reinforcement learning agent.

## 🎮 Play PongMind

**Live game:** https://siddhidhchchandra.github.io/PongMind/

Click the link to open the playable web version. The game opens with a start prompt, then displays **FIRST TO SCORE 5 WINS**, followed by **READY! → GO!** before the rally begins.

## 🎯 Project Goal

The goal of PongMind is to build a playable Pong game where the player competes against an AI opponent.

The AI will progressively become more advanced throughout development, eventually being trained using reinforcement learning.

## 🚧 Current Status

**Day 5 — Predictive AI & Match Statistics — COMPLETE ✅**

The core Pong gameplay loop is functional and has now been extended with a stronger AI baseline and match statistics. The arcade-style game flow remains in place. The game includes a player paddle, AI opponent paddle, circular ball, wall and paddle collision, smooth rule-based AI movement, increasing ball speed, score tracking, randomized ball launches, selectable match points, Easy/Normal/Hard/Extreme difficulty, Endless Mode, pause/resume/restart/exit controls, a retro arcade UI, animated home screen, difficulty selection and saving, READY/GO transitions, and dedicated win/loss end screens with restart, main menu, and difficulty options.

### Development Progress

- [x] Create GitHub repository
- [x] Create initial README
- [x] Create game canvas
- [x] Add player paddle
- [x] Add player keyboard controls
- [x] Add mobile touch controls
- [x] Keep paddle inside canvas boundaries
- [x] Increase paddle movement speed
- [x] Add mouse drag control
- [x] Remove on-screen control buttons
- [x] Polish initial game UI
- [x] Add opponent paddle
- [x] Add ball
- [x] Implement ball movement
- [x] Implement left/right wall bounce
- [x] Implement player paddle collision
- [x] Implement opponent paddle collision
- [x] Make ball circular
- [x] Add hit-position-based ball direction
- [x] Add smooth rule-based AI opponent
- [x] Increase ball speed during rallies
- [x] Add score tracking
- [x] Add point reset and randomized launches
- [x] Add first-to-5 win condition
- [x] Add score transition sequence
- [x] Add centered score announcements
- [x] Add READY / GO transition
- [x] Add rounded paddles and ball
- [x] Add game start prompt
- [x] Add match-end winner announcement
- [x] Add live game link
- [x] Document Day 3 completion
- [x] Add difficulty levels
- [x] Add Endless Mode (10-minute high-score match)
- [x] Add pause / resume / restart / exit match flow
- [x] Add win / loss end screens
- [x] Add difficulty saving with localStorage
- [x] Add retro arcade UI and animated home screen
- [x] Add predictive AI behavior
- [x] Make difficulty levels meaningfully different
- [x] Add controlled AI unpredictability on higher difficulties
- [x] Add match statistics (rally count and longest rally)
- [ ] Add dynamic difficulty-based ball speed
- [ ] Add power-up system
- [ ] Create reinforcement learning environment
- [ ] Train reinforcement learning agent
- [ ] Integrate trained AI
- [ ] Add player statistics
- [ ] Deploy final version

## 🎮 Planned Features

### Gameplay
- Player vs AI
- Score tracking
- Increasing ball speed
- First-to-5 win condition
- Multiple difficulty levels
- Endless Mode with a 10-minute time limit

### Difficulty Levels
- Easy
- Normal
- Hard
- Extreme

Difficulty can be selected from the menu and saved for later. The current rule-based AI changes its movement speed, reaction behavior, and targeting error depending on the selected difficulty.

A future Extreme difficulty may also introduce controlled unpredictability: random acceleration changes, fake movements, temporary targeting errors, sudden corrections, and deceptive movement patterns that make the AI less predictable.

### Endless Mode

**Endless Mode is now implemented.** It removes the fixed winning score and runs for **10 minutes**. The player with the highest score when time expires wins.

### Power-Ups
Planned power-ups include:

- Larger paddle
- Smaller paddle
- Faster ball
- Slower ball
- Larger ball
- Smaller ball
- Multi-ball
- Magnet ball
- Other positive and negative effects

## 🎮 Current Game Flow

1. Home screen → click anywhere to enter the menu
2. Choose difficulty → play immediately or save the choice for later
3. Start a normal match with selectable match points, or start a 10-minute Endless Run
4. READY → GO → gameplay
5. Pause with the on-screen control or **Escape**
6. Pause menu supports **Resume**, **Restart Match**, and **Exit Match**
7. At match end, a dedicated win/loss screen provides **Restart Again**, **Main Menu**, and **Change Difficulty**

## 🤖 Current AI

Day 3 uses a simple rule-based opponent. The AI now uses progressively stronger rule-based behavior. Easy primarily follows the ball directly, Normal uses partial prediction, Hard uses stronger prediction, and Extreme combines prediction with controlled targeting errors and occasional fake movement. The AI predicts where the ball will reach the opponent's side while accounting for horizontal wall bounces.

Match statistics currently track completed rallies and the longest rally, providing a baseline for future comparisons between rule-based and reinforcement-learning agents.

This is intentionally not reinforcement learning yet. The rule-based AI provides a working baseline that can later be compared against a trained RL agent.

## 🧠 Reinforcement Learning Concept

The eventual AI agent will operate using a cycle similar to:

State → Action → Environment → Reward → Next State

Possible state information may include:

- Ball position
- Ball velocity
- AI paddle position
- Player paddle position

Possible actions:

- Move up
- Stay
- Move down

## 🛠️ Planned Technology

### Game
- HTML
- CSS
- JavaScript
- HTML5 Canvas

### AI / Machine Learning
- Python
- Google Colab
- Reinforcement Learning

### Deployment
- GitHub Pages / Vercel
- Progressive Web App (planned)

## 📱 Platform Goals

PongMind is intended to eventually work on:

- 💻 Desktop
- 📱 Android/mobile browsers
- 🌐 Web

An installable mobile version may be explored after the web version is complete.

## 📈 Development Approach

PongMind is being developed incrementally.

Each development step follows:

**PLAN → IMPLEMENT → TEST → DOCUMENT → COMMIT**

## 🚀 Future Improvements

Possible future additions include:

- Player vs Player mode
- AI vs AI mode
- Improved reinforcement learning agents
- More power-ups
- Player statistics
- Leaderboards
- Improved mobile controls
- Advanced AI difficulty and deceptive movement
- Endless Mode
