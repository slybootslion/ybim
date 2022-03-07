// pages/quality-manage/rectified-detial/rectified-detial.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		currendData: {
			title: '现场围挡',
			zone: '化龙沟大桥东段25米',
			level: '二级',
			date: '2020-10-01 12:31:33'
		},
		detailList: [
			{
				id: 1,
				i1: 1,
				i2: '2020-08-18 15:54',
				i3: '现场围挡倒塌摆放混乱，并被车反复碾压，导致变形，现场围挡倒塌摆放混乱，并被车反复碾压，导致变形。',
				i4: ['http://bjbsite.com//public/upload/moeny/2021/05/19/60a4a7c40bd8c.jpg', 'http://bjbsite.com//public/upload/moeny/2021/05/19/60a4a7c376019.jpg', 'http://bjbsite.com//public/upload/moeny/2021/05/19/60a4a7c47df7b.jpg'],
				i5: 1,
				i6: '李工',
				i7: '2020-10-01 13:56:32',
				i8: '某某某',
				i9: '2020-10-01 13:44:32'
			}
		]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		this.currentId = options.id
	},

	goRectifying () {
		wx.navigateTo({
			url: '/pages/quality-manage/rectifying/rectifying',
		})
	}
})