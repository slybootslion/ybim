import http from '../http'

class QualityModel {
	postInspectionqualitiesAdd(data) {
		return http.request({
			url: '/inspectionqualities/add',
			method: 'post',
			data
		})
	}
	getInspectionqualitiesList(data) {
		return http.request({
			url: '/inspectionqualities/list',
			data
		})
	}
	getInspectionqualitiesInfo(data) {
		return http.request({
			url: '/inspectionqualities/info',
			data
		})
	}
}

export default new QualityModel()