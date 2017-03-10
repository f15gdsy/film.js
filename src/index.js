const DEFAULT_OPTS = {
  frameWidth: null,
  framesPerView: 3,
  speed: 20
};

const raf = window.requestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.mozRequestAnimationFrame
  || window.msRequestAnimationFrame
  || function(cb) { return setTimeout(cb, 16); };

const caf = window.cancelAnimationFrame
  || window.webkitCancelAnimationFrame
  || window.mozCancelAnimationFrame
  || window.msCancelAnimationFrame
  || window.clearTimeout;

export default class Film {
  constructor(el, opts) {
    this.el = el;
    this.opts = Object.assign({}, DEFAULT_OPTS, opts);
    this.frames = [];

    this.initWrapper();

    const children = el.querySelectorAll('.film__frame');

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      this.initFrame(child, i);
      this.frames.push(child);
    }

    this.start();
  }

  initWrapper() {
    this.el.style['overflow'] = 'hidden';
  }

  initFrame(frame, i) {
    if (this.opts.frameWidth) {
      frame.moveVal = i * this.opts.frameWidth;
      frame.style.width = `${ this.opts.frameWidth }px`;
    } else {
      const winW = window.innerWidth;
      frame.moveVal = i * winW / this.opts.framesPerView;
      frame.style.width = `calc(100vw / ${ this.opts.framesPerView }`;
    }

    frame.style.position = 'absolute';
    frame.style.transform = `translateX(${ frame.moveVal }px)`;
    frame.style.height = '100%';
    frame.style['z-index'] = i;
  }

  start() {
    this.reqId = raf(() => this.update());
  }

  stop() {
    if (this.reqId) {
      caf(this.reqId);
      this.reqId = null;
    }
  }

  refresh() {
    this.stop();
    this.frames.forEach((frame, i) => {
      this.initFrame(frame, i);
    });
    this.start();
  }

  update() {
    const mutates = [];
    const speed = this.opts.speed / 16;

    // batch dom reads
    this.frames.forEach((frame, i) => {
      frame.moveVal -= speed;

      if (frame.moveVal + frame.clientWidth < 0) {
        const lastFrameIndex = i === 0 ? i = this.frames.length - 1 : i - 1;
        const lastFrame = this.frames[lastFrameIndex];
        frame.moveVal = Math.floor(lastFrame.moveVal + lastFrame.clientWidth - speed - 1);
      }

      mutates.push(() => {
        frame.style.transform = `translateX(${ frame.moveVal }px)`;
      });
    });

    // batch dom writes
    mutates.forEach(mutate => mutate());

    this.reqId = raf(() => this.update());
  }
}
