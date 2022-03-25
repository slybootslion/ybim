// pages/quality-manage/to-review/to-review.js
import QualityApi from '../../../api/quality/quality-model'
import Paging from '../../../api/paging'

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		reviewList: [
			// {
			// 	id: 1,
			// 	title: '现场围挡',
			// 	zone: '化龙沟大桥东段25米',
			// 	level: '二级',
			// 	date: '2020-10-01 12:31:33'
			// },
			// {
			// 	id: 2,
			// 	title: '康峪沟大桥左幅桥面',
			// 	zone: '康峪沟大桥西跨第6跨向左2米',
			// 	level: '三级',
			// 	date: '2020-10-01 12:31:33'
			// },
		],
		isLoading: true,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad (options) {
		this.getList()
	},

	async getList() {
		this.data.pagingApi = new Paging(QualityApi.getInspectionqualitiesList)
		const res = await this.getMore()
		console.log(res);
		this.setData({ reviewList: res.data, hadMore: res.hadMore, isLoading: false })
	},

	async getMore() {
		return this.data.pagingApi.getMore({ type: 'recheck' })
	},

	handleNav(e) {
		console.log(e)
		wx.navigateTo({
			url: `/pages/quality-manage/reviewing/reviewing?id=${e.target.id}`,
		})
	},

	handleDetail(e) {
		wx.navigateTo({
			url: `/pages/quality-manage/rectified-detial/rectified-detial?id=${e.target.id}&state=review`,
		})
	}
})