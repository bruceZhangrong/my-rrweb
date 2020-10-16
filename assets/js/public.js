/**
 * Javascript some public method
 * _Fn => private methods
 */

const PUBLIC_FN = {
  init () {
    this._jsType()
  },

  /**
   * Extends some methods for PUBLIC_FN
   * isNumber, isString...
   */
  _jsType () {
    const baseType = ['Number', 'String', 'Boolean', 'Null', 'Undefined', 'Array', 'Function', 'Object', 'RegExp', 'Set', 'Map', 'Symbol']
    baseType.forEach(v => {
      this[`is${v}`] = this.isType(v)
    })
  },

  /**
   * Determine the type of object (private)
   * @param  { String }  type     => javascript all type. eg: Number
   * @param  { Object }  instance => '1234' or 1234
   * @return { Function }         => Judging method
   * @return { Boolean }          => false or true
   */
  isType (type) {
    return (instance) => {
      return Object.prototype.toString.call(instance) === `[object ${type}]`
    }
  },

  /**
   * Get url query param
   * Execution URLSearchParams method, if browser support
   * Or excution regular expressions
   *
   * @param  { String } queryName => 'name' or 'age'
   * @param  { String } search    => '?name=bruce&type=1'
   * @return { String, Null }     => 'bruce' or null
   */
  getUrlQuery (queryName, search = window.location.search) {
    queryName = queryName.trim()
    if (window.URLSearchParams) {
      return (new URLSearchParams(search)).get(queryName)
    }
    const reg = new RegExp(`/(\\?|\\&)${queryName}=([^\\&]+)/`, 'g')
    const result = search.match(reg)
    return !result ? null : result.map(v => v.replace(`${queryName}=`, ''))[0]
  },

  /**
   * Display money format
   * @param  { Number, String } num => 1234.56 or '1234.56'
   * @return { String }             => '1,234.56'
   */
  numberToMoneyFormat (num) {
    if (this.isNotNumber(num)) {
      this._throwTypeErrorMsg('number')
    }
    const reg = /(\d)(?=(?:\d{3})+$)/g
    const str = num.toString()
    if (str.indexOf('.') === -1) {
      return str.replace(reg, '$1,')
    }
    const arr = str.split('.')
    return `${arr[0].replace(reg, '$1,')}.${arr[1]}`
  },

  /**
   * Display number format
   * @param  { String } moneyStr => '1,234.56'
   * @return { Number }          => 1234.
   */
  moneyToNumberFormat (moneyStr) {
    const str = moneyStr.replace(/,/g, '')
    if (this.isNotNumber(str)) {
      throw new Error('Incorrect parameter')
    }
    return Number(str)
  },

  /**
   * Get fixed positioning decimal
   * And there is no value to add 0 at the end
   * @param  { String, Number } value  => '123.456', 123.4563, 123.45
   * @param  { String, Number } digits => 2(default), 3, 4
   * @return { String }                => '123.45', '123.456', '123.4500'
   */
  cutDecimal (value, digits = 2) {
    if (this.isNotNumber(value) || this.isNotNumber(digits)) {
      throw new Error('Incorrect parameter')
    }
    digits = Number(digits)
    let [intPart, decimalPart] = value.toString().split('.')
    decimalPart = decimalPart ? decimalPart.substr(0, digits) : ''
    decimalPart = decimalPart.length < digits ? decimalPart.padEnd(digits, 0) : decimalPart
    return `${intPart}.${decimalPart}`
  },

  /**
   * Get decimal rounding
   * And there is no value to add 0 at the end
   * @param  { String, Number } value  => '123.456', 123.4563, 123.45
   * @param  { String, Number } digits => 2(default), 3, 4
   * @return { String }                => '123.46', '123.456', '123.4500'
   */
  getKeepDecimal (value, digits = 2) {
    if (this.isNotNumber(value) || this.isNotNumber(digits)) {
      throw new Error('Incorrect parameter')
    }
    digits = Number(digits)
    let [intPart, decimalPart] = value.toString().split('.')
    decimalPart = decimalPart || ''
    if (decimalPart.length > digits) {
      const str = decimalPart.substr(0, digits + 1) / 10
      decimalPart = Math.round(str)
    } else {
      decimalPart = decimalPart.padEnd(digits, 0)
    }
    return `${intPart}.${decimalPart}`
  },

  /**
   * Value is empty
   * If undefined or null, return it
   * @param  { * } value => [0, '', {}, [], Set(), Map()],
   *                        [1, '0', {a: 1}, [1], Set([1]), Map([[1,1]])]
   * @return { Boolean}  => true, false
   */
  isEmpty (value) {
    const emptyMap = new Map([
      ['Number', 0],
      ['String', ''],
      ['Object', v => Object.keys(v).length === 0],
      ['Array', v => v.length === 0],
      ['Set', v => v.size === 0],
      ['Map', v => v.size === 0]
    ])
    for (const [k, v] of emptyMap) {
      if (this[`is${k}`](value)) {
        return this.isFunction(v) ? v(value) : v === value
      }
    }
    return value
  },

  /**
   * Value is null, undefined, ''
   * If inZero is true, include 0
   * @param  { * }       value  => null, undefined, '', '0'
   * @param  { Boolean } inZero => true, false(default)
   * @return { Boolean } true, false
   */
  isNoValueExZero (value, inZero = false) {
    const type = [null, undefined, '']
    inZero && type.push(0)
    return type.includes(value)
  },

  /**
   * First char uppercase
   * @param  { String } str => 'aaabbbccc'
   * @return { String } 'Aaabbbccc'
   */
  textCapitalize (str) {
    if (!this.isString(str)) {
      this._throwTypeErrorMsg('string')
    }
    const first = str.substr(0, 1)
    return str.replace(first, first.toLocaleUpperCase())
  },

  /**
   * Telephone number coding
   * Can be achieved by Array.from(phone.toString(), (x, i) => { // native code })
   * @param  { String, Number } phone  => '0836-8989863', 18612345678
   * @param  { Object }         option => {placeholder: '*', size: 4}
   * @return { String }                => '0836-****863', 186****5678
   */
  secretPhone (phone, option = { placeholer: '*', size: 4 }) {
    if (!this.isString(phone) && !this.isNumber(phone)) {
      throw new Error('Incorrect parameter')
    }
    const [isMobile, isPhone] = [
      this.regularRegExp('isMobile'),
      this.regularRegExp('isTelephone')
    ]
    if (!isMobile.test(phone) && !isPhone.test(phone)) {
      throw new Error('Parameter is not a (cell) phone number.')
    }
    const placeholer = option.placeholer || '*'
    const size = (option.size || 4) * (placeholer === '$' ? 2 : 1)
    const type = phone.toString().indexOf('-') === -1 ? '\\d{3}' : '-'
    const reg = new RegExp(`(?<=${type})\\d{4}`)
    return phone.toString().replace(reg, placeholer.repeat(size))
  },

  /**
   * Email coding
   * Can be achieved by Array.from(email, (x, i) => { // native code })
   * @param  { String, Number } phone  => 123@163.com
   * @param  { Object }         option => {placeholder: '*', size: 4}
   * @return { String }                => 12****@163.com
   */
  secretEmail (email, option = { placeholer: '*', size: 4 }) {
    if (!this.isString(email)) {
      throw new Error('Incorrect parameter')
    }
    const isEmail = this.regularRegExp('isEmail')
    if (!isEmail.test(email)) {
      throw new Error('Parameter is not a correct email.')
    }
    const placeholer = option.placeholer || '*'
    const size = (option.size || 4) * (placeholer === '$' ? 2 : 1)
    const reg = /(?<=\S{2}).+(?=@)/
    const nameLength = email.match(/\S+(?=@)/)[0].length
    const replaceStr = placeholer.repeat(size)
    if (nameLength <= 2) {
      return email.replace(/@/, `${replaceStr}@`)
    }
    return email.replace(reg, replaceStr)
  },

  /**
   * Accurate addition    => 0.1 + 0.2 = 0.30000000000000004
   * @param  { Number } a => 0.1
   * @param  { Number } b => 0.2
   * @return { Number }   => 0.3
   */
  addByString (a, b) {
    this._throwNotNeedType(a, 'number')
    this._throwNotNeedType(b, 'number')
    const aArr = [...a.toString().split('.')]
    const bArr = [...b.toString().split('.')]
    const aObj = {
      int: aArr[0],
      decimal: Array.from(aArr[1] || [])
    }
    const bObj = {
      int: bArr[0],
      decimal: Array.from(bArr[1] || [])
    }
    const initPart = Number(aObj.int) + Number(bObj.int)
    const max = Math.max(aObj.decimal.length, bObj.decimal.length)
    const decimalArr = []
    let isCarry = false
    Array.from('0'.repeat(max)).forEach((v, i) => {
      decimalArr[i] = Number(aObj.decimal[i] || 0) + Number(bObj.decimal[i] || 0)
    })
    const decimalPart = decimalArr.reduceRight((prev, cur, index) => {
      const len = prev.length
      if (len > 0 && this.isObject(prev[len - 1])) {
        const obj = prev.pop()
        cur = Number(cur) + Number(obj.tenDigits)
        prev.push(obj.oneDigits)
      }
      cur = cur && cur.toString()
      const arr = Array.from(cur).reverse()
      if (arr.length > 1) {
        prev.push({
          tenDigits: arr[1],
          oneDigits: arr[0]
        })
      } else {
        prev.push(cur)
      }
      if (index === 0 && this.isObject(prev[prev.length - 1])) {
        prev.push(prev.pop().oneDigits)
        isCarry = true
      }
      return prev
    }, []).reverse().reduce((prev, cur) => {
      return prev + cur
    }, '')
    return Number(`${initPart + (isCarry ? 1 : 0)}${decimalPart ? '.' : ''}${decimalPart}`)
  },

  /**
   * Accurate multiplication => 0.1 * 0.2 = 0.02
   * @param  { Number } a    => 0.1
   * @param  { Number } b    => 0.2
   * @return { Number }      => 0.02
   */
  multiplication (a, b) {
    this._throwNotNeedType(a, 'number')
    this._throwNotNeedType(b, 'number')
    a = a.toString()
    b = b.toString()
    let decimalDigits = 0
    decimalDigits += (a.split('.')[1].length || 0)
    decimalDigits += (b.split('.')[1].length || 0)
    return Number(a.replace('.', '')) * Number(b.replace('.', '')) / Math.pow(10, decimalDigits)
  },

  /**
   * Accurate addition => 0.1 + 0.2 = 0.3
   * @param  { Number } a    => 0.1
   * @param  { Number } b    => 0.2
   * @return { Number }      => 0.3
   */
  add (a, b) {
    this._throwNotNeedType(a, 'number')
    this._throwNotNeedType(b, 'number')
    const decimalA = a.toString().split('.')[1].length || 0
    const decimalB = b.toString().split('.')[1].length || 0
    const decimalDigits = Math.pow(10, Math.max(decimalA, decimalB))
    return (a * decimalDigits + b * decimalDigits) / decimalDigits
  },

  /**
   * Accurate subtraction => 0.3 - 0.2 = 0.1
   * @param  { Number } a    => 0.3
   * @param  { Number } b    => 0.2
   * @return { Number }      => 0.1
   */
  subtraction (a, b) {
    this._throwNotNeedType(a, 'number')
    this._throwNotNeedType(b, 'number')
    const decimalA = a.toString().split('.')[1].length || 0
    const decimalB = b.toString().split('.')[1].length || 0
    const decimalDigits = Math.pow(10, Math.max(decimalA, decimalB))
    return (a * decimalDigits - b * decimalDigits) / decimalDigits
  },

  /**
   * Accurate division => 0.3 / 0.2 = 1.5
   * @param  { Number } a    => 0.3
   * @param  { Number } b    => 0.2
   * @return { Number }      => 1.5
   */
  division (a, b) {
    this._throwNotNeedType(a, 'number')
    this._throwNotNeedType(b, 'number')
    if (Number(b) === 0) {
      throw new Error('The divisor cannot be 0')
    }
    a = a.toString()
    b = b.toString()
    const decimalA = a.split('.')[1].length || 0
    const decimalB = b.split('.')[1].length || 0
    return Number(a.replace('.', '')) / Number(b.replace('.', '')) * Math.pow(10, decimalB - decimalA)
  },

  /**
   * Remove Duplicates for array
   * @param  { Array } arr => [1, 2, 1, 2, '1']
   * @return { Array }     => [1, 2, '1']
   */
  removeDuplicatesForArray (arr) {
    this._throwNotNeedType(arr, 'array')
    return [...new Set(arr)]
  },

  /**
   * Countdown
   * @param  { Number, String } timestemp => 1577808000000, 2020/01/01
   * @param  { String } fmt               => y-M-d h:m:s
   * @return { String }                   => 03-16 12:43:51
   */
  countdown (timestemp = 1577808000000, fmt = 'y-M-d h:m:s') {
    const today = (new Date()).getTime()
    const timeDiff = timestemp - today
    if (timeDiff <= 0) {
      throw new Error('The parameters should be future time')
    }
    const sDiff = timeDiff / 1000
    const s = Math.floor(sDiff) % 60
    const m = Math.floor(sDiff / 60) % 60
    const h = Math.floor(sDiff / 60 / 60) % 24
    const d = Math.floor(sDiff / 60 / 60 / 24) % 30
    const M = Math.floor(sDiff / 60 / 60 / 24 / 30) % 12
    const y = Math.floor(sDiff / 60 / 60 / 24 / 30 / 12) % 365
    const fmtMap = {
      yY: y,
      M: M,
      dD: d,
      hH: h,
      m: m,
      sS: s
    }
    const fmts = Array.from(fmt.replace(/[-/\s:]/g, ''))
    let spaceIndex = 2
    let str = ''
    fmts.forEach((v, i) => {
      v === 'd' && (spaceIndex = i)
      const key = Object.keys(fmtMap).filter(fv => fv.includes(v))
      let value = fmtMap[key].toString().padStart(2, '0')
      if (!Number(value)) {
        value = ''
      }
      str += value && `${value}${v === 'd' ? ' ' : (spaceIndex < i ? ':' : '-')}`
    })
    return str.replace(/:$/, '')
  },

  /**
   * Request full screen
   * @param { Object } element => document.body
   */
  requestFullscreen (element) {
    const fullScreenMap = new Map([
      ['requestFullscreen', 'requestFullscreen'],
      ['mozRequestFullscreen', 'mozRequestFullscreen'],
      ['msRequestFullscreen', 'msRequestFullscreen'],
      ['oRequestFullscreen', 'oRequestFullscreen'],
      ['webkitRequestFullscreen', 'webkitRequestFullscreen'],
      ['nodeName', () => {
        const cssText = 'width:100%; height:100%; overflow:hidden;'
        document.documentElement.style.cssText = cssText
        document.body.style.cssText = cssText
        element.style.cssText = `${cssText}; margin: 0px; padding:0px;`
        document.IsFullScreen = true
      }]
    ])
    for (const [key, value] of fullScreenMap) {
      if (element[key]) {
        element[value]()
        break
      }
    }
  },

  /**
   * Exit full screen
   * @param { Object } element => document.body
   */
  exitFullscreen (element) {
    const fullScreenMap = new Map([
      ['requestFullscreen', 'exitFullscreen'],
      ['mozRequestFullScreen', 'mozCancelFullscreen'],
      ['msRequestFullscreen', 'msExitFullScreen'],
      ['oRequestFullscreen', 'oExitFullScreen'],
      ['webkitRequestFullscreen', 'webkitCancelFullScreen'],
      ['nodeName', () => {
        const cssText = ''
        document.documentElement.style.cssText = cssText
        document.body.style.cssText = cssText
        element.style.cssText = ''
        document.IsFullScreen = false
      }]
    ])
    for (const [key, value] of fullScreenMap) {
      if (element[key]) {
        element[value]()
        break
      }
    }
  },

  /**
   * Deep clone
   * @param  { * } target     => {a: 1, b: {c: 2, d: 3, f: [4, 5, 6]}}
   * @return { * } new Object => {a: 1, b: {c: 2, d: 3, f: [4, 5, 6]}}
   */
  deepClone (target) {
    if (!this.isObject(target) && !this.isArray(target)) {
      return target
    }
    const result = this.isObject(target) ? {} : []
    for (const key in target) {
      const val = target[key]
      result[key] = (this.isObject(val) || this.isArray(val)) ? this.deepClone(val) : val
    }
    return result
  },

  /**
   * Value is number or string-number
   * @param  { Number, String } num => 123, '123', 'abc'
   * @return { Boolean }            => true, true, false
   */
  isNotNumber (value) {
    const num = Number(value)
    return (isNaN(num) || !this.isNumber(num))
  },

  /**
   * Collection of regular expressions in common use
   * @param  { String } name => isMobile, isEmail...
   * @return { RegExp }
   */
  regularRegExp (name) {
    const regMap = new Map([
      ['isMobile', /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/],
      ['isTelephone', /^(\d{4}-)?\d{7}$/],
      ['isEmail', /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/],
      ['isIDCard', /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/],
      ['isCharacter', /[\u4e00-\u9fa5]/gm]
    ])
    return regMap.get(name)
  },

  /**
   * (private) Throw type error message
   * @param { String } type => string, number, null, undefined, object, array...
   */
  _throwTypeErrorMsg (type) {
    throw new Error(`Parameter is not of type ${type}`)
  },

  /**
   * (private) Throw error, it's not we need type
   * @param { String } value => any
   * @param { String } type  => string, objet, number...
   */
  _throwNotNeedType (value, type = 'string') {
    const uType = this.textCapitalize(type)
    if (!this[`is${uType}`](value)) {
      this._throwTypeErrorMsg(type)
    }
  }
}

PUBLIC_FN.init()

export default PUBLIC_FN
