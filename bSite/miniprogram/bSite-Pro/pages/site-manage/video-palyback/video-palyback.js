// pages/site-manage/video-palyback/video-palyback.js
import StorageCache from '../../../tools/storage-cache'
import dayjs from '../../../tools/dayjs.min'
import { promisic } from '../../../lu-ui/utils/util';

let livePlayerContext;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '视频回放',
    playCode: 0, // 当前播放错误码，
    dateLine: [], // 时间片段
    recType: 2, // 2 本地 1 云存储
    type: 2, // 2 本地 3 云存储
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { accessToken, deviceSerial, channelNo } = options
    this.setData({ accessToken, deviceSerial, channelNo })
    this.init()
  },

  async init() {
    const detail = await StorageCache.getVideoItemInfo()
    const { title } = detail
    livePlayerContext = wx.createLivePlayerContext('previewPlayer');
    this.getToday()
    this.setData({ title })
    await this.getTimeLine()
    await this.getPalyParam()
  },

  async bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
    await this.getTimeLine()
    await this.getPalyParam()
  },

  getToday() {
    const date = this.formatDate(new Date)
    this.setData({
      toDay: date,
      date,
    })
  },

  formatDate(d) {
    return dayjs(d).format('YYYY-MM-DD')
  },

  // format(now) { 
  //   var time = new Date(now);
  //   var h = time.getHours();     //返回日期中的小时数（0到23）
  //   var m = time.getMinutes(); //返回日期中的分钟数（0到59）
  //   var s = time.getSeconds(); //返回日期中的秒数（0到59）
  //   return (h > 9 ? h : '0' + h) + ':' + ( m > 9 ? m : '0'+ m) + ':' + ( s > 9 ? s : '0' + s);
  // },

  formatTime(now) {
    return dayjs(now).format('HH:mm:ss')
  },

  goLive() {
    wx.navigateBack()
  },

  // 获取时间轴
  async getTimeLine() {
    const { recType, date, accessToken, deviceSerial, channelNo } = this.data

    let currentDate = null;
    let timestampCurrent = null;
    let timestampToday = null;

    if (date) {
      currentDate = date;
      const time = currentDate + ' ' + '00:00:00';
      const endTime = currentDate + ' ' + '23:59:59'
      timestampToday = Date.parse(new Date(time.replace(/\-/g, '/'))); // 选择日期凌晨时间戳
      timestampCurrent = Date.parse(new Date(endTime.replace(/\-/g, '/'))); // 选择日期时间戳
    }

    const data = {
      accessToken,
      deviceSerial,
      channelNo,
      recType,
      startTime: timestampToday,
      endTime: timestampCurrent
    }

    try {
      const res = await promisic(wx.request)({
        url: 'https://open.ys7.com/api/lapp/video/by/time',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        data
      })
      const resData = res.data
      const { code, data: playData } = resData

      if (code === '200') {
        if (playData !== null) {
          const len = playData.length;
          let availArr = [];
          for (let i = len - 1; i >= 0; i--) {
            let res = playData[i];
            let et = null;
            let st = null;
            // 最近片段可能存在endTime超过当前时间
            if (i == (len - 1) && (res.endTime > timestampCurrent)) {
              et = this.formatTime(timestampCurrent)
            } else {
              et = this.formatTime(res.endTime)
            }

            // 存在startTime可能为前一天的时间
            if (i == 0 && (res.startTime < timestampToday)) {
              st = this.formatTime(timestampToday)
            } else {
              st = this.formatTime(res.startTime);
            }

            availArr.push({
              st: st,
              et: et,
            })
          }

          this.setData({
            dateLine: availArr,
          })

        } else {
          this.showToast('暂无数据，无录像片段')
        }
      } else {
        this.reqErrorHandle(code)
      }

    } catch (error) {
      console.log(error)
    }
  },

  // 播放片段参数整理
  async getPalyParam(e) {
    if (!e) return
    const stTime = e.detail.stTime
    const etTime = e.detail.etTime
    const { type, date, accessToken, deviceSerial, channelNo, } = this.data

    const startTime = date + ' ' + stTime
    const stopTime = date + ' ' + etTime

    const data = {
      accessToken,
      channelNo,
      deviceSerial,
      protocol: 3, // 流播放协议，1-ezopen、2-hls、3-rtmp
      startTime,
      stopTime,
      type, // 由页面按钮传入值
      expireTime: 86400
    }

    // 云存储rtmp地址所需携带参数
    this.setData({
      param: data
    })

    // 获取播放地址
    await this.getPlayUrl(data)
  },

  async getPlayUrl(data) {
    const res = await promisic(wx.request)({
      url: 'https://open.ys7.com/api/lapp/v2/live/address/get',
      method: 'POST',
      data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
    })

    const resData = res.data

    const { code, data: playData } = resData
    if (code === '200' && playData && playData.url) {
      const playUrl = playData.url;        
      this.setData({
        data_url: playUrl
      }) 
    } else {
      this.reqErrorHandle(code, '获取播放地址失败')
    }
  },

  reqErrorHandle(code, title = '获取播放时间片段失败') {
    switch (code) {
      case '10002':
        title = 'accessToken过期或异常'
        break
      case '20002':
        title = '设备不存在'
        break
      case '20007':
        title = '设备不在线'
        break
      case '20001':
        title = '摄像头不存在'
        break
      case '20018':
        title = '用户不拥有该设备'
        break
      case '10001':
        title = '参数错误'
        break
      case '60019':
        title = '设备已被加密，无法继续查看'
        break
    }
    this.showToast(title)
  },

  showToast(title, icon = 'error') {
    wx.lin.showToast({ title, icon })
  },

})