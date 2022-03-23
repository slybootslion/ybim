// pages/quality-manage/quality-reporting/quality-reporting.js
import dayjs from '../../../tools/dayjs.min'
import StorageCache from '../../../tools/storage-cache'
import UplaodApi from '../../../api/upload'
import QualityApi from '../../../api/quality/quality-model'

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
			// { id: 1, value: 'Responsible 1' },
			// { id: 2, value: 'Responsible 2' },
			// { id: 3, value: 'Responsible 3' },
			// { id: 4, value: 'Responsible 4' },
		],
		urls: [],
		nowTime: '',
		part: '',
		zone: '',
		descriptor: '',
		grade: 0,
		rectify_user_id: '',
		rectify_time: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	async onLoad(options) {
		this.setData({
			nickname: (await StorageCache.getUserInfo()).user.nickname,
			nowTime: dayjs(new Date).format('YYYY-MM-DD')
		})
		this.getPersonData()
	},

	handleImage(e) {
		this.data.urls = e.detail.all.map(pic => pic.url)
	},
	getPersonData() {

	},
	handleDate() { },
	async submit() {
		const { urls, part, zone, descriptor, grade, rectify_user_id, rectify_time } = this.data
		console.log(urls, part, zone, descriptor, grade, rectify_user_id, rectify_time);
		if (!urls.length || !part || !zone || !descriptor || !grade || !rectify_user_id || !rectify_time) {
			wx.lin.showToast({
				title: '有必要信息未填写',
				icon: 'error',
			})
			return false
		}
		const ua = new UplaodApi()
		const uploadRes = []
		for (let i = 0; i < urls.length; i++) {
			const url = urls[i];
			// const originName = url.substring(url.lastIndexOf("/")+1)
			const res = await ua.postImage(url)
			uploadRes.push(res.data)
			// uploadRes.push(`${res.data}|||${originName}`)
		}
		const data = {
			part, zone, descriptor, grade, rectify_user_id, rectify_time, pic: JSON.stringify(uploadRes)
		}
		const res = await QualityApi.postInspectionqualitiesAdd(data)
		console.log(res)
		wx.navigateBack()
	},
	handlePart(e) {
		this.data.part = e.detail.value
	},
	handleZone(e) {
		this.data.zone = e.detail.value
	},
	handleDescriptor(e) {
		this.data.descriptor = e.detail.value
	},
	handleGrade(e) {
		this.data.grade = e.detail.value
	},
	handleRectifyUserId(e) {
		this.data.rectify_user_id = e.detail.value
	},
	handleDate(e) {
		this.data.rectify_time = e.detail.value
	},
})
