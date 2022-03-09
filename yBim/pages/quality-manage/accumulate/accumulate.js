// pages/quality-manage/accumulate/accumulate.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		rectifiedList: [
			{
				id: 1,
				title: '现场围挡',
				zone: '化龙沟大桥东段25米',
				level: '二级',
				date: '2020-10-01 12:31:33',
				overtime: '超期5天',
				type: 3
			},
			{
				id: 2,
				title: '康峪沟大桥左幅桥面',
				zone: '康峪沟大桥西跨第6跨向左2米',
				level: '三级',
				date: '2020-10-01 12:31:33',
				overtime: '超期5天',
				type: 3
			},
		]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {

	},

	handleDetail(e) {
		wx.navigateTo({
			url: `/pages/quality-manage/rectified-detial/rectified-detial?id=${e.detail.id}&state=accumulate`,
		})
	}
})