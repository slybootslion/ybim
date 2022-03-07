import http from '../http'

class PayrollModel {
  getTimeticketsWorkclear () {
    return http.request({
      url: '/timetickets/workclear'
    })
  }

  getTimeticketsWorkpayinfo (data) {
    return http.request({
      url: '/timetickets/workpayinfo',
      data
    })
  }

  postTimeticketsGPay (data) {
    return http.request({
      url: '/timetickets/gpay',
      method: 'post',
      data
    })
  }
}

export default new PayrollModel()