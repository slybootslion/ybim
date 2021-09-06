layui.use(['LuCommonTemplate'], function() {
  const $ = layui.$
  const laypage = layui.laypage

  const LuInnerHeader = layui.LuInnerHeader

  class PageTempalte {
    videoItemTemplate (data) {
      let html = ''
      for (let i = 0; i < data.length; i++) {
        const item = data[i]
        html += `
          <div class='content-item' data-id='${item.id}'>
            <img src='${item.pic}' alt='' class='pic'>
            <h3 class='title txt-overflow' title=''>${item.title}</h3>
            <div class='play-icon centerXY'></div>
            <div class='cover sideVideoItem'></div>
          </div>
`
      }
      return html
    }
  }

  const pt = new PageTempalte

  !(() => {
    renderInnerHeader()
    renderContent()
  })()

  function renderInnerHeader () {
    new LuInnerHeader({ title: '视频监控' })
  }

  async function renderContent () {
    // mock
    const data = await $lulib.getMockData([
      {
        pic: 'https://mp.ofweek.com/Upload/News/Img/member528/201906/wx_article_20190625115124_zv7TJO.jpg',
        title: 'B标段康股沟大桥施工段视频1',
      },
      {
        pic: 'https://img.diytrade.com/cdimg/1447740/23053621/0/1314173308.jpg',
        title: 'A标段康股沟大桥施工段视频2',
      },
      {
        pic: 'http://www.zzruida5888.com/UpLoad/pro/20190610/S201906101427215156.jpg',
        title: 'B标段康股沟大桥施工段视频3',
      },
      {
        pic: 'https://mp.ofweek.com/Upload/News/Img/member528/201906/wx_article_20190625115124_zv7TJO.jpg',
        title: 'A标段康股沟大桥施工段视频4',
      },
      {
        pic: 'https://img.diytrade.com/cdimg/1447740/23053621/0/1314173308.jpg',
        title: 'B标段康股沟大桥施工段视频5',
      },
      {
        pic: 'http://www.zzruida5888.com/UpLoad/pro/20190610/S201906101427215156.jpg',
        title: 'B标段康股沟大桥施工段视频3',
      },
    ], 11)
    laypage.render({
      elem: 'page',
      count: data.length,
      limit: 15,
      jump (obj) {
        const currentData = data.concat().splice(obj.curr * obj.limit - obj.limit, obj.limit)
        const itemsTpl = pt.videoItemTemplate(currentData)
        $('.content').html(itemsTpl)
      },
      layout: ['page', 'count'],
    })
  }

  $lulib.methodProxy.bindMethodProxy([{ dom: 'body', domStr: '.sideVideoItem', method: videoClick }])

  function videoClick() {
    const id = $(this).parent('.content-item').data().id
    $lulib.pagePushHash(`bim/safety-manage/video-surveillance?id=${id}`)
  }
})
