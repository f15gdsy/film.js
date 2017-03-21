import assign from 'simple-assign'

const DEFAULT_OPTS = {
  frameWidth: null,
  framesPerView: 3,
  speed: 20,
  direction: 'left'
}

const raf = window.requestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.mozRequestAnimationFrame
  || window.msRequestAnimationFrame
  || function(cb) { return setTimeout(cb, 16) }

const caf = window.cancelAnimationFrame
  || window.webkitCancelAnimationFrame
  || window.mozCancelAnimationFrame
  || window.msCancelAnimationFrame
  || window.clearTimeout

function getEl(elOrSelector) {
  if (typeof elOrSelector === 'string') {
    return document.querySelector(elOrSelector)
  } else if (elOrSelector.tagName) {
    return elOrSelector
  } else {
    throw new TypeError('Film.js: invalid el')
  }
}

export default class Film {
  constructor(el, opts) {
    this.el = getEl(el)
    this.opts = assign({}, DEFAULT_OPTS, opts)
    this.frames = []

    this._initWrapper()

    const children = this.el.querySelectorAll('.film__frame')

    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      this._initFrame(child, i)
      this.frames.push(child)
    }

    this.start()
  }

  _initWrapper() {
    this.el.style['overflow'] = 'hidden'
  }

  _initFrame(frame, i) {
    if (this.opts.frameWidth) {
      frame.moveVal = i * this.opts.frameWidth
      frame.style.width = `${ this.opts.frameWidth }px`
    } else {
      const winW = window.innerWidth
      frame.moveVal = i * winW / this.opts.framesPerView
      frame.style.width = `calc(100vw / ${ this.opts.framesPerView })`
    }

    frame.style.position = 'absolute'
    frame.style.transform = `translateX(${ frame.moveVal }px)`
    frame.style['z-index'] = i
  }

  _update() {
    const mutates = []
    const speed = this.opts.speed / 16
    let updateFunc;

    switch (this.opts.direction) {
      case 'left':
        updateFunc = (...args) => this._updateLeft(...args)
        break
      case 'right':
        updateFunc = (...args) => this._updateRight(...args)
        break
      default:
        throw new Error('Film.js: invalid direction')
    }

    // batch dom reads
    this.frames.forEach((frame, i) => {
      updateFunc(frame, i, speed)

      mutates.push(() => {
        frame.style.transform = `translateX(${ frame.moveVal }px)`
      })
    })

    // batch dom writes
    mutates.forEach(mutate => mutate())

    this.reqId = raf(() => this._update())
  }

  _updateLeft(frame, i, speed) {
    frame.moveVal -= speed

    /* istanbul ignore else */
    if (frame.moveVal + frame.clientWidth < -10) {
      const lastFrameIndex = i === 0 ? i = this.frames.length - 1 : i - 1
      const lastFrame = this.frames[lastFrameIndex]
      frame.moveVal = Math.floor(lastFrame.moveVal + lastFrame.clientWidth - speed - 1)
    }
  }

  _updateRight(frame, i, speed) {
    frame.moveVal += speed

    if (frame.moveVal - window.innerWidth > 10) {
      const firstFrameIndex = i === this.frames.length - 1 ? 0 : i + 1
      const firstFrame = this.frames[firstFrameIndex]
      frame.moveVal = Math.floor(firstFrame.moveVal - firstFrame.clientWidth + speed + 1)
    }
  }

  start() {
    this.reqId = raf(() => this._update())
  }

  stop() {
    /* istanbul ignore else */
    if (this.reqId) {
      caf(this.reqId)
      this.reqId = null
    }
  }

  refresh() {
    this.stop()
    this.frames.forEach((frame, i) => {
      this._initFrame(frame, i)
    })
    this.start()
  }

  get started() {
    return this.reqId !== null
  }
}
