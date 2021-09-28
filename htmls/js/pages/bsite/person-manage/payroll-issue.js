layui.use(['LuCommonTemplate', 'LuLayer'], function () {
  const $ = layui.$

  const LuInnerHeader = layui.LuInnerHeader
  const LuTable = layui.LuTable
  const LuLightBox = layui.LuLightBox
  const LuUpload = layui.LuUpload

  class PageTemplate {
    content1Template(data) {
      const dict = {
        i1: '记工单名称',
        i2: '所属参见单位',
        i3: '支付状态',
        i4: '记工单截止月份',
        i5: '发放薪酬人数',
        i6: '发放金额合计',
        i7: '工资发放方式',
        i8: '生成日期',
      }
      let harr = []
      Object.keys(dict).forEach(key => {
        if (dict[key] === '支付状态')
          harr.push(
            `<div class='list-item'><div class='label'>${dict[key]}：</div><div class='desc ${data[key] ? 'green' : 'red'}'>${
              data[key] ? '已发放' : '未发放'
            }</div></div>`,
          )
        else harr.push(`<div class='list-item'><div class='label'>${dict[key]}：</div><div class='desc'>${data[key]}</div></div>`)
      })
      let html1 = ''
      let html2 = ''
      let html3 = ''
      for (let i = 0; i < harr.length; i++) {
        if (i % 3 === 0) html1 += `<div class='list-item'>${harr[i]}</div>`
        if (i % 3 === 1) html2 += `<div class='list-item'>${harr[i]}</div>`
        if (i % 3 === 2) {
          html3 += `<div class='list-item'>${harr[i]}</div>`
        }
      }
      return `
        <div class='content-head'>
          <span>班组信息</span>
        </div>
        <div class='content-box'>
          <div class='content-list'>${html1}</div>
          <div class='content-list'>${html2}</div>
          <div class='content-list'>${html3}</div>
        </div>
      `
    }

    content2Template() {
      return `
        <div class='content-head'>
          <span>人员工资明细</span>
        </div>
        <div class='content-table luTable'></div>
      `
    }

    content3Template(data) {
      if (!params) return
      let lightHtml = ''
      if (data) {
        for (let i = 0; i < data.picUrls.length; i++) {
          const pic = data.picUrls[i]
          lightHtml += `<div class='pic-preview-item' data-imageLx='${pic.src}' style="background-image:url('${pic.thumb}')"></div>`
        }
      }
      return params.type === 'create'
        ? `<div class='input-content'>
              <div class='upload-item'>
                <div class='label'>上传支付凭证：</div>
                <div class='desc'>
                  <div class='btn-box'>
                    <div class='content-body content-upload layui-form'>
                      <div class='upload-box'>
                        <div class='file-box' id='fileBox'></div>
                      </div>
                      <div class='upload-file-placeholder'></div>
                    </div>
                  </div>
                  <div data-lu-uploadFilePlaceholder='upload-input'></div>
                </div>
              </div>
              <div class='upload-item'>
                <div class='label'>备注：</div>
                <div class='desc'>
                  <textarea name='' placeholder='' class='layui-textarea' rows='2'></textarea>
                </div>
              </div>
              <div class='upload-item'>
                <div class='label'>发放日期：</div>
                <div class='desc'>
                  <input type='text'
                         name=''
                         disabled
                         autocomplete='off'
                         class='layui-input disabled'
                         value='${$lulib.dayjs(new Date()).format('YYYY-MM-DD')}'>
                </div>
              </div>
            </div>
            <div class='btn-box'>
              <div class='layui-btn create-btn'>提交</div>
            </div>`
        : `<div class='input-content'>
            <div class='upload-item'>
              <div class='label'>上传支付凭证：</div>
              <div class='desc'>
                <div class='light-box'>
                  <div class='pic-preview-list'>${lightHtml}</div>
                </div>
              </div>
            </div>
            <div class='upload-item'>
              <div class='label'>备注：</div>
              <div class='desc'>
                <span>${data.mark}</span>
              </div>
            </div>
            <div class='upload-item'>
              <div class='label'>发放日期：</div>
              <div class='desc'>
                <span>${data.date}</span>
              </div>
            </div>
          </div>`
    }
  }

  const pt = new PageTemplate()

  let luInnerHeader,
    params,
    luTable,
    luLightBox = new LuLightBox(),
    luUpload
  !(async () => {
    params = $lulib.getHashParams()
    initInnerHeader()
    await initContent()
  })()

  function initInnerHeader() {
    if (!params) return
    const title = params.type === 'create' ? '工资发放' : '工资发放详细'
    luInnerHeader = new LuInnerHeader({
      title,
      rightHtml: [{ txt: '返回', isWeaken: true }],
    })
  }

  async function initContent() {
    if (!params) return
    // mock
    const data = {
      i1: '电工8月份工资单',
      i2: '陕西三秦路桥有限公司',
      i3: params.type !== 'create',
      i4: '2020-10-05',
      i5: '35人',
      i6: '15,568,000元',
      i7: '按记工单发工资',
      i8: '2020-11-05',
    }
    const template1 = pt.content1Template(data)
    const template2 = pt.content2Template()
    const c3Data = {
      picUrls: [
        {
          url: '%2FA93AD881-DEFC-143C-4669-E2B47400DDA9%2FBNihBHs9tPF1YYRvG1.jpg',
          pid: 1,
          mimeType: 'image/jpeg',
          name: 'name1.jpg',
          alt: 'name1',
        },
        {
          url: '%2FA93AD881-DEFC-143C-4669-E2B47400DDA9%2FNfIEEbwIoW8FmA6qvA.jpg',
          pid: 2,
          mimeType: 'image/jpeg',
          name: 'name2.jpg',
          alt: 'name2',
        },
        {
          url: '%2FA93AD881-DEFC-143C-4669-E2B47400DDA9%2FcRHDt2Ab26WP6NkUa9.jpg',
          pid: 3,
          mimeType: 'image/jpeg',
          name: 'name3.jpg',
          alt: 'name3',
        },
        {
          url: '%2FA93AD881-DEFC-143C-4669-E2B47400DDA9%2FTpxEU94dvhOOJhXiba.jpg',
          pid: 4,
          mimeType: 'image/jpeg',
          name: 'name4.jpg',
          alt: 'name4',
        },
      ].map(pic => {
        const url = pic.url
        const baseUrl = 'http://puyer.jiaohuilian.com/api/v1/commons/thumbnail?path='
        pic.src = baseUrl + url + '&size=xl'
        pic.thumb = baseUrl + url + '&size=l'
        pic.downloadUrl = baseUrl + url
        return pic
      }),
      date: '2020-10-25',
      mark: '备注信息备注信息备注信息',
    }
    const template3 = pt.content3Template(c3Data)
    const $content = $('.content')
    $content.eq(0).html(template1)
    $content.eq(1).html(template2)
    $content.eq(2).html(template3)
    const tableData = await $lulib.getMockData('/htmls/mock/bsite/payrollTableIssueTableData.json', 8, '', false)
    const options = {
      cols: [
        $lulib.tableSetCenter([
          { field: 'id', title: '序号', width: 60 },
          { field: 'n1', title: '姓名', minWidth: 80 },
          { field: 'team', title: '班组名称', minWidth: 150 },
          { field: 'time', title: '记工时间段', minWidth: 200 },
          { field: 'day', title: '工日（工）', width: 100 },
          { field: 'money', title: '工价（元/工）', width: 120 },
          { field: 'reward', title: '嘉奖（元）', width: 100 },
          { field: 'deduction', title: '扣款（元）', width: 100 },
          { field: 'payCount', title: '发放金额（元）', width: 130 },
        ]),
      ],
    }
    luTable = new LuTable(tableData, options)

    const uploadOpts = {
      el: '#fileBox',
      elFile: '.upload-file-placeholder',
      label: '上传支付凭证',
      accept: '.pdf,.doc,.docx,.jpg,.png',
      max: 10,
      limit: 20,
      multiple: true,
      desc: '备注：可上传图片或者文件，格式为jpg，png，word，pdf等',
      success(files) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          // mock
          setTimeout(() => luUpload.clearFin(file), $lulib.randomInt(10, 3) * 750)
        }
      },
    }

    luUpload = new LuUpload(uploadOpts)
  }

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: $lulib.pageGoBack }])

  if (params) {
    $lulib.methodProxy.bindMethodProxy([
      { dom: 'body', domStr: '.pic-preview-item', method: previewPic },
      { dom: 'body', domStr: '.create-btn', method: submit },
    ])
  }

  function previewPic() {
    const $this = $(this)
    const { imagelx } = $this.data()
    const urlList = []
    $('[data-imageLx]').each((_, item) => urlList.push($(item).data('imagelx')))
    luLightBox.openLightBox(imagelx, urlList)
  }

  function submit() {
    console.log('submit')
  }
})
