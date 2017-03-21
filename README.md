# film.js
A lightweight, modern, minimal-dependency library for creating endless "film player animation.

Check out the demo here: https://f15gdsy.github.io/film.js/

# How

## 1. Installation
If you are using npm:
```
npm install vue-insert-compo --save
```

If you are using yarn:
```
yarn add vue-insert-compo
```


## 2. Use
First, you need to setup the following DOM structure:
```html
<div class="film">
  <div class="film__frame"></div>
  <div class="film__frame"></div>
  // ...
  <div class="film__frame"></div>
</div>
```

Then create a new film object
```javascript
const film = new Film('.film')
// or
const film = new Film(filmEl)
```

That's it!

# API
## Constructor
### params
- { String | HTMLElement } el - The film DOM element.
  - { Number } frameWidth - Set the frame width. If not set, framesPerView will be used. If set, will override framesPerView.
  - { Number } framesPerView - Set how many frames should be in viewport.
  - { Number } speed - Set the speed of the frame movmenet. Default 20.
  - { String } direction - Direction of the frame movement. Can be either "left" or "right". Default "left".
  
## .start()
Starts the animation.

## .stop()
Stops the animation.

## .refresh()
Re-initialize the film, can be used on resize.
```javascript
window.addEventListener('resize', () => {
  film.refresh()
})
```
