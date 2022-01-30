import http from '../http'

class UserModel {
  login (data) {
    return http.request({
      url: '/users/login',
      method: 'post',
      data
    })
  }
}

export default new UserModel()
