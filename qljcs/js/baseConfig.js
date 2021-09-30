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
  })
  // .extend({
  //   LuHeaderTemplate: 'template/LuHeaderTemplate',
  //   LuBodyContentTemplate: 'template/LuBodyContentTemplate',
  //   LuCommonTemplate: 'template/LuCommonTemplate',
  //   LuUtilsTemplate: 'template/LuUtilsTemplate',
  //   LuTreeTable: 'treeTable/LuTreeTable',
  //   zTree: 'z-tree/jquery.ztree.all',
  //   echarts: 'echarts/echarts.min',
  //   Swiper: 'swiper/swiper.min',
  // })

const appConfig = {
  loadingTime: 0,
  bodyAnimation: true, // 滑入动画
  sideBarPath: '/qljcs/data/sideBarList.json'
}
