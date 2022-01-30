import http from '../http'

class GroupModel {
  getGroupList(data) {
    return http.request({
      url: '/groups/list',
      data
    })
  }

  postGroupAdd(data) {
    return http.request({
      url: '/groups/add',
      method: 'post',
      data
    })
  }

  postGroupDelete(data) {
    return http.request({
      url: '/groups/delete',
      method: 'post',
      data
    })
  }

  putGroupEdit(data) {
    return http.request({
      url: '/groups/edit',
      method: 'put',
      data
    })
  }

  getGroupInfo(data) {
    return http.request({
      url: '/groups/info',
      data
    })
  }
}

export default new GroupModel()