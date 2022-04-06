// pages/quality-manage/accumulate/accumulate.js
import QualityApi from '../../../api/quality/quality-model'
import SafetyApi from '../../../api/quality/safety-model'
import Paging from '../../../api/paging'

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		rectifiedList: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		const { param } = options
		const Model = param === "Safety" ? SafetyApi : QualityApi
		this.setData({ Model, param })
		this.getData()
	},

	async getData() {
		this.data.pagingApi = new Paging(this.data.Model.getInspectionList)
		const res = await this.getMore()
		this.setData({ rectifiedList: res.data, hadMore: res.hadMore, isLoading: false })
	},

	delItem(e) {
		const delId = e.detail.id
		const rectifiedList = this.data.rectifiedList.filter(item => item.id !== delId)
		this.setData({ rectifiedList })
	},

	async getMore() {
		return this.data.pagingApi.getMore({ type: 'over' })
	},

	handleDetail(e) {
		wx.navigateTo({
			url: `/pages/quality-manage/rectified-detial/rectified-detial?id=${e.detail.id}&state=accumulate`,
		})
	}
})