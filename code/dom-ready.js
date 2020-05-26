/**
 * dom 全部加载完毕执行方法
 * @example
 *  DOMReady(callback)
 */

(function(global, factory) {

  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.DOMReady = factory())
  
})(this, function() {
  'use strict'

  var doc = window.document
  var STATES = ['complete', 'loaded', 'interactive']

  var IEDOMContentLoaded = function(fn) {
    var done = false
    var init = function() {
      if (!done) {
        done = true
        fn()
      }
    }
    var polling = function() {
      try {
        doc.documentElement.doScroll('left')
      } catch (e) {
        setTimeout(polling, 50)
        return
      }
      init()
    }
    polling()

    doc.onreadystatechange = function() {
      if (doc.readyState === STATES[0]) {
        doc.onreadystatechange = null
        init()
      }
    }
  }

  var DOMContentLoaded = function(fn) {
    if (doc.addEventListener) {
      if (~STATES.indexOf(doc.readyState)) {
        setTimeout(fn, 0)
      } else {
        var handleLoaded = function() {
          doc.removeEventListener('DOMContentLoaded', handleLoaded, false)
          fn()
        }
        doc.addEventListener('DOMContentLoaded', handleLoaded, false)
      }
    } else if (doc.attachEvent) {
      IEDOMContentLoaded(fn)
    }
  }

  // 补充一个工具方法
  DOMContentLoaded.prepend = function(el, target) {
    target.firstChild ? target.parentNode.insertBefore(el, target.firstChild) : target.appendChild(el)
  }

  return DOMContentLoaded
})

