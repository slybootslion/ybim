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
      return `<div class='block-title'>进度情况</div>`
    }
  }

  const pt = new PageTemplate()
  !(() => {
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

  function renderContent() {
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
    const data4 = {}
    const h4 = pt.block4Template(data4)
    $('.block-4').html(h4)
  }

  $lulib.methodProxy.bindMethodProxy([
    {
      dom: 'body',
      domStr: '.head-link',
      method: () => $lulib.pageReplace('/htmls'),
    },
  ])
})
