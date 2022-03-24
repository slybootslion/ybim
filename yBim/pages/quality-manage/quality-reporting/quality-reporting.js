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
		picUrls: [],
		nowTime: '',
		part: '',
		zone: '',
		descriptor: '',
		grade: 0,
		grade_name: '',
		rectify_user_id: '',
		rectify_time: '',
		id: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	async onLoad(options) {
		this.setData({
			nickname: (await StorageCache.getUserInfo()).user.nickname,
			nowTime: dayjs(new Date).format('YYYY-MM-DD')
		})
		this.getInfoData(options)
	},
	async getInfoData(options) {
		const id = options.id ? options.id : '0'
		const res = await QualityApi.getInspectionqualitiesInfo({ id })
		// console.log(res)
		let data = {
			peoples: res.users,
		}
		if (id !== '0') {
			const editData = {
				picUrls: res.info.inspection.pic.map(img => 'http://ytbim.com' + img),
				part: res.info.inspection.part,
				zone: res.info.inspection.zone,
				descriptor: res.info.inspection.descriptor,
				grade: res.info.inspection.grade,
				grade_name: res.info.inspection.grade_name,
				rectify_user: res.info.inspection.rectify_user,
				rectify_user_id: res.info.inspection.rectify_user_id,
				rectify_time: res.info.inspection.rectify_time,
			}
			data = {
				...data,
				...editData,
			}
		}
		this.setData({
			...data
		})
	},
	handleImage(e) {
		// todo: recover pic handle logic
		console.log(e.detail)
		this.data.urls = e.detail.all.map(pic => pic.url)
		console.log(this.data.urls)
	},
	removeImg(e) {
		console.log(e)
		const url = e.detail.current
	},
	async submit() {
		const { urls, part, zone, descriptor, grade, rectify_user_id, rectify_time } = this.data
		if (!urls.length || !part || !zone || !descriptor || !grade || !rectify_user_id || !rectify_time) {
			wx.lin.showToast({
				title: '有必要信息未填写',
				icon: 'error',
			})
			return false
		}
		console.log(urls)
		return
		const ua = new UplaodApi()
		const uploadRes = []
		wx.lin.showToast({
			icon: 'loading',
			title: '提交中',
			duration: 0,
		})
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
		await QualityApi.postInspectionqualitiesAdd(data)
		wx.navigateBack()
		wx.lin.hideToast()
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
