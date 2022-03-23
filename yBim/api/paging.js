import { typeOf } from '../tools/utils'

class Paging {
  constructor(requestMethod, resKey = 'data', page = 1, pageSize = 8) {
    this.page = page
    this.pageSize = pageSize
    this.resKey = resKey
    this.method = requestMethod
    this.data = []
    this.hadMore = false
  }

  async getMore(params) {
    if (params && typeOf(params) !== 'object') return false
    const data = {
      ...params,
      page_size: this.pageSize,
      page: this.page,
    }
    const res = await this.method(data)
    // console.log(res)
    const { total } = res
    if (total > 0) {
      if (res[this.resKey] && res[this.resKey].length) {
        this.data = this.data.concat(res[this.resKey])
      }
      let pageCount = Math.ceil(total / this.pageSize)
      this.hadMore = this.page < pageCount
      if (this.hadMore) this.page += 1
    }

    return {
      data: this.data,
      hadMore: this.hadMore,
      ...res,
    }
  }
}

export default Paging
