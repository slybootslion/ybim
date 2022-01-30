// pages/personnel-manage/handle-add/handle-add.js
import StorageCache from '../../../tools/storage-cache'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gender: [
      { key: '男', value: 1 },
      { key: '女', value: 2 },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  onStaffName(e) {
    const { value } = e.detail
    this.data.staff_name = value
  },

  onNation(e) {
    const { value } = e.detail
    this.data.nation = value
  },

  onCardNo(e) {
    const { value } = e.detail
    this.data.card_no = value
  },

  onNativePlace(e) {
    const { value } = e.detail
    this.data.native_place = value
  },

  onAddress(e) {
    const { value } = e.detail
    this.data.address = value
  },

  onIssuingAuthority(e) {
    const { value } = e.detail
    this.data.issuing_authority = value
  },

  onGender(e) {
    const { value } = e.detail
    this.data.sex = value
  },

  onBirthday(e) {
    const { value } = e.detail
    this.data.birthday = value
  },

  async submit() {
    let { staff_name, nation, card_no, sex, birthday, native_place, address, issuing_authority } = this.data

    if (!staff_name || !nation || !sex || !birthday || !card_no || !address || !issuing_authority) {
      wx.lin.showToast({
        title: '有必要信息未填写',
        icon: 'error',
      })
      return false
    }

    const idCradReg = /(^\d{15}$)|(^\d{17}([0-9]|X|x)$)/

    if (!idCradReg.test(card_no)) {
      wx.lin.showToast({
        title: '身份证号码不符合规范',
        icon: 'error',
      })
      return false
    }

    native_place = native_place ? native_place : ''

    await StorageCache.setIdCardDetail({ staff_name, nation, card_no, sex, birthday, native_place, address, issuing_authority })

    wx.navigateTo({
      url: '/pages/personnel-manage/submit-add-workers/submit-add-workers',
    })
  }

})