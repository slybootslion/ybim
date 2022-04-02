import http from '../http'

class SafetyModel {
	postInspectionAdd(data) {
		return http.request({
			url: '/inspectionsafeties/add',
			method: 'post',
			data
		})
	}
	getInspectionList(data) {
		return http.request({
			url: '/inspectionsafeties/list',
			data
		})
	}
	getInspectionInfo(data) {
		return http.request({
			url: '/inspectionsafeties/info',
			data
		})
	}
	deleteInspectionDelete(data) {
		return http.request({
			url: '/inspectionsafeties/delete',
			method: 'post',
			data
		})
	}
	putInspectionEdit(data) {
		return http.request({
			url: '/inspectionsafeties/edit',
			method: 'put',
			data
		})
	}

	postInspectionRectify(data) {
		return http.request({
			url: '/inspectionsafeties/rectify',
			method: 'post',
			data
		})
	}

	postInspectionRecheck(data) {
		return http.request({
			url: '/inspectionsafeties/recheck',
			method: 'post',
			data
		})
	}
}

export default new SafetyModel()