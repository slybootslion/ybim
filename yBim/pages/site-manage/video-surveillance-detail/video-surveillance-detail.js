// pages/site-manage/video-surveillance-detail/video-surveillance-detail.js
import StorageCache from '../../../tools/storage-cache'
import VideoApi from '../../../api/site/video-model'
import { promisic } from '../../../lu-ui/utils/util';
let livePlayerContext;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '视频播放',
    data_url: '',
    detail: null,
    liveSrc: '',
    ptzStatus: 0, //0-初始化 1-top noraml 2-downnoraml 3-left normal 4-right normal  5-top noraml 6-down limit 7-left limit 8-right limit
    ptzLoading: false,
    currentPtzImg: './images/yuntai/normal.png',
    channelNo: 1,
    accessToken: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.init()
    livePlayerContext = wx.createLivePlayerContext('livePlayer')
  },
  async init() {
    const detail = await StorageCache.getVideoItemInfo()
    const { video_id, title } = detail
    const res = await VideoApi.getVideosList({ video_id })
    const { token: accessToken, data: { rtmp_data: { url: data_url }, serial_no: deviceSerial } } = res
    this.setData({
      detail,
      title,
      accessToken,
      data_url,
      deviceSerial
    })
  },

  async beforeBackPage() {
    await StorageCache.removeVideoItemInfo()
  },

  play() {
    livePlayerContext.play({
      success() {

      },
      fail(e) {
        console.log(e)
      }
    })
  },

  statechange(e) {
    const { code } = e.detail;
    // console.log(code)
    switch (code) {
      case 2007: //启动loading
        break;
      case 2001: //连接服务器
        this.showToast('连接服务器', 'loading', 999999)
        break;
      case 2002: //已经连接 RTMP 服务器,开始拉流 
        break;
      case 2008: // 解码器启动
        break;
      case 2009: //视频分辨率改动
        this.play(); // 视频分辨率改动可能导致播放暂停，可调用handlePlay()重启播放
        break;
      case 2004:// 视频播放开始
        this.showToast('视频播放开始', 'success')
        break;
      case 2003://网络接收到首个视频数据包(IDR) 3.25 0.43
        this.showToast('视频播放开始', 'success')
        break;
      case 2103:
        this.showToast('网络断连, 已启动自动重连')
        break;
      case 3001:
      case 3002:
      case 3003:
      case 3005: // RTMP 读/写失败，之后会发起网络重试
        this.showToast('播放失败，尝试重新连接')
        break;
      case 2105: // 当前视频播放出现卡顿
        this.showToast('当前视频播放出现卡顿', 'loading')
        break;
      case -2301: // 经多次重连抢救无效，更多重试请自行重启播放
        this.showToast('多次重连无效，自行重启播放')
        break;
    }
  },

  liveError(e) {
    console.log(e)
  },

  showToast(title, icon = 'error', duration = 1500) {
    wx.lin.showToast({
      title,
      icon,
      duration
    })
  },

  ctrlTapStart(e) {
    let { ptzStatus, ptzLoading } = this.data;
    wx.createSelectorQuery().select('#ptzImgContainer').boundingClientRect(async rect => {
      let { clientX, clientY } = e.touches[0];
      let rectLeft = rect.left;
      let rectTop = rect.top;

      let centerLeft = 104 + rectLeft;
      let centerTop = 104 + rectTop;
      let left = clientX - centerLeft;
      let top = clientY - centerTop;

      if (ptzLoading) {
        this.showToast('操作过于频繁，长按云盘转动')
        return false;
      }

      if (Math.abs(left) > Math.abs(top)) {
        if (left > 0) {
          ptzStatus = 4
          await this.handlePtzControl(3)
        } else {
          ptzStatus = 3
          await this.handlePtzControl(2)
        }
      } else {
        if (top > 0) {
          ptzStatus = 2
          await this.handlePtzControl(1)
        } else {
          ptzStatus = 1
          await this.handlePtzControl(0)
        }
      }

      this.setData({
        ptzStatus,
      })

    }).exec()
  },

  ctrlTapEnd(e) {
    let { clientX, clientY } = e.changedTouches[0]
    wx.createSelectorQuery().select('#ptzImgContainer').boundingClientRect(async rect => {
      let rectLeft = rect.left
      let rectTop = rect.top

      let centerLeft = 104 + rectLeft
      let centerTop = 104 + rectTop
      let left = clientX - centerLeft
      let top = clientY - centerTop

      if (Math.abs(left) > Math.abs(top)) {
        if (left > 0) {
          await this.handlePtzControl(3, 'stop')
        } else {
          await this.handlePtzControl(2, 'stop')
        }
      } else {
        if (top > 0) {
          await this.handlePtzControl(1, 'stop')
        } else {
          await this.handlePtzControl(0, 'stop')
        }
      }
    }).exec()
    this.setData({
      ptzStatus: 0,
    })
  },

  async handlePtzControl(position, type) {
    const { ptzLoading, channelNo, deviceSerial, accessToken } = this.data
    let ptzLimit = ''
    const ptzTopImgSuccess = './images/yuntai/top.png'
    const ptzTopImgFailed = './images/yuntai/top_limit.png'
    const ptzDownImgSuccess = './images/yuntai/down.png'
    const ptzDownImgFailed = './images/yuntai/down_limit.png'
    const ptzLeftImgSuccess = './images/yuntai/left.png'
    const ptzLeftImgFailed = './images/yuntai/left_limit.png'
    const ptzRightImgSuccess = './images/yuntai/right.png'
    const ptzRightImgFailed = './images/yuntai/right_limit.png'
    const ptzNormalImg = './images/yuntai/normal.png'
    let ptzStatus = this.data.ptzStatus
    let currentPtzImg = this.data.currentPtzImg

    let url = 'https://open.ys7.com/api/lapp/device/ptz/start';
    if (type == 'stop') {
      url = 'https://open.ys7.com/api/lapp/device/ptz/stop'
    }

    if (ptzLoading && type === 'start') {
      this.showToast('操作过于频繁，长按云盘转动')
      return false
    }

    const data = {
      accessToken,
      deviceSerial,
      channelNo,
      "direction": position,
      speed: 1,
    }

    this.setData({
      ptzLoading: true,
    })

    try {
      const res = await promisic(wx.request)({
        url,
        method: 'post',
        data,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      })
      const code = res.data.code;

      if (code == 10029) {
        this.showToast('个人版接口调用超限，请升级企业版')
      } else if (code != 200) {
        this.showToast(res.data.msg)
      }

      if (type == 'stop') {
        ptzStatus = 0
        currentPtzImg = ptzNormalImg
      } else {
        switch (position) {
          case 0:
            ptzStatus = 1
            currentPtzImg = code == 200 ? ptzTopImgSuccess : ptzTopImgFailed
            ptzLimit = code == 200 ? '' : 'top'
            break
          case 1:
            ptzStatus = 2
            currentPtzImg = code == 200 ? ptzDownImgSuccess : ptzDownImgFailed
            ptzLimit = code == 200 ? '' : 'down'
            break
          case 2:
            ptzStatus = 3
            currentPtzImg = code == 200 ? ptzLeftImgSuccess : ptzLeftImgFailed
            ptzLimit = code == 200 ? '' : 'left'
            break
          case 3:
            ptzStatus = 4
            currentPtzImg = code == 200 ? ptzRightImgSuccess : ptzRightImgFailed
            ptzLimit = code == 200 ? '' : 'right'
            break
          default:
            ptzStatus = 0
            currentPtzImg = ptzTopImgSuccess
            ptzLimit = ''
        }
      }

      this.setData({
        ptzStatus,
        currentPtzImg,
        ptzLoading: false,
        ptzLimit,
      })

    } catch (error) {
      this.setData({
        ptzLoading: false
      })
    }
  },

  goPlayBack() {
    const { accessToken, deviceSerial, channelNo } = this.data

    const url = `/pages/site-manage/video-palyback/video-palyback?accessToken=${accessToken}&deviceSerial=${deviceSerial}&channelNo=${channelNo}`
    console.log(url)

    wx.navigateTo({
      url,
    })
  }
})
