// pages/site-manage/equipment-manage/equipment-manage.js
import EnvironApi from '../../../api/site/environ-model'
import { toFormPage } from '../hooks/equipment-hooks'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    company_list: [],
    isLoading: true,
  },

  onShow() {
    this.getData()
  },

  async getData() {
    this.setData({ isLoading: true })
    const { data, company_list } = await EnvironApi.getDevicesList()
    this.setData({ list: data, company_list, isLoading: false })
  },

  toFormPage(e) {
    let detail = ''
    if (e.detail.id) detail = e.detail
    toFormPage(detail, this.data.company_list)
  },

  async handleDel(e) {
    const { id } = e.detail
    await EnvironApi.postDel({ id })
    const list = this.data.list.filter(item => item.id !== id)
    this.setData({ list })
  },
})
