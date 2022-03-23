// pages/quality-manage/components/form-input.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		label: {
			type: String,
			default: '标签'
		},
		placeholder: {
			type: String,
			default: ''
		},
		isRequired: {
			type: Boolean,
			default: false
		},
		type: {
			type: String,
			value: 'input',
		},
		selectList: {
			type: Array,
			value: []
		},
		value: String,
		selectKeyStr: String,
		selectShowStr: String,
		selectValue: String,
		selectCalendar: String,
    disabled: {
      type: Boolean,
      value: false,
		},
		isPadding: {
			type: Boolean,
			value: false
		},
		maxlength: {
			type: Number,
			value: -1
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
		selectTap() {
			if (!this.data.selectList.length) {
				this.triggerEvent('selectListEmpty')
				return
			}
			this.setData({
				showPopup: true,
			})
		},
		popupItemClick(e) {
			const { id } = e.currentTarget
			this.triggerEvent('valueChange', { value: id })
			const { selectList, selectKeyStr } = this.data
			const current = selectList.find(item => item[selectKeyStr] == id)
			this.setData({
				showPopup: false,
				selectedCurrent: current[this.data.selectShowStr],
			})
		},
		valueChange(e) {
			this.triggerEvent('valueChange', e.detail)
		}
	}
})
