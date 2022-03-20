import { Mario } from './entities/Mario'
import { Entity } from './Entity'
import { InputRouter } from './InputRouter'
import { Keyboard } from './Keyboard'
import { loadJSON } from './loaders'
import { Go } from './traits/Go'
import { Jump } from './traits/Jump'

interface KeyboardSpec {
  right: string[];
  left: string[];
  jump: string[];
  turbo: string[];
}

export async function setupKeyboard(target: EventTarget) {
  const keys = await loadJSON<KeyboardSpec>(`/settings/keyboard.json`)
  const input = new Keyboard()
  const router = new InputRouter<Entity>()

  let leftState = 0
  let rightState = 0

  input.listenTo(target)

  keys.right.forEach(key => {
    input.addListener(key, (keyState) => {
      rightState = keyState
      router.route((entity) => {
        entity.useTrait(Go, (go) => {
          go.dir = rightState - leftState
        })
      })
    })
  })

  keys.left.forEach(key => {
    input.addListener(key, (keyState) => {
      leftState = keyState
      router.route((entity) => {
        entity.useTrait(Go, (go) => {
          go.dir = rightState - leftState
        })
      })
    })
  })

  keys.jump.forEach(key => {
    input.addListener(key, (pressed) => {
      if (pressed) {
        router.route((entity) => {
          entity.useTrait(Jump, (jump) => jump.start())
        })
      } else {
        router.route((entity) => {
          entity.useTrait(Jump, (jump) => jump.cancel())
        })
      }
    })
  })

  keys.turbo.forEach(key => {
    input.addListener(key, (keyState) => {
      router.route((entity) => {
        // the turbo should probably be a separate trait
        if (entity instanceof Mario) {
          entity.setTurboState(keyState === 1)
        }
      })
    })
  })

  return router
}
