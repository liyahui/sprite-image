import path from 'path'
import assert from 'assert'
import SpriteImage from '../src'
import message from '../src/message'

let sprite = path.resolve(__dirname, '../static/sprite')

let spriteImage = new SpriteImage({
  imgdir: '../../img',
  cssdir: '../../css',
  cssimg: '../img'
})

describe('spriteImage.generate', () => {
  it(message.PATH_NULL, () => {
    assert.throws(() => {
      spriteImage.generate()
    }, err => {
      return err.toString().includes(message.PATH_NULL)
    })
  })

  it(message.PATH_NOT_STRING, () => {
    assert.throws(() => {
      spriteImage.generate(true)
    }, err => {
      return err.toString().includes(message.PATH_NOT_STRING)
    })
  })

  it(message.PATH_ERROR, () => {
    assert.throws(() => {
      spriteImage.generate('string')
    }, err => {
      return err.toString().includes(message.PATH_ERROR)
    })
  })

  it(message.PATH_NOT_EXISTS, () => {
    assert.throws(() => {
      spriteImage.generate(path.join(__dirname, 'not_exists'))
    }, err => {
      return err.toString().includes(message.PATH_NOT_EXISTS)
    })
  })

  it(message.PATH_NOT_IMAGE, () => {
    assert.throws(() => {
      spriteImage.generate(path.join(sprite, 'empty'))
    }, err => {
      return err.toString().includes(message.PATH_NOT_IMAGE)
    })
  })

  it(message.CONFIG_ERROR, () => {
    assert.throws(() => {
      spriteImage.generate(path.join(sprite, 'watch'), [])
    }, err => {
      return err.toString().includes(message.CONFIG_ERROR)
    })
  })

  it('生成图标', () => {
    assert.doesNotThrow(() => {
      spriteImage.generate(path.join(sprite, 'icon'))
    })
  })

  it('生成执行一次动画的手表', () => {
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

  it('生成循环执行动画的猪仔', () => {
    assert.doesNotThrow(() => {
      spriteImage.generate(path.join(sprite, 'piglet'), {
        keyframe: {
          infinite: true,
          width: 240,
          height: 240
        }
      })
    })
  })
})
