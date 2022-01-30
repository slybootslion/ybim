// pages/site-manage/equipment-form/equipment-form.js
import StorageCache from '../../../tools/storage-cache'
import EnvironApi from '../../../api/site/environ-model'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '添加设备',
    company_list: [],
    detail: {},
    device_name: '',
    device_number: '',
    company_name: '',
    address: '',
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
    if (detail && detail.id) {
      this.data.editId = detail.id
      const { id, device_name, device_number, company_id, company_name, address } = detail
      this.setData({ detail, device_name, device_number, company_id, company_name, address, editId: id, title: '修改设备' })
    }
  },

  onDeviceName(e) {
    const { value } = e.detail
    this.data.device_name = value
  },

  onDeviceNumber(e) {
    const { value } = e.detail
    this.data.device_number = value
  },

  onCompanyId(e) {
    const { value } = e.detail
    this.data.company_id = value
  },

  onAddress(e) {
    const { value } = e.detail
    this.data.address = value
  },

  async submit() {
    const { device_name, device_number, company_id, address, editId } = this.data
    if (!device_name || !device_number || !company_id || !address) {
      wx.lin.showToast({
        title: '必要信息未填写',
        icon: 'error',
      })
      return false
    }
    this.setData({ btnDisabled: true })
    let message = '新建成功'
    const data = { device_name, device_number, company_id, address }
    try {
      if (editId) {
        message = '修改成功'
        data.id = editId
        await EnvironApi.putDevicesEdit(data)
      } else {
        await EnvironApi.postDevicesAdd(data)
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
