// pages/site-manage/components/equipment-content-detail/equipment-content-detail.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    detail: {
      type: Object,
      required: true,
    },
    hide2: {
      type: Boolean,
      value: false,
    },
    hide3: {
      type: Boolean,
      value: false,
    },
  },

  observers: {
    detail(value) {
      let statusColor = ''
      if (value.status_name === '离线') statusColor = 'red'
      else if (value.status_name === '在线') statusColor = 'blue'
      this.setData({ statusColor })
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    detailData: [
      { key: '所属单位', valueFlag: 'company_name' },
      { key: '设备位置', valueFlag: 'address' },
      { key: '设备编号', valueFlag: 'device_number' },
      { key: '连接状态', valueFlag: 'status_name' },
      { key: '创建时间', valueFlag: 'create_time' },
    ],
    statusColor: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toFormPage() {
      this.triggerEvent('editTap', this.data.detail)
    },
    del() {
      wx.lin.showDialog({
        type: 'confirm',
        title: '注意！',
        content: '是否删除该设备',
        zIndex: 1000,
        success: (e) => {
          const { cancel } = e
          if (cancel) return
          this.triggerEvent('delTap', this.data.detail)
        }
      })
    },
  },
})
