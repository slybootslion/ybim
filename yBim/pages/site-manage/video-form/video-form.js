// pages/site-manage/video-form/video-form.js
import StorageCache from '../../../tools/storage-cache'
import VideoApi from '../../../api/site/video-model'
import EnvironApi from "../../../api/site/environ-model";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '添加设备',
    company_list: [],
    detail: {},
    serial_name: '',
    serial_no: '',
    company_name: '',
    place: '',
    editId: '',
    btnDisabled: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.init()
  },

  async init() {
    const { company_list, detail } = await StorageCache.getEquipmentInfo()
    this.setData({ company_list })
    if (detail && detail.video_id) {
      this.data.editId = detail.video_id
      const { video_id, serial_name, serial_no, builing_id, company_name, place } = detail
      this.setData({ detail, serial_name, serial_no, builing_id, company_name, place, editId: video_id, title: '修改设备' })
    }
  },

  onDeviceName(e) {
    const { value } = e.detail
    this.data.serial_name = value
  },

  onDeviceNumber(e) {
    const { value } = e.detail
    this.data.serial_no = value
  },

  onCompanyId(e) {
    const { value } = e.detail
    this.data.builing_id = value
  },

  onAddress(e) {
    const { value } = e.detail
    this.data.place = value
  },

  async submit () {
    const { serial_name, serial_no, builing_id, place, editId } = this.data
    if (!serial_name || !serial_no || !builing_id || !place) {
      wx.lin.showToast({
        title: '必要信息未填写',
        icon: 'error',
      })
      return false
    }
    this.setData({ btnDisabled: true })
    let message = '新建成功'
    const data = { serial_name, serial_no, builing_id, place }
    try {
      if (editId) {
        message = '修改成功'
        data.video_id = editId
        await VideoApi.putVideosEdit(data)
      } else {
        await VideoApi.postVideosAdd(data)
      }
      wx.lin.showToast({
        title: message,
        icon: 'success',
      })
      await StorageCache.removeEquipmentInfo()
      wx.navigateBack()
    } catch (err) {
      this.setData({ btnDisabled: false })
    }
  },
})
