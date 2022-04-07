import UplaodApi from '../../../api/upload'
import config from '../../../config/index'
import mitt from '../../../tools/mitt'

export const useUpload = async (urls) => {
	const ua = new UplaodApi()
		const uploadRes = []
		wx.lin.showToast({
			icon: 'loading',
			title: '提交中',
			duration: 9999,
		})
		urls = urls.map(url => {
			if (typeof url === 'string') return url
			else return url.url
		})
		const noNeedUploadList = urls.filter(url => url.startsWith(config.imgBaseUrl)).map(url => url.replace(config.imgBaseUrl, ''))
		const needUploadList = urls.filter(url => !url.startsWith(config.imgBaseUrl))
		for (let i = 0; i < needUploadList.length; i++) {
			const url = needUploadList[i];
			// const originName = url.substring(url.lastIndexOf("/")+1)
			const res = await ua.postImage(url)
			uploadRes.push(res.data)
			// uploadRes.push(`${res.data}|||${originName}`)
		}
		return JSON.stringify(noNeedUploadList.concat(uploadRes))
}

const m = mitt()
export const useMitt = () => m