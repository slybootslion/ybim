layui.use(['LuCommonTemplate', 'LuLayer', 'LuStep'], function () {
  const $ = layui.$
  const form = layui.form
  const laydate = layui.laydate

  const LuInnerHeader = layui.LuInnerHeader
  const LuStep = layui.LuStep
  let luInnerHeader,
    currentStep = 1,
    luStep
  ;(() => {
    getParams()
    renderInnerHeader()
    luStep = currentStep === 4 ? new LuStep({ index: currentStep }) : new LuStep()
    initLaydate()
  })()

  function getParams() {
    const params = $lulib.getHashParams()
    if (params) {
      let { idNum, type } = params
      type = +type
      if (type === 4) {
        currentStep = 4
        setStepTop()
      }
    }
  }

  function initLaydate() {
    laydate.render({
      elem: '#briDate',
      theme: '#007fff',
    })
  }

  function setStepTop() {
    $('.page-container').attr({ class: `page-container size-${currentStep}` })
    if (currentStep === 4) {
      $('.step-top').hide()
      return
    }
    $('.step-top-item').removeClass('active')
    $(`.step-top-item.s${currentStep}`).addClass('active')
  }

  function renderInnerHeader() {
    luInnerHeader = new LuInnerHeader({
      title: '人员注册',
      rightHtml: [{ txt: '返回', isWeaken: true }],
    })
  }

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: $lulib.pageGoBack }])
  // form data here
  const nextFnObj = {
    stepFn1(data) {
      return true
    },
    stepFn2(data) {
      return true
    },
    stepFn3() {
      LuUtils.pagePushHash(backUrl)
      return false
    },
  }
  form.render()
  form.on('submit(stepNextBtn)', function (data) {
    if (nextFnObj[`stepFn${currentStep}`](data.field)) {
      currentStep = luStep.next()
      setStepTop()
    }
  })

  $(".btn-prev").on('click', function () {
    currentStep = luStep.prev()
    setStepTop()
  });

})
