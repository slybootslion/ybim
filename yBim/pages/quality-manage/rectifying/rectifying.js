// pages/quality-manage/rectifying/rectifying.js
import dayjs from '../../../tools/dayjs.min'
import StorageCache from '../../../tools/storage-cache'

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		currentId: 0,
		currentData: {
			id: 1, 
			i1: "康峪沟大桥现场围挡",
			i2: "康峪沟大桥左幅第6跨向北2米",
		},
		nowTime: '',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	async onLoad(options) {
		this.setData({
			currentId: +options.id,
			nickname: (await StorageCache.getUserInfo()).user.nickname,
			nowTime: dayjs(new Date).format('YYYY-MM-DD HH:mm:ss'),
		})
	}
})