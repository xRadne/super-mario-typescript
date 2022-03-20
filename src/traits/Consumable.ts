import { Entity } from '../Entity'
import { GameContext } from '../GameContext'
import { Level } from '../Level'
import { Trait } from '../Trait'

export class Consumable extends Trait {
  consumed = false
  removeTimer = 0
  removeAfter = 0

  consume() {
    this.queue(() => {
      this.consumed = true
    })
  }

  update(entity: Entity, { deltaTime }: GameContext, level: Level) {
    if (this.consumed) {
      this.removeTimer += deltaTime
      if (this.removeTimer > this.removeAfter) {
        this.queue(() => {
          level.entities.delete(entity)
        })
      }
    }
  }
}
