// pages/personnel-manage/group-detail/group-detail.js
import GroupApi from '../../../api/personnel/group-model'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    group_id: '',
    isLoading: true,
    pageTitle: '班组详细',
    showSet: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.data.group_id = options.group_id
    this.getData()
  },

  async getData() {
    this.setData({ isLoading: true })
    const { group_id } = this.data
    const res = await GroupApi.getGroupInfo({ group_id })
    let { info, emp_list } = res
    emp_list = emp_list.map(emp => {
      emp.showLeaderTag = emp.emp_id === info.leader_emp_id
      return emp
    })
    this.setData({ isLoading: false, info, emp_list })
  },


  editLeader() {
    this.addShowChoose(this.data.info.leader_emp_id)
  },

  addShowChoose(emp_id) {
    const emp_list = this.data.emp_list.map(emp => {
      emp.showChoose = true
      let color = '#9d9d9d'
      if (emp.emp_id === emp_id) color = '#0080ff'
      if (emp.in_space_name === '已退场') color = '#efefef'
      emp.iconColor = color
      return emp
    })
    this.setData({ emp_list, showSet: true, })
  },

  cancelShowChoose() {
    const emp_list = this.data.emp_list.map(emp => {
      emp.showChoose = false
      return emp
    })
    this.setData({ emp_list, showSet: false, activeEmpId: '' })
  },

  leaderSelect(e) {
    const emp_id = e.detail
    this.data.activeEmpId = emp_id
    this.addShowChoose(emp_id)
  },

  async submitLeader() {
    const { activeEmpId, group_id } = this.data
    if (!activeEmpId) return false

    await GroupApi.putGroupEdit({
      group_id,
      leader_emp_id: activeEmpId
    })

    this.cancelShowChoose()
    this.getData()
  }
})