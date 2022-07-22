import { Entity } from '../Entity'
import { loadSpriteSheet } from '../loaders/sprite'
import { SpriteSheet } from '../SpriteSheet'
import { Trait } from '../Trait'
import { Consumable } from '../traits/Consumable'
import { Killable } from '../traits/Killable'
import { PendulumMove } from '../traits/PendulumMove'
import { Physics } from '../traits/Physics'
import { Player } from '../traits/Player'
import { Solid } from '../traits/Solid'
import { Mario } from './Mario'

class MushroomBehaviour extends Trait {
  collides(us: Entity, them: Entity) {
    if (them.getTrait(Killable)?.dead) {
      return
    }

    const player = them.getTrait(Player)
    if (player) {
      if (them instanceof Mario) {
        if (!them.grown) {
          them.grown = true
        } else {
          player.addLives(1);
        }
      }

      player.score += 100;
      us.useTrait(Consumable, (c) => c.consume())
    }
  }
}

export class Mushroom extends Entity {
  walk = this.addTrait(new PendulumMove(15))
  behavior = this.addTrait(new MushroomBehaviour())
  solid = this.addTrait(new Solid())
  physics = this.addTrait(new Physics())
  consumable = this.addTrait(new Consumable())

  constructor(private sprites: SpriteSheet) {
    super()
    this.size.set(16, 16)
  }

  draw(context: CanvasRenderingContext2D) {
    this.sprites.draw('default', context, 0, 0)
  }
}

export async function loadMushroom() {
  const sprites = await loadSpriteSheet('mushroom')

  return function createMushroom() {
    return new Mushroom(sprites)
  }
}
