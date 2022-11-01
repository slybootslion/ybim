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
    console.log(tableData.length)
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

  async function echartsRender () {
    var data = [];
    var dataCount = 10;
    var startTime = +new Date();
    var categories = ['categoryA', 'categoryB', 'categoryC'];
    var types = [
      { name: 'JS Heap', color: '#7b9ce1' },
      { name: 'Documents', color: '#bd6d6c' },
      { name: 'Nodes', color: '#75d874' },
      { name: 'Listeners', color: '#e0bc78' },
      { name: 'GPU Memory', color: '#dc77dc' },
      { name: 'GPU', color: '#72b362' }
    ];
// Generate mock data
    categories.forEach(function (category, index) {
      var baseTime = startTime;
      for (var i = 0; i < dataCount; i++) {
        var typeItem = types[Math.round(Math.random() * (types.length - 1))];
        var duration = Math.round(Math.random() * 10000);
        data.push({
          name: typeItem.name,
          value: [index, baseTime, (baseTime += duration), duration],
          itemStyle: {
            normal: {
              color: typeItem.color
            }
          }
        });
        baseTime += Math.round(Math.random() * 2000);
      }
    });

    function renderItem (params, api) {
      var categoryIndex = api.value(0);
      var start = api.coord([api.value(1), categoryIndex]);
      var end = api.coord([api.value(2), categoryIndex]);
      var height = api.size([0, 1])[1] * 0.6;
      var rectShape = echarts.graphic.clipRectByRect(
        {
          x: start[0],
          y: start[1] - height / 2,
          width: end[0] - start[0],
          height: height
        },
        {
          x: params.coordSys.x,
          y: params.coordSys.y,
          width: params.coordSys.width,
          height: params.coordSys.height
        }
      );
      return (
        rectShape && {
          type: 'rect',
          transition: ['shape'],
          shape: rectShape,
          style: api.style()
        }
      );
    }

    const option = {
      tooltip: {
        formatter: function (params) {
          return params.marker + params.name + ': ' + params.value[3] + ' ms';
        }
      },
      xAxis: {
        min: startTime,
        scale: true,
        axisLabel: {
          formatter: function (val) {
            return Math.max(0, val - startTime) + ' ms';
          }
        }
      },
      yAxis: {
        data: categories
      },
      series: [
        {
          type: 'custom',
          renderItem: renderItem,
          itemStyle: {
            opacity: 0.8
          },
          encode: {
            x: [1, 2],
            y: 0
          },
          data: data
        }
      ]
    };

    echartsObj = echarts.init(document.querySelector('#echartsBox'), option)
    echartsObj.setOption(option)

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
