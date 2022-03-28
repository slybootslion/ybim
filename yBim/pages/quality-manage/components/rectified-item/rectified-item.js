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
		isOvertime: {
			type: Boolean,
			value: false
		},
		hideBtn: {
			type: Boolean,
			value: false
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
			this.triggerEvent('detailEvent', { id: this.properties.data.id, type: this.properties.data.type });
		},
		goRectifiedForm() {
			this.triggerEvent('navEvent', { id: this.properties.data.id, type: this.properties.data.state });
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
			wx.navigateTo({
				url: `/pages/quality-manage/quality-reporting/quality-reporting?id=${this.properties.data.id}`,
			})
		}
	}
})
