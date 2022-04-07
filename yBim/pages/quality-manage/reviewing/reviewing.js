// pages/quality-manage/reviewing/reviewing.js
import dayjs from '../../../tools/dayjs.min'
import StorageCache from '../../../tools/storage-cache'
import QualityApi from '../../../api/quality/quality-model'
import SafetyApi from '../../../api/quality/safety-model'
import { useUpload, useMitt } from '../libs/hooks'

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		inspection_id: 0,
		currentData: {},
		nowTime: '',
		resultList: [
			{ key: 2, value: '正常' },
			{ key: 3, value: '异常' },
		],
		urls: [],
		descriptor: '',
		state: '',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	async onLoad(options) {
		const { param } = options
		console.log(options)
		const Model = param === "Safety" ? SafetyApi : QualityApi
		this.setData({
			inspection_id: +options.id,
			nickname: (await StorageCache.getUserInfo()).user.nickname,
			nowTime: dayjs(new Date).format('YYYY-MM-DD HH:mm:ss'),
			Model, param
		})
		this.getDetail()
	},

	async getDetail() {
		const res = await this.data.Model.getInspectionInfo({ id: this.data.inspection_id })
		this.setData({
			currentData: res.info[0].inspection
		})
	},

	handleImage(e) {
		if (this.data.urls.length) {
			this.data.urls = e.detail.all
		} else {
			this.data.urls = e.detail.all.map(pic => pic.url)
		}
	},

	async submit() {
		let { urls, descriptor, inspection_id, state } = this.data
		if (!urls.length || !descriptor || !state) {
			wx.lin.showToast({
				title: '有必要信息未填写',
				icon: 'error',
			})
			return false
		}
		const pic = await useUpload(urls)
		const data = {
			inspection_id, descriptor, pic, state,
		}
		await this.data.Model.postInspectionRecheck(data)
		wx.navigateBack()
		useMitt().emit('isBackFormPage')
		wx.lin.hideToast()
	},

	handleState(e) {
		this.data.state = e.detail.value
	},

	handleDescriptor(e) {
		this.data.descriptor = e.detail.value
	},
})