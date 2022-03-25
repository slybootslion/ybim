// pages/quality-manage/rectified.js
import QualityApi from '../../../api/quality/quality-model'
import Paging from '../../../api/paging'

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		rectifiedList: [],
		isLoading: true,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onShow(options) {
		this.getData()
	},

	async getData() {
		this.data.pagingApi = new Paging(QualityApi.getInspectionqualitiesList)
		const res = await this.getMore()
		// console.log(res.data);
		this.setData({ rectifiedList: res.data, hadMore: res.hadMore, isLoading: false })
		// this.setData({ company_list, list: data, hadMore, isLoading: false })
	},

	async getMore() {
		return this.data.pagingApi.getMore({ type: 'rectify' })
	},

	async scrollToLower() {
		if (!this.data.hadMore) return
		const { data } = await this.getMore()
		this.setData({ rectifiedList: data })
		wx.lin.hideToast()
	},

	delItem(e) {
		const delId = e.detail.id
		const rectifiedList = this.data.rectifiedList.filter(item => item.id !== delId)
		this.setData({ rectifiedList })
	},

	handleNav(e) {
		wx.navigateTo({
			url: '/pages/quality-manage/rectifying/rectifying?id=' + e.detail.id,
		})
	},

	handleDetail(e) {
		wx.navigateTo({
			url: '/pages/quality-manage/rectified-detial/rectified-detial?id=' + e.target.id,
		})
	}
})