layui.use([], function () {
  const $ = layui.$

  class PageTemplate {
    swiperTemplate(data) {
      let h = ''
      for (let i = 0; i < data.length; i++) {
        h += `<div class='swiper-slide'>
                <div class='pic centerXY' style="background-image:url('${data[i]}')"></div>
              </div>`
      }
      return `<div class='swiper-container'>
                <div class='swiper-wrapper'>${h}</div>
                <div class='close'>X</div>
              </div>`
    }
  }

  const pt = new PageTemplate()

  let mySwiper
  !(() => {
    initData()
    $lulib.rootEleFontSize()
  })()

  function initData() {
    // mock data
    const images = [
      '/htmls/images/page/bsite/temp-pic1.png',
      'https://farm3.staticflickr.com/2862/33107020324_fc53203958_k.jpg',
      '/htmls/images/page/bsite/temp-pic2.png',
      '/htmls/images/page/bsite/temp-pic1.png',
      '/htmls/images/page/bsite/temp-pic2.png',
    ]

    const h = pt.swiperTemplate(images)
    $('.swiper-box').html(h)

    mySwiper = new Swiper('.swiper-container', {
      direction: 'horizontal', // 垂直切换选项
      loop: true, // 循环模式选项
    })
  }

  $lulib.methodProxy.bindMethodProxy([{ dom: 'body', domStr: '.close', method: close }])

  window.addEventListener('resize', $lulib.rootEleFontSize, false)

  function close() {
    $('.swiper-box').css({ visibility: 'hidden' })
  }

  $('.btn-box .btn').on('click', function () {
    const index = $(this).index()
    if ($(this).hasClass('active')) return false
    $(this).addClass('active').siblings('.btn').removeClass('active')
    $('.content-item').eq(index).addClass('active').siblings('.content-item').removeClass('active')
  })

  $('.desc.pic-box .pic').on('click', function () {
    mySwiper.slideTo($(this).index() + 1)
    setTimeout(() => $('.swiper-box').css({ visibility: 'visible' }))
  })
})
