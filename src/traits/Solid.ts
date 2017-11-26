import { Entity, Side, Trait } from '../Entity'
import { TileResolverMatch } from '../TileResolver'

export class Solid extends Trait {
  obstructs = true

  constructor() {
    super('solid')
  }

  obstruct(entity: Entity, side: Side, match: TileResolverMatch<any>) {
    if (!this.obstructs) return

    if (side === Side.bottom) {
      entity.bounds.bottom = match.y1
      entity.vel.y = 0
    } else if (side === Side.top) {
      entity.bounds.top = match.y2
      entity.vel.y = 0
    } else if (side === Side.right) {
      entity.bounds.right = match.x1
      entity.vel.x = 0
    } else if (side === Side.left) {
      entity.bounds.left = match.x2
      entity.vel.x = 0
    }
  }
}
