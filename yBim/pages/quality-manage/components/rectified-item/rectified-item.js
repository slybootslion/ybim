// pages/quality-manage/components/recified-item/recified-item.js
import QualityApi from '../../../../api/quality/quality-model'
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		data: {
			type: Object,
			value: {},
		},
		param: {
			type: String,
			value: ''
		},
		isFinished: {
			type: Boolean,
			value: false
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
		},
		del() {
			wx.lin.showDialog({
				type: 'confirm',
				title: '注意！',
				content: '是否删除该上报内容？',
				success: async (e) => {
					const { cancel } = e
					if (cancel) return
					await QualityApi.deleteInspectionqualitiesDelete({ id: this.properties.data.id })
					wx.lin.showToast({
						title: '删除成功',
						icon: 'success'
					})
					this.triggerEvent('delItem', { id: this.properties.data.id });
				}
			})
		},
		toFormPage() {
			let paramStr = `?id=${this.properties.data.id}`
			if (this.properties.param === 'Safety') {paramStr += `&param=Safety`}
			wx.navigateTo({
				url: `/pages/quality-manage/quality-reporting/quality-reporting${paramStr}`,
			})
		}
	}
})
