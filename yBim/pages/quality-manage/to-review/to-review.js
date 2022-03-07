// pages/quality-manage/to-review/to-review.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		reviewList: [
			{
				id: 1,
				title: '现场围挡',
				zone: '化龙沟大桥东段25米',
				level: '二级',
				date: '2020-10-01 12:31:33'
			},
			{
				id: 2,
				title: '康峪沟大桥左幅桥面',
				zone: '康峪沟大桥西跨第6跨向左2米',
				level: '三级',
				date: '2020-10-01 12:31:33'
			},
		]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},

	handleNav(e) {
		console.log(e)
	},

	handleDetail(e) {
		const id = e.detail.id
		wx.navigateTo({
			url: '/pages/quality-manage/rectified-detial/rectified-detial?id=' + e.target.id,
			url: `/pages/quality-manage/rectified-detial/rectified-detial?id=${e.target.id}&state=review`,
		})
	}
})