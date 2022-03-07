import { promisic, px2rpx } from '../lu-ui/utils/util'
import deviceUtil from '../lu-ui/utils/device-util'

const systemInfo = async () => await promisic(wx.getSystemInfo)()

export const setPageScrollViewEvent = (e, instance) => {
  const { scrollTop } = e.detail
  const { barColor } = instance.data
  const bc = scrollTop >= 28 ? 'white' : 'transparent'
  if (bc === barColor) return
  instance.setData({ barColor: bc })
}

export const setScrollHeight = async instacne => {
  const sysInfo = await systemInfo()
  const { safeArea, windowHeight, screenHeight, statusBarHeight } = sysInfo
  const tabBarHeight = screenHeight - windowHeight - statusBarHeight / 2
  instacne.setData({ contentHeight: safeArea.height - tabBarHeight })
}

export const navigationBarHeight = () => deviceUtil.getNavigationBarHeight()

export const setPageContainerScrollHeight = async (instance, discluding = 0) => {
  const sysInfo = await systemInfo()
  const capsuleBarHeight = navigationBarHeight()
  const { windowHeight, screenHeight } = sysInfo
  instance.setData({
    capsuleBarHeight,
    scrollHeight: px2rpx(screenHeight) - capsuleBarHeight - discluding,
  })
}

export default systemInfo
