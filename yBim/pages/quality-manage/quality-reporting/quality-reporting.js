// pages/quality-manage/quality-reporting/quality-reporting.js
import dayjs from '../../../tools/dayjs.min'
import StorageCache from '../../../tools/storage-cache'

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		pageTitle: '质量上报',
		levelList: [
			{ key: 1, value: '一般' },
			{ key: 2, value: '严重' },
			{ key: 3, value: '重大' },
		],
		peoples: [
			{ id: 1, value: 'Responsible 1' },
			{ id: 2, value: 'Responsible 2' },
			{ id: 3, value: 'Responsible 3' },
			{ id: 4, value: 'Responsible 4' },
		],
		nowTime: '',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	async onLoad(options) {
		this.setData({
			nickname: (await StorageCache.getUserInfo()).user.nickname,
			nowTime: dayjs(new Date).format('YYYY-MM-DD HH:mm:ss')
		})
	},

	handleImage() { },

	handleDate() { },
	submit() { }
})
