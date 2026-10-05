# PongMind

PongMind is an AI-powered retro Pong game built with vanilla HTML, CSS, and JavaScript.

It started as a classic Pong project and is being developed toward a more intelligent game environment, with reinforcement learning planned for a future stage.

## Live Game

https://siddhidhchchandra.github.io/PongMind/

## Current Features

### Gameplay
- Classic Pong-style 1v1 gameplay
- First-to-3 / 5 / 7 / 10 / 15 match options
- 10-minute Endless Mode
- Score transitions with READY / GO sequences
- Match-end screen with final score and rally statistics
- Pause, resume, restart, and exit controls

### AI Opponent
Four difficulty levels:
- **Easy** — forgiving movement and larger prediction error
- **Normal** — balanced opponent
- **Hard** — fast predictive defense with much smaller error
- **Extreme** — very fast, highly precise, and designed to remain challenging during long rallies

The AI uses:
- Ball trajectory prediction
- Wall-bounce prediction
- Dynamic reaction and movement settings
- Controlled targeting error
- Rare deceptive movement
- Match-pressure adjustments
- Extreme-mode fatigue over very long rallies

## Power-Up System

PongMind has a dynamic power-up system containing both buffs and debuffs.

### Buffs
- Big Paddle
- Speed Boost
- Slow Ball
- Magnetic Ball
- Multi-Ball
- Big Ball

### Debuffs
- Small Paddle
- Reverse Controls
- Screen Shake
- Ball Speed Up
- Small Ball

### Special Power-Ups
- **Mystery** — randomly selects a buff or debuff based on difficulty
- **Orientation Shift** — temporarily rotates gameplay from vertical Pong into horizontal Pong

Power-ups can stack, with effects scaling according to the number of active copies.

## Day 7 — Multi-Ball AI & Magnetic Combos

Day 7 focused on turning Multi-Ball from a simple visual effect into a real gameplay mechanic.

### Multi-Ball
Multi-Ball creates **5 balls** in play.

The rule is intentionally strict:

> **If even ONE ball gets past a paddle, that player loses the rally.**

So:
- AI misses 1 ball → Player gets the point
- Player misses 1 ball → AI gets the point
- All balls are returned → rally continues

### Multi-Ball AI Scaling

The AI now becomes increasingly capable as the number of active balls increases.

With more balls, the AI:
- Tracks multiple active threats
- Prioritizes the most urgent incoming ball
- Increases reaction strength
- Improves prediction
- Reduces targeting error
- Becomes increasingly effective at higher difficulties

Easy remains deliberately imperfect, while Extreme becomes highly capable without becoming mathematically perfect.

### Magnetic + Multi-Ball

Magnetic Ball now supports multiple balls when combined with Multi-Ball.

When both effects overlap:
- Balls reaching the player's paddle can be captured
- Multiple balls can be held simultaneously
- Held balls remain attached to the paddle
- Right-click or double-tap launches all held balls
- Each released ball receives a slightly different trajectory
- Magnetic capture can continue while Multi-Ball remains active

This creates a genuine combo mechanic rather than treating the two power-ups as independent effects.

## Controls

### Desktop
- **A / D** or **Left / Right Arrow** — move paddle
- **W / S** or **Up / Down Arrow** — orientation-shift movement
- **ESC** — pause
- **Right-click** — launch Magnetic Ball(s)

### Mobile
- On-screen movement buttons
- **Double-tap the game canvas** — launch Magnetic Ball(s)

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- HTML Canvas
- Local Storage for saved difficulty
- GitHub Pages for deployment

No game engine or framework is used.

## Development Progress

### Day 1–3
- Project setup
- Canvas game
- Player and AI paddles
- Ball physics
- Collisions
- Scoring
- Match win conditions
- Predictive opponent

### Day 4
- Retro arcade UI
- Main menu
- Difficulty selection
- Match-point selection
- Pause system
- Endless Mode
- End screen
- Saved difficulty

### Day 5
- Distinct difficulty behavior
- Improved predictive AI
- Dynamic ball-speed progression
- Rally statistics
- Match-pressure AI behavior
- Controlled AI unpredictability

### Day 6
- Full power-up system
- Buff/debuff balancing
- Stacking effects
- Mystery power-up
- Orientation Shift
- Mobile controls
- Power-up HUD
- Dynamic spawn scaling


### Day 9 — UI/UX & Visual Polish
- Responsive desktop and mobile layout polish
- Fullscreen gameplay control
- Dedicated Game Guide / INFO screen
- Complete power-up reference and AI difficulty guide
- Smoother menu and button hover/press interactions
- Arcade-style button sweep/highlight animations
- Animated Game Guide entrance
- Animated power-up pickup glow and HUD activation feedback
- Improved screen/menu transition feel
- Polished WIN / LOSE end-screen entrance animations
- Mobile touch interaction feedback
- Reduced-motion accessibility support

### Day 7
- Multi-Ball gameplay redesign
- One-miss scoring rule
- Multi-Ball-aware AI
- Increasing AI capability with ball count
- Multi-ball threat prioritization
- Multi-Ball + Magnetic Ball combination
- Multiple-ball magnetic capture
- Multi-ball launch system
- Final cleanup and removal of development test mode

## Future Direction

The long-term goal is to turn PongMind into an environment for experimenting with reinforcement learning.

Planned future work includes:
- RL state representation
- Action-space design
- Reward design
- Training an agent in Google Colab
- Measuring win rate, rally length, and reward
- Comparing rule-based AI against an RL agent
- Integrating the learned policy into the game
- PWA/mobile improvements
- Automated testing and deeper game telemetry

## Project Philosophy

PongMind is being developed incrementally:

**PLAN → LEARN → IMPLEMENT → TEST → DOCUMENT → COMMIT → PUSH**

The objective is not just to make a playable Pong clone, but to gradually turn it into a small experimental platform for AI behavior and reinforcement learning.
