// pages/quality-manage/rectifying/rectifying.js
import dayjs from '../../../tools/dayjs.min'
import StorageCache from '../../../tools/storage-cache'
import QualityApi from '../../../api/quality/quality-model'
import SafetyApi from '../../../api/quality/safety-model'
import { useUpload } from '../libs/hooks'

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		inspection_id: 0,
		currentData: {},
		nowTime: '',
		urls: [],
		Model: null,

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	async onLoad(options) {
		const data = {
			inspection_id: +options.id,
			nickname: (await StorageCache.getUserInfo()).user.nickname,
			nowTime: dayjs(new Date).format('YYYY-MM-DD HH:mm:ss'),
			Model: QualityApi,
		}
		if (options.param === 'Safety') {
			data.param = options.param
			data.Model = SafetyApi
		}
		this.setData({ ...data })
		this.getDetail()
	},

	async getDetail() {
		const res = await this.data.Model.getInspectionInfo({ id: this.data.inspection_id })
		const info = res.info[0].inspection
		const data = {
			id: info.id,
			zone: info.zone,
			part: info.part,
		}
		this.setData({
			currentData: {
				...data
			}
		})
	},

	handleImage(e) {
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
		let { urls, descriptor, inspection_id } = this.data
		if (!urls.length || !descriptor) {
			wx.lin.showToast({
				title: '有必要信息未填写',
				icon: 'error',
			})
			return false
		}

		const pic = await useUpload(urls)
		const data = {
			inspection_id, descriptor, pic,
		}
		await this.data.Model.postInspectionRectify(data)
		wx.navigateBack()
		wx.lin.hideToast()
	},

	handleDescriptor(e) {
		this.data.descriptor = e.detail.value
	},
})