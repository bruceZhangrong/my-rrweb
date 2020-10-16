'use strict'
var Clock = /** @class */ (function () {
  function Clock (h, m) {
    var c = h + m
    console.log(c)
  }
  Clock.prototype.setTime = function (d) {
    this.currentTime = d
  }
  return Clock
}())
