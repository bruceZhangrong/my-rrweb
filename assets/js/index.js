import * as rrweb from 'rrweb'
console.log(rrweb)

rrweb.record({
  emit (event) {
    console.log(event)
  }
})
