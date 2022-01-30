// pages/personnel-manage/team-manage/team-manage.js
import GroupApi from '../../../api/personnel/group-model'
import Paging from '../../../api/paging'
import StorageCache from '../../../tools/storage-cache'
import { permissionHide } from '../../../tools/utils'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    company_list: [],
    groups_list: [],
    worktype_list: [],
    data: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    const data = {
      415: 'hide1',
      408: 'hide2',
      409: 'hide3',
      410: 'hide4'
    }
    permissionHide(this, [415, 408, 409, 410], data)
  },

  onShow(options) {
    this.init()
  },

  async init() {
    this.data.pagingInce = new Paging(GroupApi.getGroupList, 'groups_list')
    const res = await this.getMore()
    const { company_list, groups_list, worktype_list, data } = res
    const setdata = {
      groups_list, data, isLoading: false, list: data
    }
    if (worktype_list) setdata.worktype_list = worktype_list
    if (company_list) setdata.company_list = company_list
    this.setData(setdata)
  },

  async getMore() {
    this.setData({ isLoading: true })
    let data = {}
    const { company_id } = this.data
    if (company_id) data = { company_id }
    return this.data.pagingInce.getMore(data)
  },

  async companySelected(e) {
    this.data.company_id = e.detail.company_id
    this.init()
  },

  async scrollToLower() {
    if (!this.data.hadMore) return
    const { data } = await this.getMore()
    this.setData({ list: data })
  },

  async groupAdd(e) {
    const { worktype_list, company_list } = this.data

    await StorageCache.setEquipmentInfo({
      company_list,
      worktype_list
    })

    const group_id = e.detail.group_id

    let url = '/pages/personnel-manage/add-groups/add-groups'
    if (group_id) url = url + `?group_id=${group_id}`
    wx.navigateTo({
      url
    })
  },

  delItem(e) {
    const { group_id } = e.detail
    const { list } = this.data
    this.setData({
      list: list.filter(item => item.group_id !== group_id)
    })
  }
})