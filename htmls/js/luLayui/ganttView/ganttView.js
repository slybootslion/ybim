layui.define([], function (exports) {
  const jQuery = layui.$;
  const Date = $lulib.dayjs

  class Chart {
    constructor (el, opts) {
      this.div = el
      this.opts = opts
    }

    render () {
      this.addVtHeader(this.div, this.opts.data, this.opts.cellHeight)
      const slideDiv = jQuery("<div>", {
        "class": "ganttview-slide-container",
        "css": { "width": this.opts.slideWidth + "px" }
      });

      this.date = this.getDate(this.opts.start, this.opts.end)
    }

    getDate (start, end) {
      const dates = [];
      console.log(start)
      console.log(end)
      dates[start.year()] = [];
      dates[start.year()][start.month()] = [start]
      var last = start;
      while (last.compareTo(end) == -1) {
        var next = last.clone().addDays(1);
        if (!dates[next.getFullYear()]) {
          dates[next.getFullYear()] = [];
        }
        if (!dates[next.getFullYear()][next.getMonth()]) {
          dates[next.getFullYear()][next.getMonth()] = [];
        }
        dates[next.getFullYear()][next.getMonth()].push(next);
        last = next;
      }
      return dates;
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
      const startEnd = this.getBoundaryDatesFromData(opts.data, minDays);
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
          let start = Date(data[i].series[j].start);
          let end = Date(data[i].series[j].end)
          if (i === 0 && j === 0) {
            minStart = start;
            maxEnd = end;
          }
          if (minStart.isBefore(start)) minStart = start
          if (maxEnd.isAfter(end)) maxEnd = end
        }
      }
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
