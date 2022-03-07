// pages/my-app/work-manage/work-manage.js
import BaseDataApi from '../../../api/base-data/base-data-model'
import { permissionHide } from '../../../tools/utils'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lits: [],
    pagingApi: null,
    work_name: '',
    disabled: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const data = {
      451: 'hide1',
      452: 'hide2',
      453: 'hide3',
    }
    await permissionHide(this, [451, 452, 453], data)
    this.getData()
  },

  async getData() {
    const res = await BaseDataApi.getKindworksList()
    this.setData({
      list: res.data
    })
  },

  toForm(e) {
    const { list } = this.data
    const kindwork_id = e.currentTarget.dataset.kindworkId
    const current = list.find(item => item.kindwork_id === kindwork_id)
    this.setData({
      popupShow: true,
      kindwork_id,
      work_name: current.work_name
    })
  },

  del(event) {
    wx.lin.showDialog({
      type: 'confirm',
      title: '注意！',
      content: '是否删除该工种',
      success: (e) => {
        const { cancel } = e
        if (cancel) return
        this.data.kindwork_id = event.currentTarget.dataset.kindworkId
        this.delItem()
      }
    })
  },

  async delItem() {
    const { kindwork_id } = this.data
    const res = await BaseDataApi.postKindworksDelete({ kindwork_id })
    if (!res) return
    const list = this.data.list.filter(item => item.kindwork_id !== kindwork_id)
    this.setData({ list })
  },

  add() {
    this.setData({ popupShow: true, kindwork_id: '' })
  },

  handleInput(e) {
    this.data.work_name = e.detail.value.trim()
  },

  async handleSubmit() {
    this.setData({ disabled: true })
    const { work_name, kindwork_id, list } = this.data
    const current = list.find(item => item.kindwork_id === kindwork_id)

    if (current && current.work_name === work_name) {
      this.setData({
        work_name: '',
        popupShow: false,
        disabled: false
      })
      wx.lin.showToast({
        title: '未作更改',
      })
      return
    }

    if (!work_name) {
      wx.showToast({
        title: '提交信息不能为空',
        icon: 'none'
      })
      this.setData({
        disabled: false
      })
      return
    }

    const data = { work_name }
    if (kindwork_id) {
      data.kindwork_id = kindwork_id
    }
    try {
      if (kindwork_id) {
        await BaseDataApi.putKindworksEdit(data)
      } else {
        await BaseDataApi.postKindworksAdd(data)
      }
      this.getData()
      this.setData({
        work_name: '',
        popupShow: false,
        disabled: false
      })
    } catch (error) {
      this.setData({
        disabled: false
      })
    }

  }
})