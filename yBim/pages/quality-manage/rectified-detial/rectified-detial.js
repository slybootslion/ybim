// pages/quality-manage/rectified-detial/rectified-detial.js
import QualityApi from '../../../api/quality/quality-model'
import SafetyApi from '../../../api/quality/safety-model'

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		currendData: {},
		detailList: [],
		currentId: 0,
		state: undefined,
		pageTitle: '待整改',
		btnText: '立即复查',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		console.log(options.state)
		const data = {
			state: options.state,
			currentId: +options.id
		}
		const Model = options.param === "Safety" ? SafetyApi : QualityApi
		this.setData({
			...data, Model, param: options.param
		})
	},
	onShow() {
		this.getInfo()
	},

	async getInfo() {
		const id = this.data.currentId
		const res = await this.data.Model.getInspectionInfo({ id })
		const detailList = res.info
		const currendData = res.info[0].inspection
		const btnText = this.data.state === "review" ? '立即复查' : '立即整改'
		this.setData({
			currendData,
			detailList,
			btnText
		})
	},

	goRectifying() {
		const { state, currentId } = this.data
		console.log(state)
		if (state === 'review') {
			// 复查
			wx.navigateTo({
				url: `/pages/quality-manage/reviewing/reviewing?id=${currentId}`,
			})
		} else {
			// 整改
			wx.navigateTo({
				url: `/pages/quality-manage/rectifying/rectifying?id=${currentId}`,
			})
		}
	}
})