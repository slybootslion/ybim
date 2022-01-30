// pages/site-manage/video-palyback/components/time-line/time-line.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    innerText: {
      type: String,
      value: 'default value',
    },
    playCode: {
      type: Number,
      observer(news, olds, path) {
        // news == 2004 开始播放
        if (news == 2004 || news == 2003 || news == 2105 || news == 2009) {

          // 根据偏移量自动滚动时间轴
          this._autoScrollTimeLine();
        } else {
          const { currentTimer, timelineTimer } = this.data;
          clearInterval(currentTimer);
          clearInterval(timelineTimer)
        }
        this.setData({
          playCode: news
        })
      }
    },
    dateLine: {
      type: Array,
      observer: function (news, olds, path) {
        if (news.length && news.length > 0) {
          this.setData({
            availTimeLine: news,
            start: news[0].st,
            end: news[0].et,
            current: news[0].st,
          });
          // 渲染时间轴
          this._matchTimeDot();
          // 根据起始时间设置初始偏移量
          this.primaryOffsetH();
          // 将当前播放时间片段传给父组件
          this.triggerEvent('getPalyParam', { stTime: news[0].st, etTime: news[0].et })
        } else {
          const { currentTimer, timelineTimer } = this.data;
          clearInterval(currentTimer);
          clearInterval(timelineTimer)
          this.setData({
            availTimeLine: [],
            current: 0,
          });
          // 渲染时间轴
          this._matchTimeDot();
          this.primaryOffsetH();

        }
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    start: '00:00:00', // 传入最近片段起始时刻
    end: '24:00:00', // 传入最近片段结束时刻 默认结束时间为24：00：00, 1440  24
    current: 0, // 当前播放时刻
    // rate: 1, // 1：2小时， 2：1小时， 3：半小时， 4：10分钟， 5：1分钟
    timelag: 30, // 120: 2小时， 60：1小时， 30：半小时，10：10分钟，1：1分钟
    timeArr: [], // 时间轴列表
    availTimeLine: [{ st: "22:33:48", et: "23:59:59" }, { st: "20:11:23", et: "22:33:48" }, { st: "23:00:23", et: "23:00:48" }], // 由实际存在视频片段的时间组成，[{st: '', et: ''}, {st: '', et: ''}, ...]
    scrollTop: 0, // 页面滚动偏移量 页面偏移量由传入时刻决定
    currentTimer: '', // 时刻定时器
    timelineTimer: '', //时间轴定时器,
    index: 0, // 初始时刻在availtimeLine中的index
    playCode: 0, // 当前播放状态值
    date: '',
    noTimeLineTxt: '',
    currentTop: 0, //当前距离页面高度
  },

  /**
   * 组件的方法列表
   */
  methods: {

    // 这里是一个自定义方法
    customMethod() { },

    // 时刻转分钟
    timeToMinute(time) {
      const e = time.split(':');
      let h = Number(e[0]);
      const m = Number(e[1]);
      // const s = Number(e[2]);
      return h * 60 + m
    },
    // 时刻转秒
    timeToSecond(time) {
      const e = time.split(':');
      let h = Number(e[0]);
      const m = Number(e[1]);
      const s = Number(e[2]);
      return h * 60 * 60 + m * 60 + (s ? s : 0)
    },
    // 分钟转时刻
    minuteToTime(minute) {
      let hour = Math.floor(minute / 60);
      let m = minute % 60;
      return (hour > 9 ? hour : '0' + hour) + ':' + (m > 9 ? m : '0' + m)
    },
    // 计时器，每秒+1
    secondCountDown(time) {
      const { current } = this.data;
      const temp = current.split(':');
      let hour = Number(temp[0]);
      let minute = Number(temp[1]);
      let second = Number(temp[2]);
      let t = hour * 60 * 60 + minute * 60 + second + 1;
      let h = Math.floor(t / 3600);
      let m = Math.floor((t - h * 3600) / 60);
      let s = t - h * 3600 - m * 60;
      this.setData({
        current: (h > 9 ? h : '0' + h) + ':' + (m > 9 ? m : '0' + m) + ':' + (s > 9 ? s : '0' + s)
      })
    },
    // 渲染时间轴
    _matchTimeDot() {
      const { start, end, timelag, availTimeLine } = this.data;
      var timeArr = [];
      // 播放时间片段时刻转分钟
      let availArr = [];
      let len = availTimeLine.length;
      for (let i = 0; i < len; i++) {
        const temp = availTimeLine[i];
        let st = this.timeToSecond(temp.st);
        let et = this.timeToSecond(temp.et);
        let stminute;
        let etminute;
        let stAvailPercent = 0;
        let etAvailPercent = 0;
        stminute = Math.floor(st / (timelag * 60)) * timelag;
        stAvailPercent = (st - (stminute * 60)) / timelag;
        etminute = Math.floor(et / (timelag * 60)) * timelag;
        etAvailPercent = (et - (etminute * 60)) / timelag;
        availArr[i] = {
          st: stminute,
          et: etminute,
          stAvailPercent: stAvailPercent,
          etAvailPercent: etAvailPercent
        }
      }
      // 时间转分钟
      let minute = this.timeToMinute(end);
      minute = Math.floor(minute / timelag) * timelag
      for (let i = minute; i >= 0;) {
        // let borderColor = '#ddd';
        let marginTop = 0;
        let paddingBottom = 0;
        let availPercent = 0;
        let availTop = 0;
        let recArr = [];
        if (i == minute) {
          marginTop = 70
        }
        if (i == 0) {
          paddingBottom = 290;
        }
        for (let j = 0; j < len; j++) {
          if (i >= availArr[j].st && i <= availArr[j].et) {
            if (i == availArr[j].st && i == availArr[j].et) {
              availPercent = availArr[j].etAvailPercent - availArr[j].stAvailPercent;
              availTop = 60 - availArr[j].etAvailPercent;
              var height = availArr[j].etAvailPercent - availArr[j].stAvailPercent;
              var top = 60 - availArr[j].etAvailPercent;
              recArr.push({
                height: height,
                top: top
              })
            } else {
              if (i == availArr[j].st) {
                recArr.push({
                  height: 60 - availArr[j].stAvailPercent,
                  top: 0
                })
              }
              if (i == availArr[j].et) {
                recArr.push({
                  height: availArr[j].etAvailPercent,
                  top: 60 - availArr[j].etAvailPercent,
                })
              }
              else if (i > availArr[j].st && i < availArr[j].et) {
                recArr.push({
                  height: 60,
                  top: 0,
                })
              }
            }
          }
        }

        let time = this.minuteToTime(i);
        timeArr.push({
          id: i,
          current: time,
          label: "a" + i,
          marginTop: marginTop,
          paddingBottom: paddingBottom,
          recArr: recArr,
        });
        i = i - timelag;
      }
      this.setData({
        timeArr: timeArr,
      });
      wx.createSelectorQuery().in(this).select('#current-time-scal').boundingClientRect((rect) => {
        this.setData({
          currentTop: rect.top + 30
        });
      }).exec();
    },
    // 计算初始偏移量
    primaryOffsetH: function () {
      const { start, timelag, timeArr } = this.data;
      const currentItem = timeArr[0].current;
      const currentTime = this.timeToSecond(currentItem);
      const startSecond = this.timeToSecond(start);
      const offsetS = currentTime - startSecond;
      const offsetH = Math.ceil(offsetS / timelag) + 60; // offsetS / (timelag * 60) * 60
      this.setData({
        scrollTop: offsetH
      })
    },
    // 计算当前偏移量
    currentOffsetH: function () {

      const { current, timelag, timeArr } = this.data;
      const startItem = timeArr[0].current;
      const startSecond = this.timeToSecond(startItem);
      const currentSecond = this.timeToSecond(current);
      const offsetS = startSecond - currentSecond;
      const offsetH = Math.ceil(offsetS / timelag) + 60; // offsetS / (timelag * 60) * 60
      this.setData({
        scrollTop: offsetH
      })
    },
    // 通过时间轴位置获取当前时间
    rectTopTotime: function (reactTop) {
      let { timelag } = this.data;
      let index = Math.floor(reactTop / 60); // 以分钟为刻度时，每个元素初始高度为60px, 向下取整并除以时刻倍数得出偏移item;
      let offsetH = Math.floor(reactTop - (index * 60)); // 偏移高度
      let current;
      let offsetSecond;
      if (offsetH == 0) {
        if (index == 0) {
          const currentMinute = this.timeToMinute(this.data.timeArr[0].current);
          const time = currentMinute + timelag;
          current = this.minuteToTime(time)
          offsetSecond = 0;
        } else {
          current = this.data.timeArr[index - 1].current;
          offsetSecond = 0;
        }

      } else {
        // 当timelag==120,timelag==60,timelag==30,timelag==10,timelag==1
        const time = this.data.timeArr[index].current;
        let minute = this.timeToMinute(time);
        // 相对于下一元素偏移
        const offsetY = 60 - offsetH;
        const offsetS = (offsetY * timelag); // offsetY / 60 * timelag * 60
        const offsetM = Math.floor(offsetS / 60) + minute;
        const second = (Math.floor(offsetS / 60) * 60)
        offsetSecond = Math.ceil(offsetS - second); // 保留两位小数
        current = this.minuteToTime(offsetM);
      }
      this.setData({
        current: current + ':' + (offsetSecond > 9 ? offsetSecond : '0' + offsetSecond),
        scrollTop: reactTop
      });
    },
    // 时间轴自动滚动， 时间每秒变化，时间轴根据timelag滚动
    _autoScrollTimeLine: function () {
      const { timelag, end, availTimeLine } = this.data;
      let { scrollTop } = this.data;
      const that = this;
      const waitTime = timelag * 1000;
      let top = Math.abs(scrollTop);
      if (this.data.currentTimer) {
        clearInterval(this.data.currentTimer)
      }
      if (this.data.timelineTimer) {
        clearInterval(this.data.timelineTimer)
      }
      /**时间时刻变化 */
      let currentTimer = setInterval(() => {
        let { index, current } = that.data;
        if (current == availTimeLine[index].et && index == 0) {
          clearInterval(currentTimer);
          clearInterval(timelineTimer);
        }
        else if (current == availTimeLine[index].et && index > 0) {
          that.setData({
            index: index - 1,
            current: availTimeLine[index - 1].st
          });
          this.currentOffsetH();
          将指定的播放时间片段传递给父组件i
          // this.triggerEvent('getPalyParam', { playParam: availTimeLine[index-1] })
        }
        else {
          this.secondCountDown();
        }
      }, 1000);

      /**时间轴滚动间隔为 timelg*1000 */
      let timelineTimer = setInterval(() => {
        let { scrollTop } = this.data;
        scrollTop--;
        that.setData({
          scrollTop: scrollTop
        })
      }, waitTime);
      this.setData({
        currentTimer: currentTimer,
        timelineTimer: timelineTimer
      })
    },
    // 
    // 监听手动滚动时间轴时，停止时间轴滚动，时刻仍然变化
    _bindtouchMove() {
      let { timelineTimer, currentTimer, currentTop } = this.data;
      if (timelineTimer || currentTimer) {
        clearInterval(timelineTimer);
        clearInterval(currentTimer)
      }
    },
    // 手动滚动停止，选定时刻自动播放
    _binddragend(event) {
      /** 清除已存在的timer */
      let { timelineTimer, currentTimer } = this.data;
      let _this = this;
      if (timelineTimer || currentTimer) {
        clearInterval(timelineTimer);
        clearInterval(currentTimer);
      }
      var timer;
      const scollPromise = new Promise(function (resolve, reject) {
        let preTop = -1;
        timer = setInterval(() => {
          // debugger
          wx.createSelectorQuery().in(_this).select('#time-line-item').boundingClientRect((rect) => {
            if (rect.top !== preTop) {
              preTop = rect.top;
            } else {
              resolve(rect.top);
            }
          }).exec();
        }, 100)
      });
      scollPromise.then((data) => {
        clearInterval(timer)
        wx.createSelectorQuery().in(this).select('#time-line-item').boundingClientRect((rect) => {
          let { timelag, availTimeLine, currentTop } = this.data;
          let rectTop = rect.top;
          let reactTop = currentTop - rectTop; // 实际偏移高度
          if (reactTop == 0) {
            const time = this.data.timeArr[0].current;
            const currentTime = this.timeToMinute(time);
            const minute = currentTime + timelag;
            const current = this.minuteToTime(minute);
            this.setData({
              current: current + ':' + '00',
            });
          } else {
            // 根据实际偏移高度计算当前时间
            this.rectTopTotime(reactTop);

          }

          /** 判断当前时刻是否在有播放片段的时间段内 */
          let len = availTimeLine.length;
          for (let i = 0; i < len - 1; i++) {
            const j = i + 1;
            const temp = availTimeLine[i];
            const nextTemp = availTimeLine[j];
            let st = this.timeToSecond(temp.st);
            let et = this.timeToSecond(temp.et);
            let nextEt = this.timeToSecond(nextTemp.et);
            let nextSt = this.timeToSecond(nextTemp.st);
            const { current } = this.data;
            const currentSecond = this.timeToSecond(current);
            if (j == len - 1 && (currentSecond < nextSt)) {
              this.setData({
                index: j,
                current: availTimeLine[j].st
              });

              this.currentOffsetH();
              this.triggerEvent('getPalyParam', { stTime: availTimeLine[j].st, etTime: availTimeLine[0].et })
              return;
            }
            // 在可播放范围内
            if (currentSecond >= st && currentSecond <= et) {
              /** 时间轴移动 */
              this.setData({
                index: i,
                current: current
              });
              // 将指定的播放时间片段传递给父组件i
              this.currentOffsetH();
              this.triggerEvent('getPalyParam', { etTime: availTimeLine[0].et, stTime: current })
              return;
            } else if (currentSecond < st && currentSecond > nextEt) {
              this.setData({
                index: i,
                current: availTimeLine[i].st
              });
              this.currentOffsetH();
              // 将指定的播放时间片段传递给父组件i
              this.triggerEvent('getPalyParam', { stTime: availTimeLine[i].st, etTime: availTimeLine[0].et })
              return;
            }

          }
        }).exec();

      })
    },
  }
})
