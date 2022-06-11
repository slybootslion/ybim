// components/input-element/input-element.js
import { promisic } from '../../lu-ui/utils/util'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
      value: 'input',
    },
    inputType: {
      type: String,
      value: 'text'
    },
    label: {
      type: String,
      value: 'label',
    },
    isRequired: {
      type: Boolean,
      value: false,
    },
    placeholder: {
      type: String,
      value: '请输入',
    },
    value: String,
    disabled: {
      type: Boolean,
      value: false,
    },
    selectList: {
      type: Array,
      value: [],
    },
    selectKeyStr: String,
    selectShowStr: String,
    selectValue: String,
    selectCalendar: String,
    labelWidth: {
      type: Number,
      value: 200
    },
    defaultSelectDate: {
      type: String,
      value: ''
    },
    hideLabel: {
      type: Boolean,
      value: false
    },
    txtLeft: {
      type: Boolean,
      value: false
    },
    minContainer: {
      type: Boolean,
      value: false
    },
    labelNoPadding: {
      type: Boolean,
      value: false
    },
    maxlength: {
      type: Number,
      value: -1
    },
  },

  observers: {
    selectValue(selectedCurrent) {
      this.setData({ selectedCurrent })
    },

    selectCalendar(calendarCurrent) {
      this.setData({ calendarCurrent })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    popupShow: false,
    selectedCurrent: '',
    showCalendar: false,
    calendarCurrent: '',
    avatarSrc: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleInput(e) {
      this.triggerEvent('valueChange', e.detail)
    },
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

    // 日历
    calendarTap() {
      this.setData({ showCalendar: true })
    },

    onPickDateChange(e) { },

    onControl(e) { },

    onPickDay(e) { },

    onRangePick(e) { },

    onInitDate(e) { },

    calendarSubmit(e) {
      this.setData({
        showCalendar: false,
        calendarCurrent: e.detail
      })
      this.triggerEvent('valueChange', { value: e.detail })
    },

    // 头像上传
    async selectPic() {

      const res = await promisic(wx.chooseImage)({
        count: 1,
        sizeType: 'compressed',
      })
      const tempFilePaths = res.tempFilePaths[0]
      this.setData({
        avatarSrc: tempFilePaths
      })
      this.triggerEvent('imageUpload', { tempFilePaths })
    }
  },
})
