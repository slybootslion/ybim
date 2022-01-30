import http from "../http";

class BaseDataModel {
  getCompany() {
    return http.request({
      url: '/builingcompanies/list',
    })
  }

  getMySystemInfo() {
    return http.request({
      url: '/systems/info'
    })
  }

  putSystemsEditpw(data) {
    return http.request({
      url: '/systems/editpw',
      method: 'put',
      data
    })
  }

  getKindworksList() {
    return http.request({
      url: '/kindworks/list'
    })
  }

  postKindworksAdd(data) {
    return http.request({
      url: '/kindworks/add',
      method: 'post',
      data
    })
  }

  putKindworksEdit(data) {
    return http.request({
      url: '/kindworks/edit',
      method: 'put',
      data
    })
  }

  postKindworksDelete(data) {
    return http.request({
      url: '/kindworks/delete',
      method: 'post',
      data
    })
  }
}

export default new BaseDataModel()
