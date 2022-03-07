import { promisic } from '../lu-ui/utils/util'

const setStorage = (key, data) => {
  return promisic(wx.setStorage)({ key, data })
}

//return (await promisic(wx.getStorage)({ key })).data
const getStorage = async key => {
  try {
    const res = await promisic(wx.getStorage)({ key })
    return res.data
  } catch (err) {
    return null
  }
}

const removeStorage = async key => promisic(wx.removeStorage)({ key })

const clearStorage = async () => promisic(wx.clearStorage)()

const setToken = async token => await setStorage('token', token)

const getToken = async () => getStorage('token')

const setUserInfo = async userInfo => await setStorage('userInfo', userInfo)

const getUserInfo = async () => getStorage('userInfo')

const setEquipmentInfo = async equipmentInfo => await setStorage('equipmentInfo', equipmentInfo)

const getEquipmentInfo = async () => getStorage('equipmentInfo')

const removeEquipmentInfo = async () => removeStorage('equipmentInfo')

const setVideoItemInfo = async videoItemInfo => await setStorage('videoItemInfo', videoItemInfo)

const getVideoItemInfo = async () => getStorage('videoItemInfo')

const removeVideoItemInfo = async () => removeStorage('videoItemInfo')

const setPersonDetail = async personDetail => await setStorage('personDetail', personDetail)

const getPersonDetail = async () => getStorage('personDetail')

const removePersonDetail = async () => removeStorage('personDetail')

const setMyInfo = async info => await setStorage('myInfo', info)

const getMyInfo = async () => getStorage('myInfo')

const removeMyInfo = async () => removeStorage('myInfo')

const setGroupDetail = async detail => await setStorage('groupDetail', detail)

const getGroupDetail = async () => getStorage('groupDetail')

const removeGroupDetail = async () => removeStorage('groupDetail')

const setEmpList = async list => await setStorage('empList', list)

const getEmpList = async () => getStorage('empList')

const removeEmpList = async () => removeStorage('empList')

const setIdCardDetail = async detail => await setStorage('idCardDetail', detail)

const getIdCardDetail = async () => getStorage('idCardDetail')

const removeIdCardDetail = async () => removeStorage('idCardDetail')

const StorageCache = {
  setStorage,
  getStorage,
  removeStorage,
  clearStorage,
  setToken,
  getToken,
  setUserInfo,
  getUserInfo,
  setEquipmentInfo,
  getEquipmentInfo,
  removeEquipmentInfo,
  setVideoItemInfo,
  getVideoItemInfo,
  removeVideoItemInfo,
  setPersonDetail,
  getPersonDetail,
  removePersonDetail,
  setMyInfo,
  getMyInfo,
  removeMyInfo,
  setGroupDetail,
  getGroupDetail,
  removeGroupDetail,
  setEmpList,
  getEmpList,
  removeEmpList,
  setIdCardDetail,
  getIdCardDetail,
  removeIdCardDetail,
}

export default StorageCache
