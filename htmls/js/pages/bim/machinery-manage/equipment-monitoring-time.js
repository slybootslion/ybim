layui.use(['LuCommonTemplate', 'laypage', 'echarts'], function () {
  const $ = layui.$
  const LuInnerHeader = layui.LuInnerHeader
  const element = layui.element
  const LuTable = layui.LuTable
  const echarts = layui.echarts
  const laypage = layui.laypage

  let luInnerHeader, luTable, echartsObj
  ;(async () => {
    innerHeaderRender()
    tableRender()
    echartsRender()
  })()

  function innerHeaderRender () {
    luInnerHeader = new LuInnerHeader({
      title: '设备监测',
      rightHtml: [{ txt: '返回', isWeaken: true }],
    })
  }

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: () => $lulib.pageGoBack() }])

  async function tableRender () {
    const tableData = await $lulib.getMockData('/htmls/mock/bim/equipmentMonitoringTimeTableData.json', 17, '', false)
    const tableOptions = {
      cols: [[
        { field: 't1', title: '日期' },
        { field: 't2', title: '运行时长' },
        { field: 't3', title: '怠速时长' },
        { field: 't4', title: '静止时长' },
      ]],
      ctrlData: [
        { eventStr: 'info', txtStr: '查看详情' },
      ],
      methods: { info },
      limit: 8,
    }
    luTable = new LuTable(tableData, tableOptions)
  }

  function info (data) {
    console.log(data)
  }

  // https://segmentfault.com/q/1010000041860085
  async function echartsRender () {
    let yData = []; // Y轴项目类目
    let dayTime = 3600 * 24 * 1000; // 一天的毫秒，因为01.01日-01.01日，也算一天
    let chartData = [
      {
        itemName: '2022-10-15', // 项目名
        value: [
          0, // 索引
          1, // 项目开始时间
          3, // 项目结束时间
          1,
        ]
      },
      {
        itemName: '2022-10-15', // 项目名
        value: [
          0, // 索引
          5, // 项目实际开始时间
          7.6, // 项目实际结束时间
          0,
        ]
      },
      {
        itemName: '2022-10-15', // 项目名
        value: [
          0, // 索引
          7.9, // 项目实际开始时间
          13.3, // 项目实际结束时间
          1,
        ]
      },
      {
        itemName: '2022-10-17',
        value: [
          1,
          14,
          21.8,
          1,
        ]
      },
      {
        itemName: '2022-10-18',
        value: [
          2,
          7.54,
          14.4,
          1,
        ]
      },
      {
        itemName: '2022-10-18',
        value: [
          2,
          4.1984,
          5.2022,
          0,
        ]
      },
      {
        itemName: '2022-10-19',
        value: [
          3,
          9.9,
          10.4,
          1,
        ]
      },
      {
        itemName: '2022-10-20',
        value: [
          4,
          0.4,
          1,
          1,
        ]
      },
      {
        itemName: '2022-10-21',
        value: [
          5,
          1,
          4,
          1,
        ]
      },
      {
        itemName: '2022-10-22',
        value: [
          6,
          2,
          3,
          1,
        ]
      },
      {
        itemName: '2022-10-22',
        value: [
          6,
          6,
          9,
          0,
        ]
      },
      {
        itemName: '2022-10-23',
        value: [
          7,
          5.5,
          11,
          1,
        ]
      },
    ]

    // const chartData = await $lulib.getMockData('/htmls/mock/bim/equipmentMonitoringTimeEchartsData.json', 1, '', false)

    const formatYData = () => {
      // const itemNameObj = {}
      // $lulib.unique(chartData.map(i => i.itemName)).forEach((item, idx) => itemNameObj[item] = idx)
      // console.log(itemNameObj)
      // chartData.forEach(item => item.value.unshift(itemNameObj[item.itemName]))
      yData = $lulib.unique(chartData.map(item => item.itemName))
      console.log(yData)
    }
    formatYData()

    const formatTooltip = params => {
      const values = params.map(p => p.value).reduce((per, cur) => {
        per[cur[3]] += Number((cur[2] - cur[1]).toFixed(2))
        return per
      }, { 1: 0, 0: 0 })

      const numToTime = num => {
        const timeArr = num.toString().split('.')
        let str = `${timeArr[0]}小时`
        return timeArr.length < 1 ? str :
          str + `${Math.floor(60 * (+timeArr[1] < 10 ? +timeArr[1] * 10 : +timeArr[1]) / 100)}分钟`
      }

      return `${params[0].name}:<br\>
                  累计运行：${numToTime(values[1])}<br\>
                  累计怠速运行：${numToTime(values[0])}`
    }

    setData()

    function setData () {
      const param = {
        title: {
          text: '项目执行情况',
          left: 'center'
        },
        tooltip: {
          // 自定义提示信息
          // params为当前点击图形元素的数据信息的对象
          formatter: formatTooltip,
          // (params) {
          // console.log(params[0])

          // return 'jhks'
          // // 计划开始时间
          // let planStartDate = params[0].value[1]
          // // 计划结束时间
          // let planEndDate = params[0].value[2]
          // // 实际开始时间
          // let practiceStartDate = params[0].value[3]
          // // 实际结束时间
          // let practiceEndDate = params[0].value[4]
          // // 项目周期(毫秒值)：计划结束日期 - 计划开始日期
          // // eslint-disable-next-line
          // let projectCycle_millisecond = +echarts.number.parseDate(params[0].value[2]) - +echarts.number.parseDate(params[0].value[1])
          // // 项目周期(天数)
          // let projectCycle_days = projectCycle_millisecond / dayTime + 1
          // return params[0].name + '<br/>'
          //   + '计划开始时间：' + planStartDate + '<br/>'
          //   + '计划结束时间：' + planEndDate + '<br/>'
          //   + '项目周期：' + projectCycle_days + '天<br/>'
          //   + '实际开始时间：' + practiceStartDate + '<br/>'
          //   + '实际结束时间：' + practiceEndDate
          // }
        },
        // 图表底板
        grid: {
          height: 460,
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          }
        },
        xAxis: {
          type: 'value',
          interval: 1,
          min: 0,
          max: 24,
          axisLabel: {
            interval: 0
          },
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        yAxis: {
          data: yData
        },
        legend: {
          selectedMode: false,
          left: '70%',
          top: 10,
          data: ['运行', '怠速']
        },
        series: [
          {
            type: 'custom',
            // 使用自定义的图形元素
            renderItem: renderItem,
            name: '运行',
            itemStyle: {
              opacity: 0.7,
              color: '#409EFF'
            },
            encode: {
              // 将维度1和维度2的数据映射到x轴
              x: [1, 2],
              // 将维度0的数据映射到y轴
              y: 0
            },
            data: chartData
          },
          // 没有给它设置data，只是为了通过这个系列，显示图例(legend)而已
          {
            type: 'custom',
            name: '怠速',
            itemStyle: {
              color: '#F56C6C'
            }
          }
        ]
      }
      init(param)
    }

// params为data中的数据项的信息对象 api是可调用的方法集合，可以对data中的数据项进行操作
    function renderItem (params, api) {
      // 取出data中数据项的第一个维度的值
      let categoryIndex = api.value(0)
      // ===============计划工期进度条
      // 计划开始日期(在屏幕上的像素值)
      // 将数据项中的数值对应的坐标系上的点，转换为屏幕上的像素值
      // 坐标系上的点：是数据项映射到坐标系的x轴和y轴后，对应的位置
      // 屏幕上的像素值：是坐标系上的点，在屏幕上的位置
      let planStartDate = api.coord([api.value(1), categoryIndex])
      // 计划结束日期(在屏幕上的像素值)
      let planEndDate = api.coord([api.value(2), categoryIndex])
      // 由于data.value中维度1和维度2的数据会被映射到x轴，而x轴的type为time，即时间轴，
      // 所以api.value(1)和api.value(2)获取到的值是将日期转换后的毫秒值
      // 设置图形的高度
      // 获得Y轴上数值范围为1的一段所对应的像素长度；这是官方文档的注释，对于api.size()方法，目前我还不是很理解；先做个标记??? 以后再说
      let height = api.size([0, 1])[1] * 0.5
      let width = planEndDate[0] - planStartDate[0]
      // 使用graphic图形元素组件，绘制矩形
      // clipRectByRect方法，在绘制矩形时，如果矩形大小超出了当前坐标系的包围盒，则裁剪这个矩形
      let rectShape1 = echarts.graphic.clipRectByRect({
          // 矩形的位置
          x: planStartDate[0],
          y: planStartDate[1] - height / 2,
          // 矩形的宽高
          width,
          height
        },
        {
          // 当前坐标系的包围盒
          x: params.coordSys.x,
          y: params.coordSys.y,
          width: params.coordSys.width,
          height: params.coordSys.height
        })
      return rectShape1 && {
        type: 'group',
        children: [
          {
            // 类型为矩形
            type: 'rect',
            // 具体形状
            shape: rectShape1,
            // 样式
            style: api.style({
              fill: api.value(3) === 1 ? '#409EFF' : '#F56C6C'
            })
          }
        ]
      }
    }

    function init (param) {
      echartsObj = echarts.init(document.querySelector('#echartsBox'), param)
      echartsObj.setOption(param)
    }

    laypage.render({
      elem: 'echartsPage',
      limit: 8,
      count: 51 //数据总数，从服务端得到
    });
  }


  // tabs change
  const showExportTableButton = idx => {
    const $btn = $(".table-out-btn")
    idx === 0 ? $btn.removeClass('hide') : $btn.addClass('hide')
  }
  element.on('tab(role)', data => {
    showExportTableButton(data.index)
  })
})
