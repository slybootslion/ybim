// pages/quality-manage/rectified-detial/rectified-detial.js
import QualityApi from '../../../api/quality/quality-model'
import SafetyApi from '../../../api/quality/safety-model'
import { useMitt } from '../libs/hooks'

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		currentData: {},
		detailList: [],
		currentId: 0,
		state: undefined,
		pageTitle: '待整改',
		btnText: '立即复查',
		showSubmitBtn: true,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		const data = {
			state: options.state,
			currentId: +options.id
		}
		const Model = options.param === "Safety" ? SafetyApi : QualityApi
		this.setData({
			...data, Model, param: options.param
		})
		useMitt().on('isBackFormPage', () => this.setData({ showSubmitBtn: false }))
	},
	onShow() {
		this.getInfo()
	},

	async getInfo() {
		const id = this.data.currentId
		const res = await this.data.Model.getInspectionInfo({ id })
		// console.log(res)
		const detailList = res.info
		const currentData = res.info[0].inspection
		let btnText = '立即复查'
		if (currentData.state === '0') {
			btnText = '立即整改'
		}
		// if (Array.isArray(res.info[0].recification) &&
		// 	res.info[0].recification.length == 0) btnText = '立即整改'
		this.setData({
			currentData,
			detailList,
			btnText
		})
	},

	goRectifying() {
		const { btnText, currentId, param } = this.data
		let paramStr = `?id=${currentId}`
		if (param === 'Safety') {
			paramStr += `&param=Safety`
		}
		if (btnText === '立即复查') {
			// 复查
			wx.navigateTo({
				url: `/pages/quality-manage/reviewing/reviewing${paramStr}`,
			})
		}
		if (btnText === '立即整改') {
			// 整改
			wx.navigateTo({
				url: `/pages/quality-manage/rectifying/rectifying${paramStr}`,
			})
		}
	}
})