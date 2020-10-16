import PUBLIC_FN from './public'

const a = PUBLIC_FN.secretPhone(18674454808)
const b = PUBLIC_FN.isEmpty({
  a: 3
})
console.log(a, b)
const c = 1
console.log(c)
class Animal {
  constructor (type, name) {
    this.type = type
    this.name = name
  }

  descriptions () {
    return `It's ${this.type} ${this.foo}, and name is ${this.name}`
  }
}

class Dog extends Animal {
  constructor (type, name) {
    super()
    this.type = type
    this.name = name
  }

  sports () {
    return 'Dog can run'
  }
}

const tom = new Dog('dog', 'Tom')
console.log(tom.descriptions())
console.log(tom.sports())

document.querySelector('#btn').addEventListener('click', function () {
  setTimeout(() => {
    window.open('http://www.baidu.com/')
  }, 1000)
})
