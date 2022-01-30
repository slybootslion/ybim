// components/calendar/calendar.js
import dayjs from '../../../../tools/dayjs.min'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showDay: {
      type: Boolean,
      value: true,
    },
    date: {
      type: String,
    }
  },

  observers: {
    date(value) {
      if (value) this.setData({ defaultDate: value })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    selectedDate: '',
    showDate: '',
    currentDate: '',
    calendarShow: false,
    defaultDate: new Date().getTime(),
    minDate: new Date(2019, 1, 1).getTime(),
    maxDate: new Date().getTime(),
  },

  lifetimes: {
    attached() {
      this.getDate(dayjs(new Date()))
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getDate(djObj) {
      this.formatDate(djObj)
      this.setData({
        currentDate: djObj,
      })
    },
    formatDate(date) {
      let text
      if (this.data.showDay) {
        text = 'YYYY年MM月DD日'
      } else {
        text = 'YYYY年MM月'
      }
      const showDate = dayjs(date).format(text)
      const paramsDate = dayjs(date).format('YYYY-MM-DD')
      this.triggerEvent('dateChange', paramsDate)
      this.setData({ showDate })
    },
    dateSelect(e) {
      this.formatDate(e.detail)
    },
    prevMonth() {
      this._sub('M')
    },
    prevDay() {
      this._sub('d')
    },
    nextMonth() {
      this._add('M')
    },
    nextDay() {
      this._add('d')
    },
    showCalendarSelect() {
      this.setData({ calendarShow: true })
    },
    _add(type, num = 1) {
      const { currentDate } = this.data
      this.getDate(dayjs(currentDate).add(num, type))
    },
    _sub(type, num = 1) {
      const { currentDate } = this.data
      this.getDate(dayjs(currentDate).subtract(num, type))
    },
  },
})
