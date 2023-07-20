<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { back } from '@/views/scientific_research/project-method'
import type { customerDataI } from '@/views/operate/customer-method'
import { getCustomer, loading } from '@/views/operate/customer-method'
import PermissionDeniedComp from '@/views/public-components/permission-denied-comp.vue'
import { checkAuth, checkIsOwn } from '@/utils/tools'

const route = useRoute()
const query = route.query
let editId = ''
interface detailDataI extends customerDataI {
  registration_time: string
  registrant_user: string
}
const detailData: detailDataI = reactive<detailDataI>({
  customer_name: '',
  customer_department: '',
  primary_business: '',
  address_province: '',
  address_city: '',
  address_detail: '',
  linkman: '',
  linkman_phone: '',
  linkman_post: '',
  customer_general: '',
  registration_time: '',
  registrant_user: '',
})
const getDetail = async (id: string) => {
  loading.value = true
  const res = await getCustomer(id)
  detailData.customer_name = res.customer_name
  detailData.customer_department = res.customer_department
  detailData.primary_business = res.primary_business
  detailData.address_province = res.address_province
  detailData.address_city = res.address_city
  detailData.address_detail = res.address_detail
  detailData.linkman = res.linkman
  detailData.linkman_phone = res.linkman_phone
  detailData.linkman_post = res.linkman_post
  detailData.customer_general = res.customer_general
  detailData.registrant_user = res.registrant_user
  detailData.registration_time = res.registration_time
  detailData.customer_general = res.customer_general
  loading.value = false
}
if (query.customer_id) {
  editId = query.customer_id as string
  getDetail(editId)
} else {
  ElMessage.error('customer id错误')
  back()
}
const router = useRouter()
const editItem = () => router.push(`/customer-management/customer-form?customer_id=${ editId }`)
</script>

<template>
  <page-main v-loading="loading" class="page-main">
    <Auth :value="['PM00102002']">
      <div class="top">
        <div>
          客户信息
        </div>
        <div>
          <el-button v-if="checkAuth('PM00102003')" type="primary" @click="editItem">
            编辑
          </el-button>
          <el-button @click="back">
            返回
          </el-button>
        </div>
      </div>
      <div class="block">
        <el-descriptions :column="2">
          <el-descriptions-item label="客户名称：">
            {{ detailData.customer_name }}
          </el-descriptions-item>
          <el-descriptions-item label="部门：">
            {{ detailData.customer_department }}
          </el-descriptions-item>
          <el-descriptions-item label="主营业务：">
            {{ detailData.primary_business }}
          </el-descriptions-item>
          <el-descriptions-item label="地址：">
            {{ detailData.address_province }}, {{ detailData.address_city }}, {{ detailData.address_detail }}
          </el-descriptions-item>
          <el-descriptions-item label="联系人：">
            {{ detailData.linkman }}
          </el-descriptions-item>
          <el-descriptions-item label="联系人电话：">
            {{ detailData.linkman_phone }}
          </el-descriptions-item>
          <el-descriptions-item label="联系人职务：">
            {{ detailData.linkman_post }}
          </el-descriptions-item>
          <el-descriptions-item label="登记人：">
            {{ detailData.registrant_user }}
          </el-descriptions-item>
          <el-descriptions-item label="登记时间：">
            {{ detailData.registration_time }}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="1">
          <el-descriptions-item label="客户概况：">
            {{ detailData.customer_general }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #no-auth>
        <PermissionDeniedComp />
      </template>
    </Auth>
  </page-main>
</template>

<style scoped lang="scss">
.page-main {
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .block {
    padding: 0 20px;
  }
}
</style>
