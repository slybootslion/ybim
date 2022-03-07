// index.js
// 获取应用实例
import StorageCache from '../../tools/storage-cache'
import CtrlApi from '../../api/controls/ctrl-model'
import BaseDataApi from '../../api/base-data/base-data-model'
import { setPageScrollViewEvent, setScrollHeight } from '../../tools/system-info'
import * as echarts from '../../components/ec-canvas/echarts'

const baseModelList = {
  rygl: { title: '人员管理' },
  jdgl: { title: '进度管理' },
  zlgl: { title: '质量管理' },
  hjjc: { title: '环境监测' },
  sbgl: { title: '设备管理' },
}

function echartsOpts (data = {}) {
  const colorList = [
    { c1: '#fccbcb', c2: '#ffe7e7' },
    { c1: '#d3e6fe', c2: '#ddf8ff' },
    { c1: '#fce0cb', c2: '#fdf4e6' },
  ]
  return {
    grid: {
      left: '0',
      right: '15%',
      bottom: '0',
      top: '20%',
      containLabel: true
    },
    yAxis: {
      type: 'category',
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        textStyle: {
          color: '#333',
        },
      },
      inverse: true,
      data: data.map(item => item.key + ':'),
    },
    xAxis: {
      show: false,
      type: 'value'
    },
    series: [
      {
        data: [...data.map(item => item.value)],
        type: 'bar',
        itemStyle: {
          normal: {
            color (params) {
              return new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                { offset: 0, color: colorList[params.dataIndex].c1 },
                { offset: 1, color: colorList[params.dataIndex].c2 },
              ])
            },
            label: {
              show: true,
              position: 'right',
              valueAnimation: true,
              textStyle: {
                color: '#333',
                fontSize: 12,
              }
            }
          }
        }
      }
    ]
  }
}

let eOpts = {}

function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // 像素
  });
  canvas.setChart(chart);

  let option = eOpts
  chart.setOption(option);
  return chart;
}

Page({
  data: {
    showPopup: false,
    projects: [],
    projectInfo: {},
    projectName: {},
    modelList: baseModelList,
    isLoading: true,
    contentHeight: 0,
    barColor: 'transparent',
    ec: {},
  },
  async onLoad() {
    await setScrollHeight(this)
    this.checkAuth()
    const { data: projects, info: projectInfo } = await this.getProjectList()
    const projectName = projects[0]
    this.setData({
      projectName,
      projectInfo,
      projects,
      isLoading: false
    })
    projectName && this.getIndexData(projectName.project_id)
  },
  async checkAuth() {
    const token = await StorageCache.getToken()
    if (!token) wx.reLaunch({ url: '/pages/login/login' })
  },
  selectProject() {
    this.setData({
      showPopup: true,
    })
  },
  popupItemClick(e) {
    const project_id = +e.target.id
    const projectName = this.data.projects.find(p => p.project_id === project_id)
    // const companyName = this.data.companies.find(c => c.builing_id === builing_id)
    this.setData({
      projectName,
      showPopup: false,
      modelList: baseModelList
    })
    this.getIndexData(project_id)
  },
  async getProjectList() {
    return {
      data: [
        {
          project_id: 1,
          project_name: 'S107关中环线大中修工程项目',
        },
        {
          project_id: 11,
          project_name: '工程项目2'
        }
      ],
      info: {
        info1: '2021-12-15',
        info2: '2023-07-21',
        info3: '35天',
        info4: '489天',
      }
    }
  },
  async getCompany() {
    const res = await BaseDataApi.getCompany()
    console.log(res)
    return res.data
  },
  renderEcharts() {
    const content = this.data.modelList.jdgl.content
    eOpts = echartsOpts(content)
    this.setData({
      ec: {
        onInit: initChart
      }
    })
  },
  async getInfo(builing_id) {
    const infoList = {
      info1: [
        { key: '在册人数', value: '43人' },
        { key: '进场人员', value: '51人' },
        { key: '今日出勤', value: '35人' },
      ],
      info2: [
        { key: '未完成任务', value: 15 },
        { key: '已完成任务', value: 34 },
        { key: '逾期任务', value: 2 },
      ],
      info3: [
        { key: '累计检查', value: 56 },
        { key: '待复查', value: 2 },
        { key: '待整改', value: 5 },
        { key: '超期隐患', value: 1 },
      ]
    }
    const { modelList } = this.data
    modelList.rygl.content = infoList.info1
    modelList.jdgl.content = infoList.info2
    this.renderEcharts()
    modelList.zlgl.content = infoList.info3
    // const info = await CtrlApi.getInfo({ builing_id })
    // const { modelList } = this.data
    // modelList.jrkq.content = [
    //   { key: '今日出勤', value: info.today_num },
    //   { key: '考勤率', value: info.cql },
    //   // { key: '设备考勤', value: '' },
    //   // { key: '自报考勤', value: '23个' },
    // ]
    // modelList.gz.content = [
    //   { key: '记工金额', value: info.s_pay },
    //   { key: '记工人数', value: info.worker_num },
    //   { key: '待付金额', value: info.d_pay },
    // ]
    // this.setData({ modelList })
  },
  async getVideos(builing_id) {
    try {
      const videos = await CtrlApi.getVideos({ builing_id })
      const { modelList } = this.data
      modelList.sbgl.content = [
        { key: '设备总数', value: videos.total },
        { key: '在线设备', value: videos.on_line },
        { key: '离线设备', value: videos.off_line },
      ]
      this.setData({ modelList })
    } catch (err) {
      wx.showToast({
        icon: 'none',
        message: '获取视频信息失败',
      })
    }
  },
  async getWeather(builing_id) {
    try {
      const weather = await CtrlApi.getWeather({ builing_id })
      const { modelList } = this.data
      modelList.hjjc.content = [
        { key: 'PM2.5', value: weather.pm2 },
        { key: 'PM10', value: weather.pm10 },
        { key: '温度', value: weather.temperature },
        { key: '湿度', value: weather.humidity },
        { key: '风速', value: weather.windspeed },
        { key: 'TSP', value: weather.tsp },
        { key: '噪音', value: weather.noise },
        { key: '天气', value: weather.weather },
      ]
      this.setData({ modelList })
    } catch (err) {
      wx.showToast({
        icon: 'none',
        message: '获取环境监测信息失败',
      })
    }
  },
  async getIndexData(builing_id) {
    this.getInfo(builing_id)
    this.getVideos(builing_id)
    this.getWeather(builing_id)
  },
  async scrolling(e) {
    setPageScrollViewEvent(e, this)
  },
})
