layui.use(['LuCommonTemplate'], function () {
  const $ = layui.$
  const form = layui.form

  const LuInnerHeader = layui.LuInnerHeader

  class PageTemplate {
    infoTemplate(data) {
      const dict = { i1: '用户名', i2: '姓名', i3: '所在公司', i4: '联系电话', i5: '角色' }

      let h = ''
      Object.keys(data).forEach(key => {
        const item = data[key]
        h += `<div class='top-item'>
                <span class='label'>${dict[key]}：</span>
                <span class='item-content'>${item}</span>
              </div>`
      })

      return `
        <div class='title-box'>
          <div class='title'>基本信息</div>
        </div>
        <div class='content'>
          ${h}
        </div>`
    }

    formTemplate () {
      const dict = {}

      return `
        <div class="title-box">
          <div class="title">密码修改</div>
        </div>
        <div class="content">
          <form class="layui-form">
            <div class="layui-form-item">
              <label class="layui-form-label">旧密码：</label>
              <div class="layui-input-block">
                <input type="password" name="pwd1" lay-verify="required" autocomplete="off" placeholder="请输入旧密码"
                       class="layui-input w355">
                <span class="desc-txt">请输入旧密码</span>
              </div>
            </div>
            <div class="layui-form-item">
              <label class="layui-form-label">新密码：</label>
              <div class="layui-input-block">
                <input type="password" name="pwd2" lay-verify="required|pwd2" autocomplete="off" placeholder="请输入新密码"
                       class="layui-input w355">
                <span class="desc-txt">请设置新密码，密码长度至少6个字符，最多20个字符，必须是数字、字母或组合</span>
              </div>
            </div>
            <div class="layui-form-item">
              <label class="layui-form-label">确认新密码：</label>
              <div class="layui-input-block">
                <input type="password" name="pwd3" lay-verify="required|pwd2" autocomplete="off" placeholder="请输入新密码"
                       class="layui-input w355">
                <span class="desc-txt">请再次输入新密码</span>
              </div>
            </div>
            <div class="layui-form-item btn-box">
              <button type="button" class="layui-btn" lay-submit="" lay-filter="submit">确定</button>
            </div>
          </form>
        </div>
      `
    }
  }

  const pt = new PageTemplate()
  let luInnerHeader
  ;(() => {
    initInnerHeader()
    renderInfo()
    renderForm()
  })()

  function initInnerHeader() {
    luInnerHeader = new LuInnerHeader({
      title: '个人信息',
    })
  }

  function renderInfo() {
    // mock
    const infoData = { i1: 'admin', i2: '贺波', i3: '柏嘉交通科技集团有限公司', i4: '18629612156', i5: '超级管理员' }
    const html = pt.infoTemplate(infoData)
    $('.page-container .info').html(html)
  }

  function renderForm() {
    const html = pt.formTemplate()
    $('.page-container .form').html(html)
  }

  form.verify({
    pwd2: [/^[0-9A-Za-z]{6,20}$/, '密码长度至少6个字符，最多20个字符，必须是数字、字母或组合'],
  })

  form.on('submit(submit)', function (data) {
    const { pwd2, pwd3 } = data.field
    if (pwd2 !== pwd3) $lulib.quickMessage('新密码与确认密码不相同')
  })
})
