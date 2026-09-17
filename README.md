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

**Day 3 — Core Gameplay & Rule-Based AI — COMPLETE ✅**

The core Pong gameplay loop is functional. The game includes a player paddle, AI opponent paddle, circular ball, wall and paddle collision, smooth rule-based AI movement, increasing ball speed, score tracking, randomized ball launches, a first-to-5 win condition, score transitions, centered announcements, a start prompt, rounded paddles, and polished gameplay UI.

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
- [ ] Add difficulty levels
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
- Heavy / Extreme

Each difficulty will modify factors such as AI reaction speed, movement speed, accuracy, and ball speed.

A future Extreme difficulty may also introduce controlled unpredictability: random acceleration changes, fake movements, temporary targeting errors, sudden corrections, and deceptive movement patterns that make the AI less predictable.

### Endless Mode

A future **Endless Mode** will remove the fixed winning score. Instead, the match will run for a set time (planned: **10 minutes**) and the player with the highest score when time expires will win.

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

## 🤖 Current AI

Day 3 uses a simple rule-based opponent. The AI tracks the ball while it is traveling toward the opponent and moves smoothly toward the ball's horizontal position.

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
