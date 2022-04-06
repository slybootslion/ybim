// pages/quality-manage/quality-reporting/quality-reporting.js
import dayjs from '../../../tools/dayjs.min'
import StorageCache from '../../../tools/storage-cache'
import UplaodApi from '../../../api/upload'
import QualityApi from '../../../api/quality/quality-model'
import SafetyApi from '../../../api/quality/safety-model'
import config from '../../../config/index'

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
		peoples: [],
		urls: [],
		nowTime: '',
		part: '',
		zone: '',
		descriptor: '',
		grade: 0,
		grade_name: '',
		rectify_user_id: '',
		rectify_time: '',
		id: '',
		Model: null,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	async onLoad(options) {
		const { param } = options
		console.log(options)
		const data = {
			nickname: (await StorageCache.getUserInfo()).user.nickname,
			nowTime: dayjs(new Date).format('YYYY-MM-DD')
		}
		data.Model = param === 'Safety' ? SafetyApi : QualityApi
		this.setData({
			...data
		})
		this.getInfoData(options)
	},
	async getInfoData(options) {
		const id = options.id ? options.id : '0'
		const res = await this.data.Model.getInspectionInfo({ id })
		console.log(res)
		let data = {
			peoples: res.users,
		}
		if (id !== '0') {
			const editData = {
				urls: res.info[0].inspection.pic.map(img => config.imgBaseUrl + img),
				part: res.info[0].inspection.part,
				zone: res.info[0].inspection.zone,
				descriptor: res.info[0].inspection.descriptor,
				grade: res.info[0].inspection.grade,
				grade_name: res.info[0].inspection.grade_name,
				rectify_user: res.info[0].inspection.rectify_user,
				rectify_user_id: res.info[0].inspection.rectify_user_id,
				rectify_time: res.info[0].inspection.rectify_time,
				id: res.info[0].inspection.id,
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
		if (this.data.urls.length) {
			this.data.urls = e.detail.all
		} else {
			this.data.urls = e.detail.all.map(pic => pic.url)
		}
	},
	removeImg(e) {
		this.data.urls = this.data.urls.filter(url => e.detail.current !== url)
	},
	async submit() {
		let { urls, part, zone, descriptor, grade, rectify_user_id, rectify_time } = this.data
		if (!urls.length || !part || !zone || !descriptor || !grade || !rectify_user_id || !rectify_time) {
			wx.lin.showToast({
				title: '有必要信息未填写',
				icon: 'error',
			})
			return false
		}
		const ua = new UplaodApi()
		const uploadRes = []
		wx.lin.showToast({
			icon: 'loading',
			title: '提交中',
			duration: 9999,
		})
		urls = urls.map(url => {
			if (typeof url === 'string') return url
			else return url.url
		})
		console.log(urls)
		const noNeedUploadList = urls.filter(url => url.startsWith(config.imgBaseUrl)).map(url => url.replace(config.imgBaseUrl, ''))
		const needUploadList = urls.filter(url => !url.startsWith(config.imgBaseUrl))
		for (let i = 0; i < needUploadList.length; i++) {
			const url = needUploadList[i];
			// const originName = url.substring(url.lastIndexOf("/")+1)
			const res = await ua.postImage(url)
			uploadRes.push(res.data)
			// uploadRes.push(`${res.data}|||${originName}`)
		}
		const data = {
			part, zone, descriptor, grade, rectify_user_id, rectify_time, pic: JSON.stringify(noNeedUploadList.concat(uploadRes))
		}
		if (this.data.id) {
			data.id = this.data.id
			await this.data.Model.putInspectionEdit(data)
		} else {
			await this.data.Model.postInspectionAdd(data)
		}
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
