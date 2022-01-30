import http from '../http'

class ChangeModel {
  getRostersList() {
    return http.request({
      url: '/rosters/list'
    })
  }

  postRostersAdd(data) {
    return http.request({
      url: '/rosters/add',
      method: 'post',
      data
    })
  }
}

export default new ChangeModel()