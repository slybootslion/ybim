layui.define([], function (exports) {
  const jQuery = layui.$;
  const Date = $lulib.dayjs

  class LuGanttView {
    constructor (options) {
      const defaults = {
        showWeekends: true,
        cellWidth: 21,
        cellHeight: 31,
        slideWidth: 400,
        vHeaderWidth: 100,
        behavior: {
          clickable: true,
          draggable: true,
          resizable: true
        }
      }
      this.opts = jQuery.extend(true, defaults, options);
      if (!this.opts.dom) throw new Error("没有指定容易元素")
      this.els = jQuery(this.opts.dom)
      if (!this.els || !this.els.length) throw new Error("容器元素不存在")

      if (this.opts.data) {
        this.build()
      } else {
        jQuery.getJSON(this.opts.dataUrl, data => {
          this.opts.data = data
          this.build()
        })
      }
    }

    build () {
      const opts = this.opts
      if (!opts.data) throw new Error("没有渲染数据")

      const minDays = Math.floor((opts.slideWidth / opts.cellWidth) + 5)
      const startEnd = this.getBoundaryDatesFromData(opts.data, minDays);
      this.opts.start = startEnd[0]
      this.opts.end = startEnd[1]

      console.log('======')

      this.els.each((idx, el) => {
        console.log(el)
        console.log(idx)
      })
    }

    getBoundaryDatesFromData (data, minDays) {
      let minStart = new Date()
      let maxEnd = new Date()
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].series.length; j++) {
          let start = Date(data[i].series[j].start);
          let end = Date(data[i].series[j].end)
          console.log(start.format('YYYY,MM,DD'))
          console.log(end.format('YYYY,MM,DD'))
          console.log(minStart.isBefore(start))
          console.log('====')
          if (i === 0 && j === 0) {
            minStart = start;
            maxEnd = end;
          }
          if (minStart.isBefore(start)) minStart = start
          if (maxEnd.isAfter(end)) maxEnd = end
        }
      }
      if (this.daysBetween(minStart, maxEnd) < minDays)
        maxEnd = minStart.clone().addDays(minDays)
      return [minStart, maxEnd];
    }

    daysBetween (start, end) {
      if (!start || !end) return 0
      console.log(start.year())
      if (start.year() === 1901 || end.year() === 8099) return 0
      let count = 0, date = start.clone()
      console.log(start.format('YYYY,MM,DD'))
      console.log(end.format('YYYY,MM,DD'))
      console.log(date.isAfter(end))
      while (!date.isAfter(end)) {
        count = count + 1;
        date.addDays(1);
      }
      return count;
    }

    isWeekend (date) {
      return date.getDay() % 6 === 0;
    }

  }

  exports('LuGanttView', LuGanttView)
})
