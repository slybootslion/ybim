import http from '../http'

class QualityModel {
	postInspectionAdd(data) {
		return http.request({
			url: '/inspectionqualities/add',
			method: 'post',
			data
		})
	}
	getInspectionList(data) {
		return http.request({
			url: '/inspectionqualities/list',
			data
		})
	}
	getInspectionInfo(data) {
		return http.request({
			url: '/inspectionqualities/info',
			data
		})
	}
	deleteInspectionDelete(data) {
		return http.request({
			url: '/inspectionqualities/delete',
			method: 'post',
			data
		})
	}
	putInspectionEdit(data) {
		return http.request({
			url: '/inspectionqualities/edit',
			method: 'put',
			data
		})
	}

	postInspectionRectify(data) {
		return http.request({
			url: '/inspectionqualities/rectify',
			method: 'post',
			data
		})
	}

	postInspectionRecheck(data) {
		return http.request({
			url: '/inspectionqualities/recheck',
			method: 'post',
			data
		})
	}
}

export default new QualityModel()