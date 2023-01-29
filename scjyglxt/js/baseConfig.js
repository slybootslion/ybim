window.rootPath = (function (src) {
  src = document.scripts[document.scripts.length - 1].src
  return src.substring(0, src.lastIndexOf('/') + 1)
})()

layui
  .config({
    base: rootPath + 'luLayui/',
    version: true,
    debug: true,
  })
  .extend({
    echarts: 'echarts/echarts.min',
  })

const appConfig = {
  loadingTime: 0,
  bodyAnimation: true, // 滑入动画
  sideBarPath: '/scjyglxt/data/sideBarList.json'
}
