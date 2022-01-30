import http from '../http'

class AttendanceModel {
  getTimecardsStat(data) {
    return http.request({
      url: '/timecards/stat',
      data,
    })
  }

  getGroupTime(data) {
    return http.request({
      url: '/timecards/grouptime',
      data,
    })
  }

  postGroupTimeDeal(data) {
    return http.request({
      url: '/timecards/grouptimedeal',
      method: 'post',
      data,
    })
  }
}

export default new AttendanceModel()
