class SelectWorkerStore {
  constructor(order) {
    if (order || !SelectWorkerStore.instance && order != null) {
      this.addOrder = order
      this.TicketEmp = []
      this.empList = []
      SelectWorkerStore.instance = this
    }
    return SelectWorkerStore.instance
  }

  render() {
    const { TicketEmp } = this
    this.addOrder.setData({
      TicketEmp
    })
  }

  setEmpList(list) {
    this.empList = list
    this.render()
  }

  getEmpList() {
    return this.empList || null
  }

  setTicketEmp(list) {
    this.TicketEmp = list
    this.render()
  }

  getTickEmp () {
    return this.TicketEmp
  }
}

export default SelectWorkerStore