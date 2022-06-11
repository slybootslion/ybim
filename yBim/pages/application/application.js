// import StorageCache from '../../tools/storage-cache'
// pages/application/application.js
import { getControlsQualityinfo } from '../../api/base-data/qulity-info-model'
import { setScrollHeight, setPageScrollViewEvent } from '../../tools/system-info'

let list = [
	{
		title: '人员管理',
		basePage: 'personnel-manage',
		content: [
			{ key: '添加工人', icon: 'tjgr', page: 'add-workers', code: 413 },
			{ key: '花名册', icon: 'hmc', page: 'roster-list', code: 399 },
			{ key: '人员变动', icon: 'rybd', page: 'personnel-change', code: 414 },
			{ key: '班组管理', icon: 'bzgl', page: 'team-manage', code: 406 },
			{ key: '考勤统计', icon: 'kqtj', page: 'attendance-statistics', code: 467 },
			{ key: '扫脸考勤', icon: 'slkq', page: '' },
			{ key: '记工单', icon: 'jgd', page: 'record-work-order', code: 454 },
			{ key: '工资单', icon: 'gzd', page: 'payroll-page', code: 461 },
		],
	},
	{
		title: '现场管理',
		basePage: 'site-manage',
		content: [
			{ key: '环境监测', icon: 'hjjc', page: 'environ-monitoring', code: 388 },
			{ key: '视频监控', icon: 'spjk', page: 'video-surveillance', code: 433 },
			{ key: '设备管理', icon: 'sbgl', page: '' },
		],
	},
	{
		title: '质量管理',
		basePage: 'quality-manage',
		content: [
			{ key: '质量上报', icon: 'zlsb', page: 'quality-reporting' },
			{ key: '待整改', icon: 'dzg', page: 'rectified', tag: 'dzg1' },
			{ key: '待复查', icon: 'dfc', page: 'to-review', tag: 'dfc1' },
			{ key: '超期隐患', icon: 'cqyh', page: 'overtime' },
			{ key: '累计检查', icon: 'ljjc', page: 'accumulate' },
		],
	},
	{
		title: '安全管理',
		basePage: 'quality-manage',
		content: [
			{ key: '质量上报', icon: 'zlsb', page: 'quality-reporting', param: 'Safety' },
			{ key: '待整改', icon: 'dzg', page: 'rectified', param: 'Safety', tag: 'dzg2' },
			{ key: '待复查', icon: 'dfc', page: 'to-review', param: 'Safety', tag: 'dfc2' },
			{ key: '超期隐患', icon: 'cqyh', page: 'overtime', param: 'Safety' },
		],
	},
]

function checkHide(list) {
	const hideList = wx.getStorageSync('userInfo').hidden
	const tempList = []
	if (hideList && hideList.length) {
		for (let i = 0; i < list.length; i++) {
			const item = list[i];
			const content = item.content.map(c => {
				if (hideList.includes(c.code)) c.hide = true
				return c
			})
			item.content = content
			tempList.push(item)
		}
		return tempList
	} else {
		return list
	}
}
list = checkHide(list)
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		isLoading: true,
		contentHeight: 0,
		barColor: 'transparent',
		list,
		tagData: {
			dfc2: 0,
			dzg2: 0,
			dzg1: 0,
			dfc1: 0,
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	async onLoad(options) {
		await setScrollHeight(this)
		this.getQualityinfo()
	},

	async getQualityinfo() {
		const res = await getControlsQualityinfo()
		const tagData = {}
		tagData.dzg1 = res.quality_red_points.recheckpc
		tagData.dzg2 = res.safe_red_points.recheckpc
		tagData.dfc1 = res.quality_red_points.rectifypc
		tagData.dfc2 = res.safe_red_points.rectifypc
		this.setData({ tagData })
	},

	handleTap(e) {
		const { page, param } = e.currentTarget.dataset
		// console.log(param)
		if (!page) return
		const url = this.findUrl(page, param)
		if (url) wx.navigateTo({ url })
	},
	findUrl(page, param) {
		const { list } = this.data
		let url
		for (let i = 0; i < list.length; i++) {
			const currentBasePage = list[i].basePage
			const current = list[i]
			for (let j = 0; j < current.content.length; j++) {
				const item = current.content[j]
				if (page === item.page) {
					const base = `/pages/${currentBasePage}/${page}/${page}`
					url = !param ? base : base + `?param=${param}`
					return url
				}
			}
		}
		return url
	},
	async scrolling(e) {
		setPageScrollViewEvent(e, this)
	},
})
