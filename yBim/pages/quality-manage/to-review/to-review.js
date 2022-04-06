// pages/quality-manage/to-review/to-review.js
import QualityApi from '../../../api/quality/quality-model'
import SafetyApi from '../../../api/quality/safety-model'
import Paging from '../../../api/paging'

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		reviewList: [],
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

	onShow() {
		this.getList()
	},

	async getList() {
		this.data.pagingApi = new Paging(this.data.Model.getInspectionList)
		const res = await this.getMore()
		this.setData({ reviewList: res.data, hadMore: res.hadMore, isLoading: false })
	},

	async getMore() {
		return this.data.pagingApi.getMore({ type: 'recheck' })
	},

	async scrollToLower() {
		if (!this.data.hadMore) return
		const {data, hadMore} = await this.getMore()
		this.setData({ reviewList: this.data.reviewList.concat(data), hadMore })
		wx.lin.hideToast()
	},

	handleNav(e) {
		let paramStr = `?id=${e.detail.id}`
		if (this.data.param === 'Safety') paramStr += `&param=${this.data.param}`
		wx.navigateTo({
			url: `/pages/quality-manage/reviewing/reviewing${paramStr}`,
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