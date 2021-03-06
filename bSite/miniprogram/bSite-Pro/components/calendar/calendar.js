// components/calendar/index.js
const DAY_NUM = 42
const WEEK_DAY_NUM = 7
const DATE_CHECK = /^(\d{4})-(\d{2})-(\d{2})$/
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    defaultSelectDate: {
      type: String,
      value: ''
    },
    mode: {
      type: String,
      value: ''
    },
    showToday: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    pickDate: '',
    pickDateDisplay: '',
    tMonthFirstDayWeek: 0,
    allDays: [],
    selectedDate: '',
    today: '',
    dateRange: []
  },

  lifetimes: {
    attached() {
      this.init()
    }
  },

  observers: {
    defaultSelectDate(value) {
      if (!value) return
      this.init()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init() {
      const now = new Date()
      if (!DATE_CHECK.test(this.data.defaultSelectDate)) {
        this.setData({
          defaultSelectDate: ''
        })
      }
      this.setData({
        selectedDate: this.data.defaultSelectDate || this.parseTime(now, '{y}-{m}-{d}'),
        today: this.parseTime(now, '{y}-{m}-{d}')
      })
      this.triggerEvent('initDate', this.data.selectedDate)
      this.setCalendar(this.parseTime(now, '{y}-{m}'))
    },
    setCalendar(dateStr) {
      // const this = this
      const selectDate = new Date(dateStr)
      const pickDate = this.parseTime(selectDate, '{y}-{m}')
      const dateSplit = dateStr.split('-')
      const thisYear = dateSplit[0]
      const thisMonth = dateSplit[1]
      const tempWeek = new Date(`${this.parseTime(selectDate, '{y}-{m}-')}01`).getDay()
      const tMonthFirstDayWeek = tempWeek === 0 ? WEEK_DAY_NUM : tempWeek

      const lastMonthOrigin = [...Array(this.getMonthDayNum(selectDate.getFullYear(), selectDate.getMonth())).keys()]
      const thisMonthOrigin = [...Array(this.getMonthDayNum(selectDate.getFullYear(), selectDate.getMonth() + 1)).keys()]
      const nextMonthOrigin = [...Array(this.getMonthDayNum(selectDate.getFullYear(), selectDate.getMonth() + 2)).keys()]
      const lastMonthFinal = [...lastMonthOrigin].splice(lastMonthOrigin.length - (tMonthFirstDayWeek - 1), lastMonthOrigin.length)
      const nextMonthFinal = [...nextMonthOrigin].splice(0, DAY_NUM - lastMonthFinal.length - thisMonthOrigin.length)

      this.setData({
        pickDate,
        pickDateDisplay: this.parseTime(selectDate, '{y}年{m}月'),
        tMonthFirstDayWeek,
        allDays: [
          ...this.mapMonth(lastMonthFinal, thisYear, Number(thisMonth) - 1, pickDate),
          ...this.mapMonth(thisMonthOrigin, thisYear, Number(thisMonth), pickDate),
          ...this.mapMonth(nextMonthFinal, thisYear, Number(thisMonth) + 1, pickDate)
        ]
      })
    },
    mapMonth(dayArr, year, month, pickDate = null) {
      const thisMonthNum = pickDate && Number(pickDate.split('-')[1])
      return dayArr.map(item => {
        const date = `${year}-${month < 10 ? `0${month}` : month}-${(item + 1) < 10 ? `0${item + 1}` : item + 1}`
        const week = new Date(date).getDay()
        return {
          dateNumber: item + 1,
          date,
          week: week === 0 ? 7 : week,
          position: thisMonthNum === month ? '' : month === thisMonthNum - 1 ? 'next-month' : 'pre-month'
        }
      })
    },
    bindPickDateChange(event) {
      const { value } = event.detail
      this.setData({
        pickDate: value,
        pickDateDisplay: this.parseTime(value, '{y}年{m}月')
      })
      this.setCalendar(value)
      this.triggerEvent('onPickDateChange', value)
    },
    // 获取月天数
    getMonthDayNum(year, month) {
      const d = new Date(year, month, 0)
      return d.getDate()
    },
    control(event) {
      const { mode } = event.currentTarget.dataset
      const { pickDate } = this.data
      let dateArr = pickDate.split('-')
      let oldMonth = Number(dateArr[1])
      let oldYear = Number(dateArr[0])
      let newDate = ''
      switch (mode) {
        case 'pre':
          newDate = oldMonth === 1 ? `${oldYear - 1}-12` : `${oldYear}-${oldMonth - 1 < 10 ? `0${oldMonth - 1}` : oldMonth - 1}`
          break;
        case 'reset':
          newDate = this.data.defaultSelectDate || new Date()
          if (this.data.mode === 'range') {
            this.setData({
              selectedDate: newDate,
              dateRange: []
            })
          } else {
            this.setData({
              selectedDate: this.parseTime(new Date(), '{y}-{m}-{d}')
            })
          }
          break;
        case 'next':
          newDate = oldMonth === 12 ? `${oldYear + 1}-01` : `${oldYear}-${oldMonth + 1 < 10 ? `0${oldMonth + 1}` : oldMonth + 1}`
          break;
      }
      const timeParse = this.parseTime(new Date(newDate), '{y}-{m}')
      this.setCalendar(timeParse)
      if (mode !== 'reset' && this.data.mode === 'range') {
        this.findRange(this.data.dateRange)
      }
      this.triggerEvent('onControl', {
        mode,
        newDate: timeParse
      })
    },
    onPickDay(event) {
      const { day } = event.currentTarget.dataset
      const { mode } = this.data
      let dateRange = [...this.data.dateRange]
      if (mode === 'range') {
        this.setData({
          selectedDate: ''
        })
        if (!dateRange[0]) {
          dateRange.push(day.date)
          this.setData({
            dateRange
          })
        } else if (!dateRange[1]) {
          dateRange.push(day.date)
          dateRange.sort((a, b) => a > b ? 1 : -1)
          this.setData({
            dateRange
          })
          this.findRange(dateRange)
          this.triggerEvent('onRangePick', dateRange)
        } else {
          this.setData({
            dateRange: [day.date]
          })
          this.findRange([day.date])
        }

        if (dateRange.length) {
          this.setData({
            selectedDate: `${dateRange[0]} 至 ${dateRange[1] ? dateRange[1] : ''}`
          })
        }
      } else {
        this.setData({
          selectedDate: day.date
        })
        this.triggerEvent('onPickDay', day)
      }
    },
    findRange(dateRange) {
      const minTimeStamp = Date.parse(dateRange[0])
      const maxTimeStamp = Date.parse(dateRange[1])
      let allDays = [...this.data.allDays]
      allDays.forEach(item => {
        const parseDate = Date.parse(item.date)
        item[`inRange`] = dateRange.length === 1 ? false : parseDate < maxTimeStamp && parseDate > minTimeStamp
      })
      this.setData({
        allDays
      })
    },
    parseTime(time, cFormat) {
      if (arguments.length === 0) {
        return null
      }
      const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
      let date
      if (typeof time === 'object') {
        date = time
      } else {
        if (('' + time).length === 10) time = parseInt(time) * 1000
        date = new Date(time)
      }
      const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
      }
      const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
        if (result.length > 0 && value < 10) {
          value = '0' + value
        }
        return value || 0
      })
      return timeStr
    },

    submit() {
      this.triggerEvent('calendarSubmit', this.data.selectedDate)
    }
  }
})
