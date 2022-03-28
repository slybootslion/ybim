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
	deleteInspectionqualitiesDelete(data) {
		return http.request({
			url: '/inspectionqualities/delete',
			method: 'post',
			data
		})
	}
	putInspectionqualitiesEdit(data) {
		return http.request({
			url: '/inspectionqualities/edit',
			method: 'put',
			data
		})
	}

	postInspectionqualitiesRectify(data) {
		return http.request({
			url: '/inspectionqualities/rectify',
			method: 'post',
			data
		})
	}

	postInspectionqualitiesRecheck(data) {
		return http.request({
			url: '/inspectionqualities/recheck',
			method: 'post',
			data
		})
	}
}

export default new QualityModel()