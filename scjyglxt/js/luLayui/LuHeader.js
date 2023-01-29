layui.define([], function (exports) {
  const $ = layui.$
  const dropdown = layui.dropdown
  const loginUrl = '/scjyglxt/pages/login.html'

  class LuHeader {
    init (data) {
      this.renderHeader(data)
    }

    renderHeader ({ username, department }) {
      $(".lu-header-ql").html(headerTemplate({ username, department }))

      dropdown.render({
        elem: '#username',
        data: [{ title: "退出登录", id: 1, }],
        click: obj => dropdownHandler(obj)
      })
    }
  }

  function dropdownHandler (obj) {
    switch (obj.id) {
      case 1:
        $lulib.pageReplace(loginUrl)
    }
  }

  function headerTemplate ({ username, department }) {
    return `<div class="left">
            <img class="logo" src="/scjyglxt/images/public/logo.png" alt="">
          </div>
          <div class="middle">柏嘉集团生产经营管理系统</div>
          <div class="right">
            <div class="type-list" id="typeList">
              <span class="name">${department}</span>
            </div>
            <span id="username" class="username">${username}</span>
          </div>`
  }

  exports('LuHeader', LuHeader)
})
