import http from '../http'

class VideoModel {
  getVideosList(data) {
    return http.request({
      url: '/videos/list',
      data,
    })
  }

  postVideosAdd(data) {
    return http.request({
      url: '/videos/add',
      method: 'POST',
      data,
    })
  }

  postVideosDelete(data) {
    return http.request({
      url: '/videos/delete',
      method: 'POST',
      data,
    })
  }

  putVideosEdit(data) {
    return http.request({
      url: '/videos/edit',
      method: 'PUT',
      data,
    })
  }
}

export default new VideoModel()
