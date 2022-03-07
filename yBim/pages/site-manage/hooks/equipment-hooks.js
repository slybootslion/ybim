import StorageCache from '../../../tools/storage-cache'
import EnvironApi from "../../../api/site/environ-model";

export async function toFormPage(detail, company_list, url) {
  const data = { company_list, detail }
  url = url ? url : '/pages/site-manage/equipment-form/equipment-form'
  await StorageCache.setEquipmentInfo(data)
  wx.navigateTo({
    url,
  })
}

export async function toVideoFormPage(detail, company_list, url) {
  await toFormPage(detail, company_list, url)
}
