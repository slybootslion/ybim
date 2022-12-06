layui.define([], function (exports) {
  const jQuery = layui.$;
  const Date = $lulib.dayjs

  class Chart {
    constructor (el, opts) {
      this.div = el
      this.opts = opts
      this.monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
    }

    render () {
      this.addVtHeader(this.div, this.opts.data, this.opts.cellHeight)
      const slideDiv = jQuery("<div>", {
        "class": "ganttview-slide-container",
        "css": { "width": this.opts.slideWidth + "px" }
      });

      this.dates = this.getDate(this.opts.start, this.opts.end)
      this.addHzHeader(slideDiv, this.dates, this.opts.cellWidth);

      this.div.append(slideDiv);
    }

    addHzHeader (div, dates, cellWidth) {
      const headerDiv = jQuery("<div>", { "class": "ganttview-hzheader" });
      const monthsDiv = jQuery("<div>", { "class": "ganttview-hzheader-months" });
      const daysDiv = jQuery("<div>", { "class": "ganttview-hzheader-days" });
      let totalW = 0;
      console.log(dates)
      for (let y in dates) {
        for (let m in dates[y]) {
          let w = dates[y][m].length * cellWidth;
          totalW = totalW + w;
          monthsDiv.append(jQuery("<div>", {
            "class": "ganttview-hzheader-month",
            "css": { "width": (w - 1) + "px" }
          }).append(`${y}/${this.monthNames[m]}`))
          for (let d in dates[y][m]) {
            daysDiv.append(jQuery("<div>", { "class": "ganttview-hzheader-day" })
              .append(dates[y][m][d].day()))
          }
        }
      }
      monthsDiv.css("width", totalW + "px")
      daysDiv.css("width", totalW + "px")
      headerDiv.append(monthsDiv)
      headerDiv.append(daysDiv)
      console.log(div)
      div.append(headerDiv)
    }

    getDate (start, end) {
      const dates = []
      dates[start.year()] = []
      dates[start.year()][start.month()] = [start]
      let last = start
      while (last.isAfter(end)) {
        let next = last.add(1, 'day')
        if (!dates[next.year()]) {
          dates[next.year()] = []
        }
        if (!dates[next.year()][next.month()]) {
          dates[next.year()][next.month()] = []
        }
        dates[next.year()][next.month()].push(next)
        last = next
      }
      return dates
    }

    // 左侧表头
    addVtHeader (div, data, cellHeight) {
      const headerDiv = jQuery("<div>", { "class": "ganttview-vtheader" });
      for (let i = 0; i < data.length; i++) {
        const itemDiv = jQuery("<div>", { "class": "ganttview-vtheader-item" });
        itemDiv.append(jQuery("<div>", {
          "class": "ganttview-vtheader-item-name",
          "css": { "height": (data[i].series.length * cellHeight) + "px" }
        }).append(data[i].name));
        const seriesDiv = jQuery("<div>", { "class": "ganttview-vtheader-series" });
        for (let j = 0; j < data[i].series.length; j++) {
          seriesDiv.append(jQuery("<div>", { "class": "ganttview-vtheader-series-name" })
            .append(data[i].series[j].name));
        }
        itemDiv.append(seriesDiv);
        headerDiv.append(itemDiv);
      }
      div.append(headerDiv);
    }
  }

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
      const startEnd = this.getBoundaryDatesFromData(opts.data, minDays)
      this.opts.start = startEnd[0]
      this.opts.end = startEnd[1]

      const div = jQuery("<div>", { "class": "ganttview" })
      new Chart(div, this.opts).render()
      this.els.append(div)
    }

    getBoundaryDatesFromData (data, minDays) {
      let minStart = new Date()
      let maxEnd = new Date()
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].series.length; j++) {
          let start = Date(data[i].series[j].start)
          let end = Date(data[i].series[j].end)
          if (i === 0 && j === 0) {
            minStart = start;
            maxEnd = end;
          }
          if (minStart.isBefore(start)) minStart = start
          if (maxEnd.isAfter(end)) maxEnd = end
        }
      }

      console.log(minStart.format("YYYY-MM-DD"), maxEnd.format("YYYY-MM-DD"))
      if (this.daysBetween(minStart, maxEnd) < minDays)
        maxEnd = minStart.add(minDays, 'day')
      return [minStart, maxEnd];
    }

    daysBetween (start, end) {
      if (!start || !end) return 0
      if (start.year() === 1901 || end.year() === 8099) return 0
      let count = 0, date = start.clone()
      while (!date.isAfter(end)) {
        count = count + 1;
        date.add(1, 'day');
      }
      return count;
    }

    isWeekend (date) {
      return date.getDay() % 6 === 0;
    }

  }

  exports('LuGanttView', LuGanttView)
})
