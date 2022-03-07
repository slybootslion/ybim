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
		hideEdit: {
			type: Boolean,
			value: false
		},
		btnText: {
			type: String,
			value: '立即整改'
		}
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
			this.triggerEvent('detailEvent', { id: this.properties.data.id });
		},
		goRectifiedForm() {
			this.triggerEvent('navEvent', { id: this.properties.data.id });
		}
	}
})
