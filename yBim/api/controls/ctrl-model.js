import http from '../http'

class CtrlModel {
  getInfo(data) {
    return http.request({
      url: '/controls/info',
      data
    })
  }

  getControlsWorkinfo(data) {
    return http.request({
      url: '/controls/workinfo',
      data
    })
  }

  getControlsQualityinfo(data) {
    return http.request({
      url: '/controls/qualityinfo',
      data
    })
  }

  getVideos(data) {
    return http.request({
      url: '/videos/list',
      method: 'get',
      data
    })
  }

  getWeather(data) {
    return http.request({
      url: '/controls/weather',
      method: 'get',
      data
    })
  }
}

export default new CtrlModel()
