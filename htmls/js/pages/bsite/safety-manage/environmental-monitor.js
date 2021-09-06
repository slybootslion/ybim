layui.use(['LuCommonTemplate', 'LuLayer', 'echarts'], function () {
  const $ = layui.$
  const form = layui.form

  const echarts = layui.echarts
  const LuInnerHeader = layui.LuInnerHeader
  const LuLayer = layui.LuLayer

  class PageTemplate {
    topTemplate(data) {
      const {
        top1: { selectData, listData1, listData2 },
        top2,
      } = data

      const optHtml = this._selectTemplate(selectData, '设备名称', false)
      const listContent = this._blockListTemplate(listData1, listData2)
      const listStatus = this._statusListTemplate(top2)

      return `<div class='layui-col-md9'>
                <div class='block-item item-1'>
                   ${optHtml}
                   ${listContent}
                </div>
              </div>
              <div class='layui-col-md3'>
                <div class='block-item item-2'>
                  <div class='page-header block-header-1 no-border'><div class='left'><div class='title'>设备信息</div></div></div>
                  <div class='list-box'>
                    ${listStatus}
                  </div>
                 </div>
              </div>`
    }

    bottomTemplate(data) {
      const { list, infos, year, month } = data
      const yearHtml = this._selectTemplate(year)
      const monthHtml = this._selectTemplate(month)
      const html = this._formatBarometerDate(list, infos)

      return `<div class='layui-col-md7'>
                <div class='block-item item-1'>
                  <div class='page-header block-header-2 no-border'><div class='left'><div class='title'>晴雨表</div></div><div class='right'>${yearHtml} ${monthHtml}</div></div>
                  <div class='barometer-box'>${html}</div>
                </div>
              </div>
              <div class='layui-col-md5'>
                <div class='block-item item-2'>
                  <div class='page-header block-header-3 no-border'><div class='left'><div class='title'>24小时温度曲线</div></div></div>
                  <div class='echarts-box' id='echartsBox'></div>
                </div>
              </div>`
    }

    watcherForm(edit) {
      const infoV = edit ? edit.info : ''
      const remarkV = edit ? edit.remark : ''

      return `<form class='layui-form layer-form layer-form-flex-colm team-add-form' action=''>
                <div class='layui-inline'>
                  <label class='layui-form-label'>
                    <span>事件：</span>
                  </label>
                  <div class='layui-input-inline'><input type='text' name='l1' value='${infoV}' placeholder='请输入事件，20字以内' maxlength='20' autocomplete='off' class='layui-input'></div>
                </div>
                <div class='layui-inline'>
                  <label class='layui-form-label'>
                    <span>备注：</span>
                  </label>
                  <div class='layui-input-inline'>
                    <textarea name='' 
                              placeholder='请输入事件，140字以内' 
                              maxlength='140' 
                              class='layui-textarea' 
                              autocomplete='off'>${remarkV}</textarea>
                  </div>
                </div>
                <div class='layui-layer-btn btn-box'>
                  <button type='button' lay-submit lay-filter='submit' class='layui-btn layui-layer-btn0'>保存</button>
                </div>
            </form>`
    }

    _formatBarometerDate(list, infos) {
      const dateObj = new Date()
      // mock data，实际应为选择器中的date（year， month）
      const year = dateObj.getFullYear()
      const month = 6
      const date = new Date(year, month, 0)
      const days = date.getDate()
      for (let i = list.length; i < days; i++) list[i] = null
      let html = ''
      list.forEach((d, idx) => {
        const info = infos[idx] ? infos[idx] : null
        if (d) {
          const url = `/htmls/images/page/bsite/p${d}.png`
          // const infoStr = JSON.stringify(info)
          const infoStr = !info
            ? ''
            : `<div class='tag-content'><p>事件： <span class='info-t'>${info.e}</span></><p>备注： <span class='remark-t'>${info.remark}</span></p></div>`
          html += `<div class='bar-item'>
                    <div class='tag triggerWeatherForm'></div>
                    <span class='pic' style='background-image: url(${url})'></span>
                    <span class='t'>${(idx + 1).toString().padStart(2, '0')}</span>
                    ${infoStr}
                  </div>`
        } else {
          html += `
          <div class='bar-item'>
            <div class='tag'></div>
            <span class='pic' style="background-image: url('/htmls/images/page/bsite/p0.png')"></span>
            <span class='t'>${(idx + 1).toString().padStart(2, '0')}</span>
        </div>
        `
        }
      })
      return html
    }

    _blockListTemplate(d1, d2) {
      let h1 = '',
        h2 = ''

      for (let i = 0; i < d1.length; i++) {
        h1 += `<div class='left-item'>
                  <div class='left-item-title'>${d1[i].label}</div>
                  <div class='left-item-num'>${d1[i].value}</div>
                </div>`
      }
      for (let i = 0; i < d2.length; i++) {
        h2 += `<div class='right-item'>
                  <div class='left-icon ${d2[i].color}'>
                    <span class='iconfont ${d2[i].icon}'></span>
                  </div>
                  <div class='right-desc'>
                    <div class='r-top'>${d2[i].label}</div>
                    <div class='r-bottom'>${d2[i].value}</div>
                  </div>
                </div>`
      }

      return `<div class='item-1-content layui-row'>
                <div class='layui-col-md5 item-1-left'>${h1}</div>
                <div class='layui-col-md7 item-1-right'>${h2}</div>
              </div>`
    }

    _statusListTemplate(data) {
      let html = `<div class='list-header list-item'>
                    <div class='l-left'>设备名称</div>
                    <div class='l-right'>状态</div>
                  </div>`
      for (let i = 0; i < data.length; i++) {
        const item = data[i]
        html += `<div class='list-item'>
                    <div class='l-left txt-overflow'>${item.label}</div>
                    <div class='l-right ${item.status ? 'green' : 'red'}'>${item.status ? '在线' : '离线'}</div>
                 </div>`
      }
      return html
    }

    _selectTemplate(data, label = '', noOptionStr = true) {
      let optionStr = noOptionStr ? '' : "<option value=''>请选择</option>"
      const len = data.length
      let i = 0
      for (; i < len; i++) {
        const item = data[i]
        optionStr += `<option value='${item.value}'>${item.key}</option>`
      }
      if (label) label = `<label class='layui-form-label'>${label + '：'}</label>`
      return `<div class='select-box'><form class='layui-form' lay-filter='search-form'><div class='layui-inline'>${label}<div class='layui-input-inline inner-input-w155'><select>${optionStr}</select></div></div></form></div>`
    }
  }

  const pt = new PageTemplate()
  let luInnerHeader, echartsObj, luLayer
  !(() => {
    renderInnerHeader()
    initContent()
  })()

  function renderInnerHeader() {
    luInnerHeader = new LuInnerHeader({
      title: '环境监测',
    })
  }

  function initContent() {
    // mock data
    const top1 = {
      selectData: [
        { value: 'test1', key: '球形设备球形机' },
        { value: 'test2', key: '一体式环境检测器' },
        { value: 'test3', key: '组件式球机' },
      ],
      listData1: [
        { label: 'PM2.5合格天数', value: '30天' },
        { label: 'PM10合格天数', value: '26天' },
        { label: '主要风向', value: '东南风' },
        { label: '日间平均气温', value: '30' },
        { label: '夜间平均气温', value: '28' },
        { label: '平均湿度', value: '55' },
        { label: '平均音量', value: '71.8db' },
        { label: '平均TSP', value: '0.2' },
        { label: '平均气压', value: '0.4' },
      ],
      listData2: [
        { label: '温度', value: '31.05℃', icon: 'icon-wendu', color: 'c1' },
        { label: 'PM10', value: '31.05℃', icon: 'icon-PM', color: 'c7' },
        { label: '湿度', value: '91.60%RH', icon: 'icon-icontubiao', color: 'c2' },
        { label: 'TSP', value: '0ug/m3', icon: 'icon-TSP', color: 'c3' },
        { label: '风速', value: '0.00KM/H', icon: 'icon-fengsu', color: 'c4' },
        { label: 'PM2.5', value: '0.00KM/H', icon: 'icon-PM1', color: 'c8' },
        { label: '噪音', value: '57.20db', icon: 'icon-zaoyin', color: 'c5' },
        { label: '气压', value: '0KPA', icon: 'icon-qiya', color: 'c6' },
      ],
    }
    const top2 = [
      { label: '球形监控机TO1', status: false },
      { label: '一体式环境监测器', status: true },
      { label: '组件式球机', status: true },
      { label: '温度控制器', status: true },
      { label: '一体式环境监测器', status: true },
      { label: '组件式球机', status: false },
      { label: '温度控制器', status: true },
    ]

    const topHtml = pt.topTemplate({ top1, top2 })
    $('.content-block1').html(topHtml)

    // mock
    const bottom = {
      list: [1, 2, 3, 4, 3, 2, 1, 4, 1, 1, 1, 2, 3, 4, 2, 1, 2, 3, 4, 3, 2],
      infos: [
        null,
        null,
        { e: '无', remark: '今日天气晴中午时有雨，所有工人休息半天，今日天气晴中午时有雨，所有工人休息半天。' },
        { e: '无123', remark: '所有工人休息半天。' },
        null,
        { e: '无', remark: '备注信息' },
      ],
      year: [
        { value: '1', key: '2021' },
        { value: '2', key: '2020' },
        { value: '3', key: '2019' },
      ],
      month: [
        { value: 'm1', key: '6月' },
        { value: 'm2', key: '7月' },
        { value: 'm3', key: '8月' },
        { value: 'm4', key: '9月' },
      ],
    }

    // mock echarts data
    const opts = {
      legend: {
        data: ['24h温度曲线', 'PM2.5', 'PM10'],
        right: 10,
      },
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['2:00', '4:00', '6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '24h温度曲线',
          type: 'line',
          data: [-8, 0, 10, 23, 24, 12, 14, 5, 4, -2],
          symbol: 'none',
          smooth: true,
        },
        {
          name: 'PM2.5',
          type: 'line',
          data: [14, 5, 18, 3, 34, 22, 14, 15, 8, 3],
          symbol: 'none',
          smooth: true,
        },
        {
          name: 'PM10',
          type: 'line',
          data: [1, 10, 20, 2, 4, 22, 6, 25, 14, 10],
          symbol: 'none',
          smooth: true,
        },
      ],
    }

    const bottomHtml = pt.bottomTemplate(bottom)

    $('.content-block2').html(bottomHtml)
    // console.log(document.querySelector('#echartsBox'))
    echartsObj = echarts.init(document.querySelector('#echartsBox'), opts)
    echartsObj.setOption(opts)
    form.render()
  }

  $lulib.methodProxy.bindMethodProxy([{ dom: 'body', domStr: '.triggerWeatherForm', method: triggerWeatherForm }])

  function triggerWeatherForm() {
    const t = $(this).parent('.bar-item').find('.tag-content')
    let content
    if (t.length) {
      const remark = t.find('.remark-t').html()
      const info = t.find('.info-t').html()
      const editData = { remark, info }
      content = pt.watcherForm(editData)
    } else {
      content = pt.watcherForm()
    }
    const options = {
      title: '添加备注',
      id: 'addWeatherRemark',
      area: ['467px', '340px'],
      content,
    }
    luLayer = new LuLayer(options)
  }

  form.on('submit(submit)', data => {
    luLayer.close()
  })

  window.onresize = () => echartsObj.resize()
})
