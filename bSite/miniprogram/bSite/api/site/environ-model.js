import http from '../http'

class EnvironModel {
  getMonitorsList() {
    return http.request({
      url: '/monitors/list',
    })
  }

  getDevicesList() {
    return http.request({
      url: '/devices/list',
    })
  }

  postDevicesAdd(data) {
    return http.request({
      url: '/devices/add',
      method: 'post',
      data,
    })
  }

  putDevicesEdit(data) {
    return http.request({
      url: '/devices/edit',
      method: 'put',
      data,
    })
  }

  postDel(data) {
    return http.request({
      url: '/devices/delete',
      method: 'post',
      data,
    })
  }
}

export default new EnvironModel()
