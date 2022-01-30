// pages/personnel-manage/add-workers/add-workers.js
import dayjs from '../../../tools/dayjs.min'
import StorageCache from '../../../tools/storage-cache'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    idInfoListA: [
      { key: '姓名', valueKey: 'staff_name' },
      { key: '性别', valueKey: 'sex' },
      { key: '民族', valueKey: 'nation' },
      { key: '出生日期', valueKey: 'birthday' },
      { key: '身份证号', valueKey: 'card_no' },
      { key: '住址', valueKey: 'address' },
    ],
    idInfoListB: [
      { key: '发证机关', valueKey: 'issuing_authority' },
      { key: '有效期', valueKey: 'valid_date' },
    ],
    infoA: {},
    infoB: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },

  handleAdd() {
    wx.navigateTo({
      url: '/pages/personnel-manage/handle-add/handle-add',
    })
  },

  ocrSuccess(e) {
    const type = e.detail.type
    if (!type) {
      // image_path
      const { address, gender, id, name, nationality } = e.detail
      const infoA = {
        address: address.text,
        sex: gender.text,
        card_no: id.text,
        staff_name: name.text,
        nation: nationality.text,
        birthday: this.formatDate(id, true)
      }
      this.setData({ infoA })
    } else {
      const { valid_date, authority } = e.detail
      const temp = valid_date.text.split('-').map(d => this.formatDate(d)).join('至')
      const infoB = {
        valid_date: temp,
        issuing_authority: authority.text
      }
      this.setData({ infoB })
    }
  },

  formatDate(dateStr, isId = false) {
    if (isId) dateStr = dateStr.text.slice(6, 14)
    return dayjs(dateStr).format('YYYY-MM-DD')
  },

  async submit() {
    const { infoA, infoB } = this.data

    if (!infoA.staff_name || !infoB.issuing_authority) {
      wx.lin.showToast({
        title: '先扫描身份证录入信息',
        icon: 'error',
      })
      return false
    }

    infoA.sex = infoA.sex === '男' ? 1 : 2
    const data = {
      ...infoA,
      ...infoB,
      native_place: ''
    }

    await StorageCache.setIdCardDetail(data)

    wx.navigateTo({
      url: '/pages/personnel-manage/submit-add-workers/submit-add-workers',
    })
  },

  leftBtnTap () {
    wx.switchTab({
      url: '/pages/application/application',
    })
  }
})
