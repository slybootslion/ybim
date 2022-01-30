import StorageCache from '../../../tools/storage-cache'

async function hookLogout(title = '修改完毕，需重新登录') {
  await StorageCache.clearStorage()
  wx.lin.showToast({
    title,
    icon: 'success'
  })
  setTimeout(() => {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  }, 1500)
}

export default hookLogout