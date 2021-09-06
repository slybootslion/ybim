layui.use(['LuCommonTemplate'], function() {
  const $ = layui.$

  const LuInnerHeader = layui.LuInnerHeader

  class PageTemplate {
    videoItemsTemplate (data) {
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

  const pt = new PageTemplate

  !(() => {
    renderInnerHeader()
    renderSlide()
  })()

  function renderSlide () {
    const ITEM_HEIGHT = 210
    const MAX_SLIDE_HEIGHT = 630
    const slide = $('.content .content-slide')

    /* mock */
    const data = [
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
        pic: 'https://img.diytrade.com/cdimg/1447740/23053621/0/1314173308.jpg',
        title: 'A标段康股沟大桥施工段视频6',
      },
      {
        pic: 'http://www.zzruida5888.com/UpLoad/pro/20190610/S201906101427215156.jpg',
        title: 'B标段康股沟大桥施工段视频7',
      },
      {
        pic: 'https://mp.ofweek.com/Upload/News/Img/member528/201906/wx_article_20190625115124_zv7TJO.jpg',
        title: 'A标段康股沟大桥施工段视频8',
      },
    ]

    const itemsTpl = pt.videoItemsTemplate(data)
    slide.html(itemsTpl)

    const videoItems = $('.content-item')
    videoItems.eq(0).addClass('active')
    const txt = videoItems.find('.title').html()
    $('.video-title').html(txt)

    const len = $('.content .content-slide .content-item').length
    const height = len * ITEM_HEIGHT
    slide.css({ height })
    let top = parseInt(slide.css('top'))
    top = isNaN(top) ? 0 : top
    $('.arrow.up').on('click', function() {
      if (!top) return
      top = top + ITEM_HEIGHT
      slide.css({ top })
    })

    $('.arrow.down').on('click', function() {
      if (height < MAX_SLIDE_HEIGHT || height + top <= MAX_SLIDE_HEIGHT) return
      top = top - ITEM_HEIGHT
      slide.css({ top })
    })
  }

  $lulib.methodProxy.bindMethodProxy([{ dom: 'body', domStr: '.sideVideoItem', method: videoClick }])

  function renderInnerHeader () {
    new LuInnerHeader({ title: '视频监控' })
  }

  function videoClick () {
    const current = $(this).parent('.content-item')
    current.addClass('active').siblings('.content-item').removeClass('active')
    const txt = current.find('.title').html()
    $('.video-title').html(txt)
  }

  $('#moreBtn').on('click', function() {
    $lulib.pagePushHash('bim/safety-manage/video-surveillance-more')
  })

})
