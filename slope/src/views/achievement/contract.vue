<script setup lang="ts">
import dayjs from 'dayjs'
import ContractResearchTable from '@/views/achievement/components/contract-research-table.vue'
import api from '@/api'

const router = useRouter()
const addNew = () => router.push('/achievement-contract/contract-form')

const y1 = ref(0)
const y2 = ref(0)
const y1s = ref('')
const y2s = ref('')
watchEffect(() => {
  y1s.value = `${ y1.value }`
  y2s.value = `${ y2.value }`
})

interface staTypeCountI {
  all_count: number
  in_count: number
  out_count: number
}

const initYear = () => {
  const year = dayjs().year()
  y1.value = year
  y2.value = year
}
initYear()

const staTypeCount: staTypeCountI = reactive<staTypeCountI>({
  all_count: 0,
  in_count: 0,
  out_count: 0,
})
const statisticsTypeCount = async () => {
  const res = await api.get('/contract/statisticsTypeCount')
  staTypeCount.all_count = res.data.all_count
  staTypeCount.in_count = res.data.in_count
  staTypeCount.out_count = res.data.out_count
}
statisticsTypeCount()
const inNum = ref(0)
const outNum = ref(0)
const statisticsSumByYear = async (payment_type: string, year: number) => {
  const res = await api.get('/contract/statisticsSumByYear', { params: { payment_type, year } })
  if (payment_type === '收入') inNum.value = res.data.contract_money_sum
  if (payment_type === '支出') outNum.value = res.data.contract_money_sum
}
statisticsSumByYear('收入', y1.value)
statisticsSumByYear('支出', y2.value)
const changeYear = (type: string, num: number) => statisticsSumByYear(type, +num)
</script>

<template>
  <div>
    <page-main class="page-main">
      <div class="top">
        <div class="top-left">
          <div class="title">
            合同管理
          </div>
        </div>
        <div class="top-right">
          <el-button size="large" type="primary" @click="addNew">
            合同存档
          </el-button>
        </div>
      </div>
      <div class="middle">
        <div class="m1">
          <div class="m-item">
            <div class="label">
              合同总数：
            </div>
            <div class="number">
              {{ staTypeCount.all_count }}
            </div>
          </div>
          <div class="m-item">
            <div class="label">
              收入合同：
            </div>
            <div class="number">
              {{ staTypeCount.in_count }}
            </div>
          </div>
          <div class="m-item">
            <div class="label">
              支出合同：
            </div>
            <div class="number">
              {{ staTypeCount.out_count }}
            </div>
          </div>
        </div>
        <div class="m2">
          <el-date-picker
            v-model="y1s" type="year"
            value-format="YYYY"
            :clearable="false"
            @change="(a) => changeYear('收入', a)"
          />
          <div class="m-item">
            <div class="label">
              收入总合同额：
            </div>
            <div class="number">
              {{ inNum }}
            </div>
          </div>
        </div>
        <div class="m2">
          <el-date-picker
            v-model="y2s"
            type="year"
            value-format="YYYY"
            :clearable="false"
            @change="(a) => changeYear('支出', a)"
          />
          <div class="m-item">
            <div class="label">
              支出总合同额：
            </div>
            <div class="number">
              {{ outNum }}
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <ContractResearchTable />
      </div>
    </page-main>
  </div>
</template>

<style lang="scss" scoped>
.page-main {
  .top {
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .top-left {
      font-size: 18px;
    }
  }
  .middle {
    height: 60px;
    display: flex;
    align-items: center;
    margin: 20px 0;
    .m1, .m2 {
      flex: 1;
      display: flex;
    }
    .m2 {
      justify-content: center;
      .label {
        margin-left: 20px;
      }
    }
    .m2:nth-child(2) {
      border-left: 1px solid #c0c0c0;
      border-right: 1px solid #c0c0c0;
    }
    .m1 {
      justify-content: flex-start;
      .m-item {
        flex: 1;
      }
    }
    .m-item {
      display: flex;
      align-items: center;
      .number {
        font-size: 18px;
        font-weight: 700;
      }
    }
    :deep(.el-date-editor) {
      width: 90px !important;
    }
  }
}
</style>
