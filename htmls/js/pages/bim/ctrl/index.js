layui.use(['LuUtilsTemplate', 'echarts'], function () {
  const $ = layui.$
  const echarts = layui.echarts

  class PageTemplate {
    commTitle (title) {
      return `<h4 class='block-title'>${title}</h4>`
    }

    top1Template (data) {
      let h = ''
      for (let i = 0; i < data.length; i++) {
        const item = data[i]
        h += `<div class="top-1-item">
                <div class="label">${item.label}：</div>
                <div class="top-1-num">${item.num}人</div>
              </div>`
      }
      return h
    }

    top2Template (data) {
      let h = '------'

      return h
    }

    block1Template (data) {
      const title = this.commTitle('项目概况')
      const list = data.list
        .map(item => `<div class='block-1-item'><span>${item.key}</span>：<span>${item.value}</span></div>`)
        .join('')
      const remark = `<div class='block-1-remark'>${data.remark}</div>`
      return `${title}
      <div class='block-content block-1'>
         ${list}
         ${remark}
      </div>
      `
    }

    block2Template (data) {
      const title = this.commTitle('当前环境')
      const { topData, list } = data
      const picDist = {
        1: { t: '晴', icon: 'p1' },
        2: { t: '雪', icon: 'p2' },
        3: { t: '阴', icon: 'p3' },
        4: { t: '雨', icon: 'p4' },
      }
      const desDist = { c0: '优', c1: '良', c2: '轻度污染', c3: '中度污染', c4: '重度污染', c5: '严重污染' }
      let h = ''
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
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
      return `${title}
      <div class='block-content block-2'>
        <div class='top'>
          <div class='pic'>
            <img src='/htmls/images/page/bim/${picDist[topData.w1].icon}.png' alt='${picDist[topData.w1].t}'>
          </div>
          <div class='desc'>
            <div class='desc-top'>
              <div class='txt fl'>${picDist[topData.w1].t} ${topData.w2}</div>
              <div class='tag fl ${topData.w3}'>${desDist[topData.w3]}</div>
            </div>
            <div class='desc-bottom'>
              <div class='b-item'>PM2.5：<span>${topData.pm2}</span></div>
              <div class='b-item'>PM10：<span>${topData.pm10}</span></div>
            </div>
          </div>
        </div>
        <div class='bottom'>
          ${h}
        </div>
      </div>
      `
    }

    block3Template (data) {
      const title = this.commTitle('视频监控')
      const { list } = data

      let h = ''
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        h += `<div class='video-item'>
                <div class='img-box'>
                  <img src='${item.pic}' alt=''>
                  <div class='mask'><span class='iconfont icon-bofang3'></span></div>
                </div>
                <span class='video-item-text'>${item.title}</span>  
              </div>`
      }

      return `${title}
      <div class='block-content block-3'>
        ${h}
      </div>
      `
    }

    block4Template (data) {
      const title = this.commTitle('进度管理')
      // { schedule: 0.2, pending: 25, res: 13, rej: 5 }
      const percent = (data.schedule * 100).toFixed(2)
      return `${title}
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
        <div id='chr1' style='height: 280px'></div>
      </div>
      `
    }

    block5Template () {
      const title = this.commTitle('质量管理')
      return `${title}
      <div id='chr2' style='height: 350px'></div>
      `
    }

    block6Template (data) {
      const title = this.commTitle('设备管理')
      return `${title}
      <div class='chr-title'>
        <span class='title-item'>在线设备：${data.on}</span>
        <span class='title-item'>离线设备：${data.off}</span>
      </div>
      <div id='chr3' style='height: 300px'></div> 
      `
    }
  }

  const pt = new PageTemplate()
  let echartsObj1, echartsObj2, echartsObj3
  ;(() => {
    top1()
    top2()
    block1()
    block2()
    block3()
    setTimeout(() => {
      block4()
      block5()
      block6()
    })
  })()

  function top1 () {
    // mock
    const data = [
      { label: '在册人数：', num: 56 },
      { label: '进场人员：', num: 32 },
      { label: '今日出勤：', num: 65 },
    ]

    $('#top-1').html(pt.top1Template(data))
  }

  function top2() {
    // mock
    const data = {
      topData: { w1: 1, w2: '25℃', w3: 'c2', pm2: '56ug/m3', pm10: '75.00ug/m3' },
      list: [
        { id: 1, key: '温度', value: '31.05℃', icon: 'icon-wendu' },
        { id: 2, key: '湿度', value: '91.60%RH', icon: 'icon-icontubiao' },
        { id: 3, key: 'TSP', value: '0ug/m3', icon: 'icon-TSP' },
        { id: 4, key: '风速', value: '0.00KM/H', icon: 'icon-fengsu' },
        { id: 5, key: '噪音', value: '57.20db', icon: 'icon-zaoyin' },
        { id: 6, key: '气压', value: '0KPA', icon: 'icon-qiya' },
      ],
    }
    $("#top-2").html(pt.top2Template(data))
  }

  function block1 () {
    // mock
    const data = {
      list: [
        { key: '项目名称', value: 'S107关中环线大中修工程' },
        { key: '项目类别', value: '大中修工程' },
        { key: '项目负责人', value: '贺波' },
        { key: '开工时间', value: '2017-09-01' },
        { key: '预计完工时间', value: '2020-09-01' },
        { key: '业主单位', value: '中交第一公路工程局有限公司' },
        { key: '总包单位', value: '总包单位' },
        { key: '分包单位', value: '分包单位' },
        { key: '监理单位', value: '监理单位' },
        { key: '设计单位', value: '柏嘉交通科技集团有限公司' },
        { key: '施工单位', value: '施工单位' },
      ],
      remark:
        '环山旅游公路位于秦岭山麓，全长166.5公里。S107关中环线大中修工程设计段落为：K105+557~K125+958（太乙宫交叉口~西太路支线）段，设计里程20.401公里。本项目主要从路面改造、绿道建设、景观提升、水系修复、智慧交通五个方面着手，分布分项部门对环山公路进行全面提升。',
    }
    $('#r1-1').html(pt.block1Template(data))
  }

  function block2 () {
    // mock
    const data = {
      topData: { w1: 1, w2: '25℃', w3: 'c2', pm2: '56ug/m3', pm10: '75.00ug/m3' },
      list: [
        { id: 1, key: '温度', value: '31.05℃', icon: 'icon-wendu' },
        { id: 2, key: '湿度', value: '91.60%RH', icon: 'icon-icontubiao' },
        { id: 3, key: 'TSP', value: '0ug/m3', icon: 'icon-TSP' },
        { id: 4, key: '风速', value: '0.00KM/H', icon: 'icon-fengsu' },
        { id: 5, key: '噪音', value: '57.20db', icon: 'icon-zaoyin' },
        { id: 6, key: '气压', value: '0KPA', icon: 'icon-qiya' },
      ],
    }
    $('#r1-2').html(pt.block2Template(data))
  }

  function block3 () {
    // mock
    const data = {
      list: [
        { title: 'A区域门口视频监控', pic: 'http://www.maxfort.net.cn/uploadfile/2015/1229/20151229165250.jpg' },
        { title: 'A区域门口视频监控', pic: 'http://www.maxfort.net.cn/uploadfile/2015/1229/20151229165250.jpg' },
        { title: 'A区域门口视频监控', pic: 'http://www.maxfort.net.cn/uploadfile/2015/1229/20151229165250.jpg' },
        { title: 'A区域门口视频监控', pic: 'http://www.maxfort.net.cn/uploadfile/2015/1229/20151229165250.jpg' },
      ],
    }
    $('#r1-3').html(pt.block3Template(data))
  }

  function block4 () {
    // mock
    const data = { schedule: 0.2, pending: 25, res: 13, rej: 5 }
    $('#r2-1').html(pt.block4Template(data))
    const ele = document.querySelector('#chr1')
    // mock
    const opts = {
      series: [
        {
          name: '进度管理',
          type: 'pie',
          radius: ['54%', '70%'],
          avoidLabelOverlap: false,
          labelLine: {
            show: false,
          },
          data: [
            { value: 35, name: '正常完工' },
            { value: 45, name: '提前完工' },
            { value: 25, name: '延期完工' },
          ],
          itemStyle: {
            borderRadius: 100,
            borderColor: '#fff',
            borderWidth: 4,
            color (params) {
              return ['#1BE9C3', '#52FF8F', '#E9AC19'][params.dataIndex]
            },
          },
        },
      ],
    }
    echartsObj1 = echarts.init(ele, opts)
    echartsObj1.setOption(opts)
  }

  function block5 () {
    $('#r2-2').html(pt.block5Template())
    const el = document.querySelector('#chr2')
    // mock
    const echartsOptions = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: 10,
        right: 10,
        containLabel: true,
      },
      yAxis: {
        type: 'value',
      },
      xAxis: {
        type: 'category',
        data: ['累计检查', '待复查', '待整改', '超期隐患', '运营期养护'],
      },
      series: [
        {
          type: 'bar',
          data: [584, 356, 378, 256, 395],
          itemStyle: {
            color (params) {
              return ['#1BE9C3', '#E9AC19', '#52FF8F', '#900013', '#096ce3'][params.dataIndex]
            },
          },
          barWidth: 14,
        },
      ],
    }
    echartsObj2 = echarts.init(el, echartsOptions)
    echartsObj2.setOption(echartsOptions)
  }

  function block6 () {
    // mock
    const data = { on: 20, off: 3 }
    $('#r2-3').html(pt.block6Template(data))
    const el = document.querySelector('#chr3')
    const echartsOptions = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        right: 50,
        top: 100,
        bottom: 20,
      },
      series: [
        {
          name: '设备管理',
          type: 'pie',
          radius: ['56%', '76%'],
          center: ['40%', '50%'],
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
            color (params) {
              return ['#e9631b', '#47ceff', '#bcffae', '#E9AC19', '#52FF8F', '#b36cff', '#096ce3'][params.dataIndex]
            },
          },
        },
      ],
    }
    echartsObj3 = echarts.init(el, echartsOptions)
    echartsObj3.setOption(echartsOptions)
  }
})
