import path from 'path'
import fs from 'fs'
import images from 'images'
import _ from 'lodash'
import layout from 'layout'
import message from './message'
import { plainBgCSS, plainItemCss, keyframeCSS } from './template'

/**
 * 合并图片、生成css
 */
export default class SpriteImage {
  // 默认配置
  config = {
    prefix: 'sprite',
    imgdir: '../../img',
    cssdir: '../../css',
    cssimg: '../img',
    limit: {
      width: 64000,
      height: 64000
    }
  }

  sort = {
    x: 'left-right',
    y: 'top-down',
    tree: 'binary-tree'
  }

  constructor(config = {}) {
    // 合并传入配置、默认配置
    this.config = {...this.config, ...config }

    // 去掉cssimg最后的斜杠
    let cssimg = this.config.cssimg
    if (cssimg.endsWith('/')) {
      this.config.cssimg = cssimg.substring(0, cssimg.length - 1)
    }

    // 设置处理图片的宽高限制
    images.setLimit(this.config.limit.width, this.config.limit.height)
  }

  generate(dir, options = {}) {

    if (!dir) {
      throw Error(message.PATH_NULL)
    }

    if (!_.isString(dir)) {
      throw Error(message.PATH_NOT_STRING)
    }

    if (dir.indexOf(path.sep) === -1) {
      throw Error(message.PATH_ERROR)
    }

    if (!fs.existsSync(dir)) {
      throw Error(message.PATH_NOT_EXISTS)
    }

    if (!_.isPlainObject(options)) {
      throw Error(message.CONFIG_ERROR)
    }

    options = this._handleOptions({ dir, ...options })

    this._createImage(options, this._wrapImage(options))
  }

  _handleOptions(options) {
    // 从路径中获取目录名称
    let name = options.dir.split(path.sep).pop()

    // 默认选项
    let defaults = {
      name,
      enable: true,
      outext: 'png',
      padding: 0,
      sort: this.sort.tree
    }

    // 如果为序列帧图，合并传入配置和默认配置
    if (options.keyframe) {
      options.keyframe = {
        width: 640,
        height: 1136,
        duration: 80,
        vertical: '100%',
        infinite: false,
        ...options.keyframe
      }

      options.padding = 0
      options.sort = this.sort.x
    } else {
      options.sort = this.sort.hasOwnProperty(options.sort) ? this.sort[options.sort] : this.sort.tree
    }

    return {
      ...defaults,
      ...options
    }
  }

  _wrapImage(options) {
    // 创建layout对象
    let layer = layout(options.sort, {
      sort: !options.keyframe
    })

    // 读取目录文件
    let imgs = fs.readdirSync(options.dir)

    // 过滤非png、jpg图片
    imgs = imgs.filter(file => /\.(png|jpe?g)$/.test(file))

    // 序列图按照文件名称从小到大排序
    if (options.keyframe) {
      imgs.sort((a, b) => parseInt(a) - parseInt(b))
    }

    // 忽略没有图片文件的文件夹
    if (!imgs.length) {
      return
    }

    imgs.forEach(file => {
      let wrap = images(path.join(options.dir, file))
      let keyframe = options.keyframe

      // 如果为序列帧图并且图片实际宽高大于设置宽高时缩放图片
      if (keyframe && wrap.width() > keyframe.width && wrap.height() > keyframe.height) {
        wrap.resize(keyframe.width, keyframe.height)
      }

      // 添加图片到layout中
      layer.addItem({
        width: wrap.width() + options.padding,
        height: wrap.height() + options.padding,
        meta: file.replace(path.extname(file), ''),
        img: wrap
      })
    })

    // 图片排列信息
    let result = layer.export()

    if (result.items.length) {
      result.width -= options.padding
      result.height -= options.padding
    }

    return result
  }

  _createImage(options, result) {
    // 创建合并后的图片
    let newImg = images(result.width, result.height)
    let prefix = this.config.prefix
    let cssname = `${prefix}-${options.name}.css`
    let imgname = `${prefix}-${options.name}.${options.outext}`
    let cssurl = `${this.config.cssimg}/${imgname}`
    let css = ''

    if (options.keyframe) {
      // 生成动画以及动画调用
      if (Number.isInteger(options.keyframe.vertical)) {
        options.keyframe.vertical += 'px'
      }

      css += _.template(keyframeCSS)({
        prefix,
        cssurl,
        ...result,
        ...options
      })

    } else {

      // 生成背景设置
      css += _.template(plainBgCSS)({
        prefix,
        cssurl,
        ...options
      })

    }

    result.items.forEach(item => {
      // 把每张图片画到新创建的大图上
      newImg.draw(item.img, item.x, item.y)

      // 生成图片宽高位置信息
      if (!options.keyframe) {
        css += _.template(plainItemCss)({
          prefix,
          item,
          ...result,
          ...options
        })
      }
    })

    // 保存css
    let csspath = path.resolve(options.dir, this.config.cssdir)
    fs.existsSync(csspath) || fs.mkdirSync(csspath)
    fs.writeFileSync(path.join(csspath, cssname), css)

    // 保存图片
    let imgpath = path.resolve(options.dir, this.config.imgdir)
    fs.existsSync(imgpath) || fs.mkdirSync(imgpath)
    newImg.save(path.join(imgpath, imgname))

    // 垃圾回收
    images.gc()
  }
}
