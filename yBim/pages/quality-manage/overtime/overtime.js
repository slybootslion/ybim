// pages/quality-manage/overtime/overtime.js
import QualityApi from '../../../api/quality/quality-model'
import SafetyApi from '../../../api/quality/safety-model'
import Paging from '../../../api/paging'

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		rectifiedList: [],
		isLoading: true,
		Model: null,
		param: null,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		const { param } = options
		const Model = param === "Safety" ? SafetyApi : QualityApi
		this.setData({ Model, param })
	},
	onShow(options) {
		this.getData()
	},
	async getData() {
		this.data.pagingApi = new Paging(this.data.Model.getInspectionList)
		const res = await this.getMore()
		console.log(res)
		this.setData({ rectifiedList: res.data, hadMore: res.hadMore, isLoading: false })
	},

	async getMore() {
		return this.data.pagingApi.getMore({ type: 'expire' })
	},

	async scrollToLower() {
		if (!this.data.hadMore) return
		const {data, hadMore} = await this.getMore()
		this.setData({ rectifiedList: this.data.rectifiedList.concat(data), hadMore })
		wx.lin.hideToast()
	},

	delItem(e) {
		const delId = e.detail.id
		const rectifiedList = this.data.rectifiedList.filter(item => item.id !== delId)
		this.setData({ rectifiedList })
	},

	handleNav(e) {
		let paramStr = `?id=${e.detail.id}`
		if (this.data.param === 'Safety') paramStr += `&param=${this.data.param}`
		wx.navigateTo({
			url: `/pages/quality-manage/rectifying/rectifying${paramStr}`,
		})
	},

	handleDetail(e) {
		let paramStr = `?id=${e.detail.id}`
		if (this.data.param === 'Safety') paramStr += `&param=${this.data.param}`
		wx.navigateTo({
			url: `/pages/quality-manage/rectified-detial/rectified-detial${paramStr}`,
		})
	}
})