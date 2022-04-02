// pages/quality-manage/components/rectified-detail-item/rectified-detail-item.js
import config from '../../../../config/index'

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		data: {
			type: Object,
			value: {}
		}
	},

	observers: {
		data(value) {
			if (!value) return
			const data = {
				...this.properties.data
			}
			if (this.properties.data.inspection.pic) {
				data.inspection.pic = this.properties.data.inspection.pic.map(pic => config.imgBaseUrl + pic)
			}
			if (this.properties.data.recification.pic) {
				data.recification.pic = this.properties.data.recification.pic.map(pic => config.imgBaseUrl + pic)
			}
			if (this.properties.data.recheck.pic) {
				data.recheck.pic = this.properties.data.recheck.pic.map(pic => config.imgBaseUrl + pic)
			}
			// console.log(data)
			this.setData({ currentData: data })
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		currentData: {}
	},

	/**
	 * 组件的方法列表
	 */
	methods: {

	}
})
