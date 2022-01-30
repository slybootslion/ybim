import http from "../http"

class RecordModel {
  getTimeticketsList(data) {
    return http.request({
      url: '/timetickets/list',
      data
    })
  }

  postTimeticketsDelete(data) {
    return http.request({
      url: '/timetickets/delete',
      method: 'post',
      data
    })
  }

  getTimeticketsEmplist(data) {
    return http.request({
      url: '/timetickets/emplist',
      data
    })
  }

  postTimeticketsAdd(data) {
    return http.request({
      url: '/timetickets/add',
      method: 'post',
      data
    })
  }

  putTimeticketsEdit(data) {
    return http.request({
      url: '/timetickets/edit',
      method: 'put',
      data
    })
  }
}

export default new RecordModel()