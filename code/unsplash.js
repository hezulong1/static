/**
 *  Modified from: https://www.npmjs.com/package/unsplash-source-js
 *
 * @example
 *  var photo = new UnsplashPhoto()
 *  var link = photo.randomize('daily').size(1080).fetch()
 *  dom.style.backgroundImage = 'url(' + link + ')'
 *  dom.style.backgroundSize = 'cover'
 *  dom.style.backgroundPosition = '50% 50%'
 *  dom.style.backgroundAttachment = 'fixed'
 */

(function(global, factory) {

  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Unsplash = factory())
  
})(this, function() {
  'use strict'
  
  var Unsplash = function () {
    this.url = 'https://source.unsplash.com'
    this.dimensions = {}
    this.scope = 'featured'
    this.randomizationInterval = 'perRequest'
  
    return this
  }
  
  /**
    * Finds a photo by its specific public ID
    * @param  {Int} id
    * @return {UnsplashPhoto}
    */
  Unsplash.prototype.find = function (id) {
    this.id = id
  
    return this
  }
  
  /**
    * Sets the width of the photo
    *
    * Note: crops if necessary to maintain the aspect ratio
    *
    * @param  {Int} width
    * @return {UnsplashPhoto}
    */
  Unsplash.prototype.width = function (width) {
    this.dimensions.width = width
  
    return this
  }
  
  /**
    * Sets the height of the photo
    *
    * Note: crops if necessary to maintain the aspect ratio
    *
    * @param  {Int} height
    * @return {UnsplashPhoto}
    */
  Unsplash.prototype.height = function (height) {
    this.dimensions.height = height
  
    return this
  }
  
  /**
    * Shorthand for setting the photo dimensions
    *
    * Note: crops if necessary to maintain the aspect ratio
    *
    * @param  {Int} width
    * @param  {Int} height (optional)
    * @return {UnsplashPhoto}
    */
  Unsplash.prototype.size = function (width, height) {
    this.dimensions = {
      width: width,
      height: height || width
    }
  
    return this
  }
  
  /**
    * Sets the randomization interval
    *
    * Note: only accepts three possible values (null, daily, or weekly)
    * @param  {String} interval
    * @return {UnsplashPhoto}
    */
  Unsplash.prototype.randomize = function (interval) {
    if (interval === 'daily' || interval === 'weekly') {
      this.randomizationInterval = interval
    } else {
      this.randomizationInterval = 'perRequest'
    }
  
    return this
  }
  
  /**
    * Sets the scope to `all` (instead of `featured`)
    * @return {UnsplashPhoto}
    */
  Unsplash.prototype.all = function () {
    this.scope = 'all'
  
    return this
  }
  
  /**
    * Limits the photo to having tags or locations matching the keywords
    * @param  {[Array || String]} keywords
    * @return {UnsplashPhoto}
    */
  Unsplash.prototype.of = function (keywords) {
    var sanitizedKeywords = []
  
    // Handle a string of comma-separated keywords
    if (!Array.isArray(keywords)) {
      keywords = keywords.split(',')
    }
  
    // Remove any leading or trailing whitespace from each keyword
    keywords.forEach(function (keyword) {
      sanitizedKeywords.push(keyword.trim())
    })
  
    this.keywords = sanitizedKeywords.join(',')
    this.keywords = encodeURI(this.keywords)
  
    return this
  }
  
  /**
    * Limits the photos to a specific photographer
    * @param  {String} username
    * @return {UnsplashPhoto}
    */
  Unsplash.prototype.fromUser = function (username) {
    this.username = username
  
    return this
  }
  
  /**
    * Limits the photos to a specific category
    * @param  {String} category
    * @return {UnsplashPhoto}
    */
  Unsplash.prototype.fromCategory = function (category) {
    this.category = category
  
    return this
  }
  
  /**
    * Returns true if the photo has dimensions set
    * @return {Boolean}
    */
  Unsplash.prototype._hasDimensions = function () {
    return !!this.dimensions.width && !!this.dimensions.height
  }
  
  /**
    * Appends the photo dimensions to the URL
    * @return {String} the photo URL
    */
  Unsplash.prototype._appendDimensions = function () {
    if (this._hasDimensions()) {
      this.url += '/' + this.dimensions.width + 'x' + this.dimensions.height
    }
  
    return this.url
  }
  
  /**
    * Appends the scope to the URL
    * @return {String} the photo URL
    */
  Unsplash.prototype._appendScope = function () {
    if (this.scope === 'all') {
      this.url += '/all'
    }
  
    return this.url
  }
  
  /**
    * Appends the keywords to the URL
    * @return {String} the photo URL
    */
  Unsplash.prototype._appendKeywords = function () {
    if (this.keywords) {
      this.url += '?' + this.keywords
    }
  
    return this.url
  }
  
  /**
    * Appends the randomization interval to the URL
    * @param  {Boolean} includeRandomPath include the `/random` path in the URL
    * @return {String} the photo URL
    */
  Unsplash.prototype._appendRandomization = function (includeRandomPath) {
    if (includeRandomPath && this.randomizationInterval === 'perRequest') {
      this.url += '/random'
    } else if (this.randomizationInterval === 'daily') {
      this.url += '/daily'
    } else if (this.randomizationInterval === 'weekly') {
      this.url += '/weekly'
    }
  
    return this.url
  }
  
  /**
    * Creates the URL based on the previous actions
    * @return {String} the photo URL
    */
  Unsplash.prototype.fetch = function () {
    if (this.id) {
      this.url += '/' + this.id
      this._appendDimensions()
      return this.url
    } else if (this.username) {
      this.url += '/user/' + this.username
      this._appendScope()
      this._appendDimensions()
      this._appendRandomization(false)
      this._appendKeywords()
      return this.url
    } else if (this.category) {
      this.url += '/category/' + this.category
      this._appendScope()
      this._appendDimensions()
      this._appendRandomization(false)
      this._appendKeywords()
      return this.url
    } else {
      this._appendScope()
      this._appendDimensions()
      this._appendRandomization(true)
      this._appendKeywords()
      return this.url
    }
  }

  return Unsplash
})

