# Character Pixel Animation Plan

This document records the planned runtime animation states for the world-map character system.

## States
- idle
- walk
- run
- jump
- attack1
- attack2
- skill
- hurt
- die

## Runtime requirements
- 8-direction facing: up, down, left, right, plus diagonal variants when the sprite set provides them.
- Frame timing must be independent of movement speed.
- Animation state is driven by movement/combat state, not by map rendering.
- Collision uses a small ground-footprint hitbox, not the full sprite bounds.
- The character sprite is rendered above terrain while the feet/ground point remains constrained by walkable collision.

## Enemy states
- idle
- walk
- chase
- attack
- hurt
- die

The implementation should use original game assets or user-owned assets; the reference image is used only as a visual target for presentation and state coverage.
