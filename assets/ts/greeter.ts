interface Clockinterface {
  currentTime: Date
  setTime(d: Date):any
}
class Clock implements Clockinterface {
  currentTime!: Date 
  setTime(d: Date) {
    this.currentTime = d
  }
  constructor(h: number, m: number) {
    const c = h + m
    console.log(c)
  }
}