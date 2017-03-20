import test from 'ava'
import Film from '../../src'

const body = document.querySelector('body')

function createFilmDOM() {
  const wrapper = document.createElement('div')
  wrapper.className = 'film'

  for (let i = 0; i < 3; i++) {
    const frame = document.createElement('div')
    frame.className = 'film__frame'
    wrapper.appendChild(frame)
  }

  body.appendChild(wrapper)
}

function cleanupDOM() {
  for (let i = body.childNodes.length - 1; i >= 0; i--) {
    body.removeChild(body.childNodes[i])
  }
}

function delay() {
  return new Promise((resolve) => {
    setTimeout(resolve, 100)
  })
}

test.beforeEach('addDOM', t => {
  createFilmDOM()
})

test.afterEach.always('cleanup', t => {
  if (t.context.film) {
    t.context.film.stop()
  }
  cleanupDOM()
})


//
// Tests - API
//
test.serial('new Film(el) accepts HTMLElement as parameter.', t => {
  const el = document.querySelector('.film')
  t.notThrows(() => {
    t.context.film = new Film(el)
  })
})

test.serial('new Film(el) accepts selector string as parameter.', t => {
  t.notThrows(() => {
    t.context.film = new Film('.film')
  })
})

test.serial('new Film(el) doesnt accept other types of parameter as el.', t => {
  t.throws(() => {
    t.context.film = new Film(true)
  }, TypeError)
})

test.serial('new Film(el) sets the el overflow: hidden', t => {
  const film = new Film('.film')
  t.context.film = film

  t.is(film.el.style.overflow, 'hidden')
})

test.serial('new Film(el) setups all the .film__frame in el as frames', t => {
  const film = new Film('.film')
  t.context.film = film

  t.is(film.frames.length, 3)

  const frames = document.querySelectorAll('.film__frame')
  frames.forEach((frame, i) => {
    t.is(frame.style.position, 'absolute')
    t.regex(frame.style.transform, /translateX\(\d+(.\d+)?px\)/)
    t.is(frame.style.height, '100%')
    t.is(frame.style['z-index'], `${ i }`)
  })
})

test.serial('new Film(el) starts automatically', t => {
  const film = new Film('.film')
  t.context.film = film

  t.true(film.started)
})

test.serial('film.stop() stops correctly', t => {
  const film = new Film('.film')
  film.stop()
  t.context.film = film

  t.false(film.started)
})

test.serial('film.stop() stops and then starts correctly', t => {
  const film = new Film('.film')
  film.stop()
  film.start()
  t.context.film = film

  t.true(film.started)
})

test.serial('film.refresh() re-init the frames', t => {
  let frameWidth = 500
  const film = new Film('.film', {
    frameWidth
  })
  t.context.film = film

  for (let i = 0; i < film.frames.length; i++) {
    const frame = film.frames[i]
    t.is(frame.style.width, `${ frameWidth }px`)
  }

  frameWidth = 300
  film.opts.frameWidth = frameWidth

  film.refresh()

  for (let i = 0; i < film.frames.length; i++) {
    const frame = film.frames[i]
    t.is(frame.style.width, `${ frameWidth }px`)
  }
})

//
// Tests - Params
//
test.serial('{ frameWidth: Number } sets the frame\'s width', t => {
  const frameWidth = 500
  const film = new Film('.film', {
    frameWidth
  })
  t.context.film = film

  for (let i = 0; i < film.frames.length; i++) {
    const frame = film.frames[i]
    t.is(frame.style.width, `${ frameWidth }px`)
  }
})

/**
 * @ref https://github.com/tmpvar/jsdom/issues/1332
 * { framesPerView: Number } cannot be tested
 */

// test.serial(' { frameWidth: null } sets the frame\'s width according to framesPerView', async t => {
//
// })

// test.serial('{ framesPerView: Number } sets the frame\'s width', t => {
//
// })

test.serial('frameWidth has the higher priority to framesPerView', t => {
  const frameWidth = 500
  const framesPerView = 5
  const film = new Film('.film', {
    frameWidth,
    framesPerView
  })
  t.context.film = film

  for (let i = 0; i < film.frames.length; i++) {
    const frame = film.frames[i]
    t.is(frame.style.width, `${ frameWidth }px`)
  }
})

test.serial('{ speed: Number } sets the speed of frames movement', t => {
  const speed = 30
  const film = new Film('.film', {
    speed
  })
  t.context.film = film

  t.is(film.opts.speed, speed)
})
