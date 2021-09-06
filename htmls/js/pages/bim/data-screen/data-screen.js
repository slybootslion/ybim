layui.use([], function () {
  const $ = layui.$
  const carousel = layui.carousel

  class PageTemplate {
    headerTemplate(data) {
      return `
        <div class='header-left'>
          <span class='left-container'>
            <span class='iconfont icon-huabankaobei-'></span><span class='header-date'></span>
          </span>
        </div>
        <div class='header-right'>
          <span class='right-container'>
            <a class='head-link' href='javascript:void(0)'>返回控制台</a><span>${data.username}</span>
          </span>
        </div>
      `
    }

    block1Template(data) {
      const dict = {
        i1: '开工时间',
        i2: '预计完工时间',
        i3: '总包单位',
        i4: '分包单位',
        i5: '业主单位',
        i6: '监理单位',
        i7: '设计单位',
        i8: '施工单位',
      }
      let h = ''
      for (const key in dict) {
        const value = data[key]
        const k = dict[key]
        h += `<div class='info-item'>
                <span class='key'>${k}：</span>
                <span class='value'>${value}</span>
              </div>`
      }

      return `<div class='block-title'>项目概况</div>
        <div class='project-title'>${data.projectTitle}</div>
        <div class='info-box'>${h}</div>
        <div class='bottom'>
          <div class='bottom-item long'>
            <div class='bi-icon'></div>
            <div class='bottom-item-info'>
              <span class='bii-title'>总投资</span>
              <span class='bii-info'>${data.i9}</span>
            </div>
          </div>
          <div class='bottom-item'>
            <div class='bottom-item-info'>
              <span class='bii-title'>总工期</span>
              <span class='bii-info'>${data.i10}天</span>
            </div>
          </div>
          <div class='bottom-item'>
            <div class='bottom-item-info'>
              <span class='bii-title'>已安全生产</span>
              <span class='bii-info'>${data.i11}天</span>
            </div>
          </div>
        </div>
      `
    }

    block2Template(data) {
      let h = ''
      for (let i = 0; i < data.length; i++) h += `<div class='carousel-image-box'><img src='${data[i]}' alt=''></div>`
      return `<div class='layui-carousel' id='carouselBlock'>
                <div carousel-item>
                  ${h}
                </div>
              </div>`
    }

    block3Template(data) {
      const picDist = {
        1: { t: '晴', icon: 'p1' },
        2: { t: '雪', icon: 'p2' },
        3: { t: '阴', icon: 'p3' },
        4: { t: '雨', icon: 'p4' },
      }
      const desDist = {
        c0: { t: '优', icon: 'you' },
        c1: { t: '良', icon: 'liang' },
        c2: { t: '轻度</br>污染', icon: 'qingdu' },
        c3: { t: '中度</br>污染', icon: 'wuran' },
        c4: { t: '重度</br>污染', icon: 'zhongdu' },
        c5: { t: '严重</br>污染', icon: 'yanzhong' },
      }
      let h = ''
      for (let i = 0; i < data.dataList.length; i++) {
        const item = data.dataList[i]
        h += `<div class='bottom-item'>
                <div class='left-icon c${item.id}'>
                  <span class='iconfont ${item.icon}'></span>
                </div>
                <div class='right-desc'>
                  <div class='r-top'>${item.key}</div>
                  <div class='r-bottom'>${item.value}</div>
                </div>
              </div>`
      }
      return `<div class='block-title'>环境监测</div>
        <div class='block3-top'>
          <div class='block3-top-left'>
            <div class='icon-b'><img src='/htmls/images/page/bim/${picDist[data.topData.w1].icon}.png' alt=''></div>
            <div class='top-left-txt'>
              <span>${data.topData.wTxt}</span>
              <span>${data.topData.w2}</span>
            </div>
          </div>
          <div class='block3-top-right'>
            <span class='top-right-block'>
              <div class='top-right-block-icon'><img src='/htmls/images/page/data-screen/${
                desDist[data.topData.w3].icon
              }.png' alt=''></div>
              <span class='top-right-block-txt'>
                ${desDist[data.topData.w3].t}
              </span>
            </span>
            <span class='top-right-pm'>
              <span class='pm-item'>PM2.5：<sapn class='num'>${data.topData.pm2}</sapn></span>
              <span class='pm-item'>PM10：<span class='num'>${data.topData.pm10}</span></span>
            </span>
          </div>
        </div>
        <div class='data-list'>${h}</div>
        <div class='warning'>
           <span>${data.warning.i1}</span>
           <span class='red'>${data.warning.i2}</span>
        </div>
      `
    }

    block4Template(data) {
      const percent = (data.schedule * 100).toFixed(2)
      return `<div class='block-title'>进度情况</div>
              <div class='percent-title'>
                <div>
                  <span class='title-item'>合同工期进度</span>
                  <span class='percent'>${percent}%</span>
                </div>
                <div class='line-box'>
                  <div class='line-inner' style='width: ${percent}%'></div>
                </div>
              </div>
              <div class='percent-bottom'>
                <div class='left'>
                  <div class='left-item'>
                    <span class='left-item-val'>${data.pending}</span>
                    <span class='left-item-key'>未完成任务</span>
                  </div>
                  <div class='left-item'>
                    <span class='left-item-val'>${data.res}</span>
                    <span class='left-item-key'>已完成任务</span>
                  </div>
                  <div class='left-item'>
                    <span class='left-item-val'>${data.rej}</span>
                    <span class='left-item-key'>逾期生产任务</span>
                  </div>
                </div>
                <div id='chr1'></div>
              </div>`
    }

    block6Template(data) {
      return `<div class='block-title'>设备情况</div>
              <div class='info-text'><span class='info-item'>在线设备：${data.value1}</span><span class='info-item'>离线设备：${data.value2}</span></div>
              <div id='chr2' style='height: 230px'></div>`
    }
  }

  const pt = new PageTemplate()
  let echartsObj1, echartsObj2, echartsObj3
  !(async () => {
    renderHeader()
    renderContent()
  })()

  const setTimer = () => {
    const weekDict = { 0: '日', 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六' }
    const week = weekDict[new Date().getDay()]
    $('.header-left .left-container .header-date').html($lulib.dayjs().format(`YYYY年MM月DD日 HH:mm:ss 星期${week}`))
  }
  setTimer()

  function renderHeader() {
    // mock
    const data = { username: 'ADMINZHANG' }
    const html = pt.headerTemplate(data)
    $('.screen-header').html(html)
  }

  setInterval(setTimer, 1000)

  async function renderContent() {
    // block1
    const data1 = {
      title: '项目概况',
      projectTitle: 'S107关中环线大中修工程',
      i1: '2020/02/12',
      i2: '2020/05/16',
      i3: '总包单位总包单位总包单位',
      i4: '',
      i5: '西安市交通运输局',
      i6: '',
      i7: '中交第一公路工程局',
      i8: '路桥集团有限公司',
      i9: '256,157,000',
      i10: '125',
      i11: '15',
    }
    const h1 = pt.block1Template(data1)
    $('.block-1').html(h1)
    // block2
    const data2 = [
      'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
      'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
      'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
      'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
      'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
    ]
    const h2 = pt.block2Template(data2)
    $('.block-2').html(h2)
    //建造实例
    carousel.render({
      elem: '#carouselBlock',
      width: '745',
      height: '304',
      arrow: 'none',
      anim: 'default',
      interval: 3000,
    })
    // block3
    const data3 = {
      topData: { w1: 4, wTxt: '中转小雨', w2: '15~21℃', w3: 'c4', pm2: '80', pm10: '60' },
      dataList: [
        { id: 1, key: '温度', value: '31.05℃', icon: 'icon-wendu' },
        { id: 2, key: '湿度', value: '50%', icon: 'icon-icontubiao' },
        { id: 3, key: '有毒气体', value: '30mg/M3', icon: 'icon-fangdumianju' },
        { id: 4, key: '风速', value: '7.2m/H', icon: 'icon-fengsu' },
        { id: 5, key: '噪音', value: '60dB', icon: 'icon-zaoyin' },
        { id: 6, key: '可燃气体', value: '10mg/M3', icon: 'icon-keranqiti' },
      ],
      warning: {
        i1: '设备 HSHS-0054',
        i2: '显示当前TSP数值过高 30mg/m³',
      },
    }
    const h3 = pt.block3Template(data3)
    $('.block-3').html(h3)
    // block4
    const data4 = { schedule: 0.2, pending: 25, res: 13, rej: 5 }
    const h4 = pt.block4Template(data4)
    $('.block-4').html(h4)
    // block5
    // block6
    const date6 = {value1: 20, value2: 3}
    const h6 = pt.block6Template(date6)
    $('.block-6').html(h6)
    // block7
    $('.block-7').html(`<div class='block-title'>质量情况</div><div id='chr3' style='height: 240px'></div>`)
    await renderECharts()
  }

  async function renderECharts() {
    // chart1
    const opts1 = {
      series: [
        {
          type: 'pie',
          radius: ['53%', '55%'],
          labelLine: {
            show: false,
          },
          data: [{ value: 100 }],
          label: {
            show: true,
            position: 'center',
            formatter: '进度差异分析',
            color: '#fff',
            fontSize: 14,
          },
          hoverAnimation: false,
        },
        {
          name: '进度管理',
          type: 'pie',
          radius: ['63%', '74%'],
          labelLine: {
            show: false,
          },
          label: {
            formatter: '{b}\n({c}%)',
          },
          data: [
            {
              value: 35,
              name: '正常完工',
              label: {
                color: '#1BE9C3',
              },
            },
            {
              value: 45,
              name: '提前完工',
              label: {
                color: '#52FF8F',
              },
            },
            {
              value: 25,
              name: '延期完工',
              label: {
                color: '#E9AC19',
              },
            },
          ],
          itemStyle: {
            borderRadius: 30,
            color(params) {
              return ['#1BE9C3', '#52FF8F', '#E9AC19'][params.dataIndex]
            },
          },
        },
      ],
    }
    echartsObj1 = echarts.init(document.querySelector('#chr1'), opts1)
    echartsObj1.setOption(opts1)
    // chart2
    const opts2 = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 70,
        bottom: 20,
        color: '#fff'
      },
      series: [
        {
          name: '设备管理',
          type: 'pie',
          radius: ['76%', '86%'],
          center: ['30%', '55%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'center',
            formatter: ['{a|设备总数}', '', '{b|35台}'].join('\n'),
            rich: {
              a: { fontSize: 16, color: '#007fff' },
              b: { fontSize: 24, color: '#007fff' },
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 12, name: '球形视频监控机' },
            { value: 10, name: '半球式视频监控' },
            { value: 6, name: '环境监测器t01' },
            { value: 8, name: '环境仪器t02' },
            { value: 3, name: '桥梁位移监测' },
            { value: 5, name: '桥梁加速度监测' },
          ],
          itemStyle: {
            color(params) {
              return ['#e9631b', '#47ceff', '#bcffae', '#E9AC19', '#52FF8F', '#b36cff', '#096ce3'][params.dataIndex]
            },
          },
        },
      ],
    }
    echartsObj2 = echarts.init(document.querySelector('#chr2'), opts2)
    echartsObj2.setOption(opts2)
    // chart3
    const opts3 = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: 0,
        right: 0,
        top: 20,
        height: 210,
        containLabel: true,
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#0beeec' },
        splitLine: {
          lineStyle: {
            color: 'rgba(255,255,255,0.15)',
          },
        },
      },
      xAxis: {
        type: 'category',
        axisLabel: { color: '#fff' },
        data: ['累计检查', '待复查', '待整改', '超期隐患', '运营期养护'],
      },
      series: [
        {
          type: 'bar',
          data: [584, 356, 378, 256, 395],
          itemStyle: {
            color(params) {
              return ['#1BE9C3', '#E9AC19', '#52FF8F', '#900013', '#096ce3'][params.dataIndex]
            },
          },
          barWidth: 15,
        },
      ],
    }
    echartsObj3 = echarts.init(document.querySelector('#chr3'), opts3)
    echartsObj3.setOption(opts3)
  }

  $lulib.methodProxy.bindMethodProxy([
    {
      dom: 'body',
      domStr: '.head-link',
      method: () => $lulib.pageReplace('/htmls'),
    },
  ])
})
