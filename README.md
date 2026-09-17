# PongMind 🎮🧠

PongMind is an AI-powered Pong game that combines game development with artificial intelligence and reinforcement learning.

The project starts with a basic Pong implementation and gradually evolves into a game featuring adaptive AI opponents, multiple difficulty levels, power-ups, and eventually a reinforcement learning agent.

## 🎯 Project Goal

The goal of PongMind is to build a playable Pong game where the player competes against an AI opponent.

The AI will progressively become more advanced throughout development, eventually being trained using reinforcement learning.

## 🚧 Current Status

**Day 3 — Core Gameplay & Rule-Based AI**

The core Pong gameplay loop is now functional. The game has a player paddle, AI opponent paddle, circular ball, wall and paddle collision, smooth rule-based AI movement, score tracking, randomized ball launches, and a first-to-5 win condition.

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
- [x] Increase ball speed
- [x] Add score tracking
- [x] Add point reset and randomized launches
- [x] Add first-to-5 win condition
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
- Win condition
- Multiple difficulty levels

### Difficulty Levels
- Easy
- Normal
- Hard
- Heavy

Each difficulty will modify factors such as AI reaction speed, movement speed, accuracy, and ball speed.

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

The project will begin with a simple playable Pong prototype before adding AI, difficulty systems, power-ups, reinforcement learning, mobile support, and deployment.

## 🚀 Future Improvements

Possible future additions include:

- Player vs Player mode
- AI vs AI mode
- Improved reinforcement learning agents
- More power-ups
- Player statistics
- Leaderboards
- Improved mobile controls
- Advanced AI difficulty
