// pages/my-app/my-info/my-info.js
import StorageCache from '../../../tools/storage-cache'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    infoKey: [
      { key: '姓名', valueKey: 'nickname' },
      { key: '用户名', valueKey: 'username' },
      { key: '角色', valueKey: 'role_name' },
      { key: '所在公司', valueKey: 'company_name' },
      { key: '岗位', valueKey: 'jobs' },
      { key: '联系电话', valueKey: 'mobile_phone' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const info = await StorageCache.getMyInfo()
    this.setData({ info })
  },

  async beforeBackPage() {
    await StorageCache.removeMyInfo()
  }
})