<script lang="ts" setup>
import api from '@/api'
import { getList, pageData, resProjectListI, tableData } from '@/views/operate/project-method'

const tabActiveName = ref('待办事项')
const leftQuickLink = [
  { name: '项目备案立项', url: '/project-approval/approval' },
  { name: '客户登记', url: '/project-approval/approval' },
  { name: '投标评审', url: '/project-bidding/bidding' },
  { name: '投标结果登记', url: '/register-bid/bid' },
  { name: '合同评审', url: '/contract-rating/contract-review' },
  { name: '备案登记', url: '/record-management/record-form' },
  { name: '知识产权登记', url: '/achievement-knowledge/knowledge-form' },
  { name: '供应商登记', url: '/supplier-management/supplier-form' },
  { name: '跟踪信息录入', url: '/tracking-information/tracking' },
]
const approveTypeDict = {
  0: '立项审核', 1: '投标审核', 2: '合同审核', 3: '生产任务审核',
}
const router = useRouter()
const handleQuickLink = (url: string) => router.push(url)

interface todoListItemI {
  item_id: string
  create_time?: number
  approve_type: number
  approve_time?: number
}

const todos: Ref<todoListItemI[]> = ref<todoListItemI[]>([])
const finished: Ref<todoListItemI[]> = ref<todoListItemI[]>([])
const getMatter = async () => {
  const res: any = await api.get('/index/getMatter')
  todos.value = res.data.todos
  finished.value = res.data.finished
}

interface statisticsDataI {
  project: {
    all_count: number
    tail_count: number
    tender_count: number
    work_count: number
  }
  science: {
    all_count: number
    run_count: number
    finish_count: number
  }
  contract: {
    all_count: number
    in_count: number
    out_count: number
  }
  supplier: number
  customer: number
}

const statisticsData: statisticsDataI = reactive<statisticsDataI>({
  project: {
    all_count: 0,
    tail_count: 0,
    tender_count: 0,
    work_count: 0,
  },
  science: {
    all_count: 0,
    run_count: 0,
    finish_count: 0,
  },
  contract: {
    all_count: 0,
    in_count: 0,
    out_count: 0,
  },
  supplier: 0,
  customer: 0,
})
const getStatistics = async () => {
  const res: any = await api.get('/index/getStatistics')
  statisticsData.contract.all_count = res.data.contract.all_count
  statisticsData.contract.in_count = res.data.contract.in_count
  statisticsData.contract.out_count = res.data.contract.out_count
  statisticsData.science.all_count = res.data.science.all_count
  statisticsData.science.run_count = res.data.science.run_count
  statisticsData.science.finish_count = res.data.science.finish_count
  statisticsData.project.all_count = res.data.project.all_count
  statisticsData.project.tail_count = res.data.project.tail_count
  statisticsData.project.tender_count = res.data.project.tender_count
  statisticsData.project.work_count = res.data.project.work_count
  statisticsData.supplier = res.data.supplier
  statisticsData.customer = res.data.customer
}

const clickToDetail = (id: string, type: number) => {
  if (type === 3) {
    router.push(`/production-management/task-detail?task_id=${id}`)
  } else {
    router.push(`/project-initiation/project-detail?project_id=${id}&type=${type}`)
  }
}

setTimeout(() => {
  getStatistics()
  getMatter()
  getList(pageData)
}, 30)
</script>

