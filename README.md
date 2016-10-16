# 使用方法
```js
import SpriteImage from 'sprite-image'

// 全局配置
const spriteImage = new SpriteImage({
   prefix: 'sprite', // 生成css文件以及class前缀
   imgdir: '', // 合成图片保存目录
   cssdir: '', // 生成css保存目录
   cssimg: '', // css中的图片路径
})

spriteImage.generate('目录路径', {
	enable: true, // 是否处理这个目录
  	outext: 'png', // 合成图片类型
  	padding: 0, // 小图之间的间距（为序列帧时忽略padding）
  	sort: 'tree', // 小图的排列方式 x, y, tree（为序列帧时排列方式固定为x）
  	// 序列图配置
  	keyframe: {
  		width: 640, // 序列图宽度
  		height: 1136, // 序列图高度
  		duration: 80, // 一帧的持续时间
  		infinite: true // 是否循环动画
  	}
})

```