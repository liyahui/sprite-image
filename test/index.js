import path from 'path'
import assert from 'assert'
import SpriteImage from '../src'

let sprite = path.resolve(__dirname, '../static/sprite')

let spriteImage = new SpriteImage()

describe('spriteImage.generate', () => {
  it('合成图标并生成CSS', () => {
    assert.doesNotThrow(() => {
      spriteImage.generate(path.join(sprite, 'icon'))
    })
  })

  it('合成序列帧并生成CSS：执行一次动画', () => {
    assert.doesNotThrow(() => {
      spriteImage.generate(path.join(sprite, 'watch'), {
        outext: 'jpg',
        keyframe: {
          width: 348,
          height: 448
        }
      })
    })
  })

  it('合成序列帧并生成CSS：循环执行动画', () => {
    assert.doesNotThrow(() => {
      spriteImage.generate(path.join(sprite, 'dice'), {
        keyframe: {
          infinite: true,
          width: 400,
          height: 400,
          duration: 20
        }
      })
    })
  })
})
