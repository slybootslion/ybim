import { promisic } from '../lu-ui/utils/util'
import config from '../config/index'

class Upload {
  constructor() {
    const token = wx.getStorageSync('token')
    this.header = {}
    if (token) this.header.Authorization = `Bearer ${token}`
  }

  async postImage(filePath) {
    try {
      const res = await promisic(wx.uploadFile)({
        url: `${config.apiBaseUrl}/timetickets/upload`,
        filePath,
        name: 'files',
        header: this.header
      })
      return JSON.parse(res.data)
    } catch (error) {
      wx.showToast({
        title: '图片上传失败，稍后再试',
        icon: 'none',
        duration: 2000
      })
      Promise.reject(error)
    }
  }
}

export default Upload