<template>
  <page-main class="page-main">
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="left-box">
          <el-tabs v-model="tabActiveName" class="tabs">
            <el-tab-pane label="待办事项" name="待办事项">
              <div v-for="item in todos" :key="item.item_id" class="tab-list-item">
                <span @click="clickToDetail(item.item_id, item.approve_type)">
                  您有新的<span style="color: #409EFF">{{
                    approveTypeDict[(item as todoListItemI).approve_type]
                  }}</span>信息需要审核!
                </span>
                <span>{{ (item as todoListItemI).create_time }}</span>
              </div>
            </el-tab-pane>
            <el-tab-pane label="已办事项" name="已办事项">
              <div v-for="item in finished" :key="item.item_id" class="tab-list-item">
                <span @click="clickToDetail(item.item_id, item.approve_type)">
                  <span style="color: #409EFF">{{ approveTypeDict[(item as todoListItemI).approve_type] }}</span>已审核!
                </span>
                <span>{{ (item as todoListItemI).approve_time }}</span>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="left-box">
          <div class="box-title">
            业务办理入口
          </div>
          <div class="btn-box">
            <el-button v-for="(q, idx) in leftQuickLink" :key="idx" class="left-btn" @click="handleQuickLink(q.url)">
              {{ q.name }}
            </el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="right-box">
          <el-row :gutter="10">
            <el-col :span="6">
              <div class="r-block h60">
                项目总数：<span class="num">{{ statisticsData.project.all_count }}</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="r-block h60">
                在跟踪：<span class="num">{{ statisticsData.project.tail_count }}</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="r-block h60">
                中标数：<span class="num">{{ statisticsData.project.tender_count }}</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="r-block h60">
                在生产数：<span class="num">{{ statisticsData.project.work_count }}</span>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="right-box">
          <el-row :gutter="10">
            <el-col :span="8">
              <div class="r-block h60">
                科研项目总数：<span class="num">{{ statisticsData.science.all_count }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="r-block h60">
                执行中：<span class="num">{{ statisticsData.science.run_count }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="r-block h60">
                已完成：<span class="num">{{ statisticsData.science.finish_count }}</span>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="right-box">
          <div class="r-list">
            <div class="box-title">
              项目信息
            </div>
            <div class="r-list-content">
              <div v-for="item in tableData" :key="item.project_id" class="list-item">
                <span>{{ (item as resProjectListI).project_name }}</span>
                <span>{{
                  (item as resProjectListI).project_dependency_province
                }} {{ (item as resProjectListI).project_dependency_city }}</span>
                <span>{{ (item as resProjectListI).expect_amount }}万元</span>
                <span>{{ (item as resProjectListI).registration_time }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="right-box">
          <el-row :gutter="10">
            <el-col :span="12">
              <div class="r-block h60">
                <span class="r-block-item">合同总数：<span class="num">{{
                  statisticsData.contract.all_count
                }}</span></span>
                <span class="r-block-item">合同总数：<span class="num">{{
                  statisticsData.contract.in_count
                }}</span></span>
                <span class="r-block-item">支出合同：<span class="num">{{
                  statisticsData.contract.out_count
                }}</span></span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="r-block h60">
                供应商：<span class="num">{{ statisticsData!.supplier }}</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="r-block h60">
                客户数：<span class="num">{{ statisticsData!.customer }}</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </page-main>
</template>

<style lang="scss" scoped>
.page-main {
  background-color: var(--g-main-bg);
  padding: 0;

  .left-box {
    background-color: #fff;
    margin-bottom: 10px;
    padding: 10px;
    height: 380px;

    .tab-list-item {
      height: 30px;
      line-height: 30px;
      display: flex;
      justify-content: space-between;
    }

    :deep(.el-tabs__content) {
      height: 280px;
      overflow-y: scroll;
    }

    .box-title {
      margin-bottom: 10px;
    }

    .btn-box {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      height: 200px;

      .left-btn {
        height: 50px;
        width: 30%;
        text-align: center;
        margin: 0;
      }
    }
  }

  .right-box {
    margin-bottom: 10px;

    .r-block {
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;

      .num {
        font-size: 24px;
        font-weight: 700;
      }

      .r-block-item {
        padding: 0 15px;
      }

      .r-block-item:nth-child(2) {
        border-right: 1px solid #ccc;
        border-left: 1px solid #ccc;
      }
    }

    .r-list {
      padding: 10px;
      background-color: #fff;

      .r-list-content {
        margin-top: 10px;
        height: 450px;
        overflow-y: scroll;

        .list-item {
          display: flex;
          height: 30px;
          line-height: 30px;

          span:nth-child(1) {
            flex: 2.5;
          }

          span:nth-child(2),
          span:nth-child(3),
          span:nth-child(4) {
            flex: 1;
          }
        }
      }
    }

    .h60 {
      height: 80px;
    }
  }
}
</style>
