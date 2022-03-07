// pages/quality-manage/components/recified-item/recified-item.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		data: {
			type: Object,
			value: {},
		},
	},

	/**
	 * 组件的初始数据
	 */
	data: {

	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		toDetails() {
			wx.navigateTo({
				url: '/pages/quality-manage/rectified-detial/rectified-detial?id=' + this.properties.data.id,
			})
		},
		goRectifiedForm() {
			wx.navigateTo({
				url: '/pages/quality-manage/rectifying/rectifying',
			})
		}
	}
})
