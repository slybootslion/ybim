import http from "../http";

export const getControlsQualityinfo = () => {
	return http.request({
		url: '/controls/qualityinfo',
	})
}