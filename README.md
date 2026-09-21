# PongMind 🎮🧠

PongMind is an AI-powered Pong game that combines game development with artificial intelligence and reinforcement learning.

The project starts with a basic Pong implementation and gradually evolves into a game featuring adaptive AI opponents, multiple difficulty levels, power-ups, and eventually a reinforcement learning agent.

## 🎮 Play PongMind

**Live game:** https://siddhidhchchandra.github.io/PongMind/

Click the link to open the playable web version. The game opens with the arcade start screen, then lets you choose difficulty and match type before the **READY! → GO!** sequence begins.

## 🎯 Project Goal

The goal of PongMind is to build a playable Pong game where the player competes against an AI opponent.

The AI will progressively become more advanced throughout development, eventually being trained using reinforcement learning.

## 🚧 Current Status

**Day 6 — Power-Ups, Debuffs & Orientation Shift — IN PROGRESS 🚧**

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
- [x] Add dynamic ball speed during rallies
- [x] Add difficulty-specific AI tuning
- [x] Add timed power-up effects
- [x] Add power-up system
- [x] Add positive and negative power-ups
- [x] Add mystery power-up
- [x] Add timed power-up HUD with countdown and progress bar
- [x] Add Hard/Extreme power-up frequency scaling
- [x] Add Hard/Extreme Orientation Shift power-up
- [x] Add horizontal gameplay orientation
- [ ] Create reinforcement learning environment
- [ ] Train reinforcement learning agent
- [ ] Integrate trained AI
- [x] Add basic match statistics
- [ ] Add player statistics and persistent history
- [ ] Deploy final version

## 🎮 Implemented Features

- Selectable match length: 3, 5, 7, 10, or 15 points
- Easy, Normal, Hard, and Extreme difficulty
- Saved difficulty preference using localStorage
- 10-minute Endless Mode
- Predictive rule-based AI with wall-bounce prediction
- Controlled AI unpredictability on higher difficulties
- Pause, resume, restart, and exit match controls
- Keyboard, mouse-drag, and touch controls
- Retro arcade interface with animated home screen
- Dedicated win/loss end screens
- Rally count and longest-rally tracking

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

Extreme currently includes controlled targeting errors and occasional fake movement. More advanced deceptive behavior can be explored later.

### Endless Mode

**Endless Mode is now implemented.** It removes the fixed winning score and runs for **10 minutes**. The player with the highest score when time expires wins.

### Power-Ups

Day 6 introduces a timed power-up system. Pickups fall from the top of the arena with slight randomized drifting. If the player intercepts a pickup, its effect activates and a HUD at the bottom shows the effect name, remaining time, and a shrinking duration bar.

Current effects include:

- **Big Paddle** — increases player paddle length
- **Small Paddle** — decreases player paddle length
- **Speed Boost** — increases player movement speed
- **Slow Ball** — reduces ball speed
- **Ball Speed Up** — increases ball speed
- **Big Ball** — increases ball size
- **Small Ball** — decreases ball size
- **Magnetic Ball** — gently pulls the ball toward the player paddle
- **Multi-Ball** — creates an additional ball
- **Reverse Controls** — reverses player movement
- **Screen Shake** — adds visual shake while active
- **Mystery (?)** — randomly activates a regular power-up
- **Orientation Shift** — Hard/Extreme-only effect that rotates gameplay into a horizontal left-vs-right layout for a random 5–10 second duration

Hard and Extreme keep the full power-up pool, but pickups appear less frequently. Orientation Shift is additionally restricted to those difficulties.

## 🎮 Current Game Flow

1. Home screen → click anywhere to enter the menu
2. Choose difficulty → play immediately or save the choice for later
3. Start a normal match with selectable match points, or start a 10-minute Endless Run
4. READY → GO → gameplay
5. Pause with the on-screen control or **Escape**
6. Pause menu supports **Resume**, **Restart Match**, and **Exit Match**
7. At match end, a dedicated win/loss screen provides **Restart Again**, **Main Menu**, and **Change Difficulty**

## 🤖 Current AI

The current AI is a rule-based baseline built incrementally across the project. The AI now uses progressively stronger rule-based behavior. Easy primarily follows the ball directly, Normal uses partial prediction, Hard uses stronger prediction, and Extreme combines prediction with controlled targeting errors and occasional fake movement. The AI predicts where the ball will reach the opponent's side while accounting for horizontal wall bounces.

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

Day 6 focuses on making the power-up system a gameplay mechanic rather than a visual-only feature. The current implementation includes both buffs and debuffs, timed effects, mystery pickups, multi-ball, and a real horizontal gameplay orientation.

## 🚀 Future Improvements

Possible future additions include:

- Player vs Player mode
- AI vs AI mode
- Improved reinforcement learning agents
- More power-ups
- Player statistics
- Leaderboards
- Improved mobile controls
- More advanced AI difficulty and deceptive movement
