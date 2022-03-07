import http from '../http'

class RosterModel {
  getWorkersList(data) {
    return http.request({
      url: '/workers/list',
      data,
    })
  }

  getWorkersInfo(data) {
    return http.request({
      url: '/workers/info',
      data
    })
  }

  getRostersInfo(data) {
    return http.request({
      url: '/rosters/info',
      data
    })
  }

  putRostersEdit(data) {
    return http.request({
      url: '/rosters/edit',
      method: 'put',
      data
    })
  }

  postWorkersAdd(data) {
    return http.request({
      url: '/workers/add',
      method: 'post',
      data
    })
  }
}

export default new RosterModel()
