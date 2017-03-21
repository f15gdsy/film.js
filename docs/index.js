var imgRoot = 'images/'

var imgIndex = 0
var films = []

function init() {
  var filmEls = document.querySelectorAll('.film')

  for (var i = 0; i < filmEls.length; i++) {
    var filmEl = filmEls[i]
    var film = new Film(filmEl, {
      speed: 10,
      framesPerView: 8,
      direction: i % 2 === 0 ? 'left' : 'right'
    })
    films.push(film)

    film.frames.forEach(function(frame) {
      frame.style.backgroundImage = [
        'url(',
        imgRoot,
        'pic_',
        imgIndex,
        '.jpg)'
      ].join('')

      imgIndex++
    })
  }

  window.addEventListener('resize', function() {
    films.forEach(function(film) {
      film.refresh()
    })
  })
}

init()
