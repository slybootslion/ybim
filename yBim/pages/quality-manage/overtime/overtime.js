// pages/quality-manage/overtime/overtime.js
import QualityApi from '../../../api/quality/quality-model'
import Paging from '../../../api/paging'

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		rectifiedList: [
			// {
			// 	id: 1,
			// 	title: '现场围挡',
			// 	zone: '化龙沟大桥东段25米',
			// 	level: '二级',
			// 	date: '2020-10-01 12:31:33',
			// 	overtime: '超期5天',
			// 	type: 1
			// },
			// {
			// 	id: 2,
			// 	title: '康峪沟大桥左幅桥面',
			// 	zone: '康峪沟大桥西跨第6跨向左2米',
			// 	level: '三级',
			// 	date: '2020-10-01 12:31:33',
			// 	overtime: '超期5天',
			// 	type: 2
			// },
		]
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
		console.log(res)
		this.setData({ rectifiedList: res.data, hadMore: res.hadMore, isLoading: false })
	},

	async getMore() {
		return this.data.pagingApi.getMore({ type: 'expire' })
	},

	delItem(e) {
		const delId = e.detail.id
		const rectifiedList = this.data.rectifiedList.filter(item => item.id !== delId)
		this.setData({ rectifiedList })
	},

	handleNav(e) {
		console.log(e)
		console.log(e.detail.id, typeof e.detail.type)
		wx.navigateTo({
			url: `/pages/quality-manage/rectifying/rectifying?id=${e.detail.id}`,
		})
		// if(e.detail.type === 1) {
			
		// } else {
		// 	wx.navigateTo({
		// 		url: `/pages/quality-manage/reviewing/reviewing?id=${e.detail.id}`,
		// 	})
		// }
	},

	handleDetail(e) {
		wx.navigateTo({
			url: `/pages/quality-manage/rectified-detial/rectified-detial?id=${e.detail.id}`,
		})
		// if (e.detail.type === 1) {
			
		// } else {
		// 	wx.navigateTo({
		// 		url: `/pages/quality-manage/rectified-detial/rectified-detial?id=${e.detail.id}&state=review`,
		// 	})
		// }
	}
})