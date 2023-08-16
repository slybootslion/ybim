<script lang="ts" setup>
import i1_1 from '../assets/images/01项目备案立项-down.png'
import i1_2 from '../assets/images/01项目备案立项-on.png'
import api from '@/api'
import { getList, pageData, resProjectListI, tableData } from '@/views/operate/project-method'
import PermissionDeniedComp from '@/views/public-components/permission-denied-comp.vue'
import { checkAuth } from '@/utils/tools'

const tabActiveName = ref('待办事项')
const leftQuickLink = [
  { name: '项目备案立项', url: '/project-approval/approval', img1: i1_1, img2: i1_2, show: false },
  {
    name: '客户登记',
    url: '/project-approval/approval',
    img1: '../assets/images/01项目备案立项-down.png',
    img2: '../assets/images/01项目备案立项-on.png',
    show: false,
  },
  /*  {
    name: '投标评审',
    url: '/project-bidding/bidding',
    img1: '../assets/images/01项目备案立项-down.png',
    img2: '../assets/images/01项目备案立项-on.png',
    show: false,
  }, */
  {
    name: '投标结果登记',
    url: '/register-bid/bid',
    img1: '../assets/images/01项目备案立项-down.png',
    img2: '../assets/images/01项目备案立项-on.png',
    show: false,
  },
  /*  {
    name: '合同评审',
    url: '/contract-rating/contract-review',
    img1: '../assets/images/01项目备案立项-down.png',
    img2: '../assets/images/01项目备案立项-on.png',
    show: false,
  }, */
  {
    name: '备案登记',
    url: '/record-management/record-form',
    img1: '../assets/images/01项目备案立项-down.png',
    img2: '../assets/images/01项目备案立项-on.png',
    show: false,
  },
  {
    name: '知识产权登记',
    url: '/achievement-knowledge/knowledge-form',
    img1: '../assets/images/01项目备案立项-down.png',
    img2: '../assets/images/01项目备案立项-on.png',
    show: false,
  },
  {
    name: '供应商登记',
    url: '/supplier-management/supplier-form',
    img1: '../assets/images/01项目备案立项-down.png',
    img2: '../assets/images/01项目备案立项-on.png',
    show: false,
  },
  {
    name: '跟踪信息录入',
    url: '/tracking-information/tracking',
    img1: '../assets/images/01项目备案立项-down.png',
    img2: '../assets/images/01项目备案立项-on.png',
    show: false,
  },
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
  item_name?: string
}

const todos: Ref<todoListItemI[]> = ref<todoListItemI[]>([])
const finished: Ref<todoListItemI[]> = ref<todoListItemI[]>([])
const getMatter = async () => {
  if (!checkAuth('PM00000001')) return
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
  if (!checkAuth('PM00000001')) return
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
    router.push(`/production-management/task-detail?task_id=${ id }`)
  } else {
    router.push(`/project-initiation/project-detail?project_id=${ id }&type=${ type }`)
  }
}

setTimeout(() => {
  getStatistics()
  getMatter()
  getList(pageData)
}, 30)

const inNum = ref(0)
const outNum = ref(0)
const statisticsSumByYear = async (payment_type: string) => {
  if (!checkAuth('PM00301001')) return
  const res = await api.get('/contract/statisticsSumByYear', { params: { payment_type } })
  if (payment_type === '收入') inNum.value = res.data.contract_money_sum
  if (payment_type === '支出') outNum.value = res.data.contract_money_sum
}
statisticsSumByYear('收入')
statisticsSumByYear('支出')

const projectClick = (project_id: string) => router.push(`/project-initiation/project-detail?project_id=${ project_id }`)
</script>

<template>
  <page-main class="page-main">
    <Auth :value="['PM00000001']">
      <el-row :gutter="8">
        <div class="row1">
          <div class="index-item-title">
            项目统计
          </div>
          <div class="row1-content">
            <div class="row1-item">
              <div class="box">
                <img src="../assets/images/立项数量统计.png" alt="" class="row1-item-img">
                <div class="txt-box">
                  <div class="txt-box-title">
                    立项数量
                  </div>
                  <div class="num">
                    {{ statisticsData.project.all_count }}
                  </div>
                </div>
              </div>
            </div>
            <div class="row1-item">
              <div class="box">
                <img src="../assets/images/跟踪数量统计.png" alt="" class="row1-item-img">
                <div class="txt-box">
                  <div class="txt-box-title">
                    跟踪数量
                  </div>
                  <div class="num">
                    {{ statisticsData.project.tail_count }}
                  </div>
                </div>
              </div>
            </div>
            <div class="row1-item">
              <div class="box">
                <img src="../assets/images/生产项目统计.png" alt="" class="row1-item-img">
                <div class="txt-box">
                  <div class="txt-box-title">
                    生产项目
                  </div>
                  <div class="num">
                    {{ statisticsData.project.work_count }}
                  </div>
                </div>
              </div>
            </div>
            <div class="row1-item">
              <div class="box">
                <img src="../assets/images/科研项目统计.png" alt="" class="row1-item-img">
                <div class="txt-box">
                  <div class="txt-box-title">
                    科研项目
                  </div>
                  <div class="num">
                    {{ statisticsData.science.all_count }}
                  </div>
                </div>
              </div>
            </div>
            <div class="row1-item">
              <div class="box">
                <img src="../assets/images/ywj.png" alt="" class="row1-item-img">
                <div class="txt-box">
                  <div class="txt-box-title">
                    已完结项目
                  </div>
                  <div class="num">
                    {{ statisticsData.science.finish_count }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-row>
      <el-row :gutter="8">
        <el-col :span="8">
          <div class="row2">
            <div class="index-item-title">
              待办事项
            </div>
            <div class="row2-content">
              <div v-for="item in todos" :key="item.item_id" class="tab-list-item">
                <div style="cursor:pointer;" @click="clickToDetail(item.item_id, item.approve_type)">
                  <div>
                    项目名称：<span style="font-weight: bold">{{ (item as todoListItemI).item_name }}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; width: 100%;">
                    <span><span style="color: #409EFF">{{
                      approveTypeDict[(item as todoListItemI).approve_type]
                    }}</span><span>信息需要处理!</span></span>
                    <span style="margin-left: 30px;"> {{ (item as todoListItemI).create_time }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="row2">
            <div class="index-item-title">
              业务办理
            </div>
            <div class="row2-content">
              <div class="btn-box">
                <div
                  v-for="(q, idx) in leftQuickLink" :key="idx" class="row2-btn-item"
                  @click="handleQuickLink(q.url)"
                >
                  <div class="row2-icon" />
                  <div>{{ q.name }}</div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="row2">
            <div class="index-item-title">
              合同统计
            </div>
            <div class="row2-content">
              <div class="row2-3-top">
                合同总数： <span class="num">{{ statisticsData.contract.all_count }}</span>
              </div>
              <div class="row2-3-bottom">
                <Auth :value="['PM00301001']">
                  <div class="row2-3-bottom-item">
                    <img src="../assets/images/收入.png" alt="">
                    <div class="bottom-item-t">
                      <div class="txt">
                        收入合同额（万元）：
                      </div>
                      <div class="num in">
                        {{ inNum }}
                      </div>
                    </div>
                  </div>
                  <div class="row2-3-bottom-item">
                    <img src="../assets/images/支出.png" alt="">
                    <div class="bottom-item-t">
                      <div class="txt">
                        支出合同额（万元）：
                      </div>
                      <div class="num out">
                        {{ outNum }}
                      </div>
                    </div>
                  </div>
                  <template #no-auth>
                    <PermissionDeniedComp />
                  </template>
                </Auth>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <div class="row1">
          <div class="index-item-title">
            项目信息
          </div>
          <div class="r-list-content">
            <div v-for="item in tableData" :key="item.project_id" class="list-item">
              <span class="project-hover" @click="projectClick(item.project_id)">{{
                (item as resProjectListI).project_name
              }}</span>
              <span>{{
                (item as resProjectListI).project_dependency_province
              }} {{ (item as resProjectListI).project_dependency_city }}</span>
              <span>{{ (item as resProjectListI).expect_amount }}万元</span>
              <span>{{ (item as resProjectListI).registration_time }}</span>
            </div>
          </div>
        </div>
      </el-row>
      <template #no-auth>
        <PermissionDeniedComp />
      </template>
    </Auth>
  </page-main>
</template>

<style lang="scss" scoped>
.page-main {
  background-color: var(--g-main-bg);
  padding: 0;
  font-size: 14px;

  .index-item-title {
    font-size: 16px;
    box-sizing: border-box;
    padding: 5px 10px;
  }

  .row1 {
    width: 100%;
    background-color: #fff;
    margin-bottom: 8px;

    .row1-content {
      display: flex;

      .row1-item {
        flex: 1;
        height: 100px;
        box-sizing: border-box;
        padding: 10px 30px;

        .box {
          width: 100%;
          height: 100%;
          border-radius: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #1b3d6a;

          .txt-box {
            margin-left: 10px;

            .num {
              font-weight: 700;
              font-size: 20px;
            }
          }
        }

        &:nth-child(1) {
          .box {
            background-color: #f1f5fd;
          }
        }

        &:nth-child(2) {
          .box {
            background-color: #e9f7fe;
          }
        }

        &:nth-child(3) {
          .box {
            background-color: #fef5ec;
          }
        }

        &:nth-child(4) {
          .box {
            background-color: #feeeee;
          }
        }

        &:nth-child(5) {
          .box {
            background-color: #e7f9fe;
          }
        }
      }
    }

    .r-list-content {
      height: 310px;
      overflow-y: scroll;
      box-sizing: border-box;
      padding: 0 40px;

      .project-hover {
        &:hover {
          color: rgb(64, 158, 255);
          cursor: pointer;
        }
      }

      .list-item {
        display: flex;
        height: 30px;
        line-height: 30px;

        &:hover {
          background-color: rgba(64, 158, 255, .3);
        }

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

  .row2 {
    background-color: #fff;
    margin-bottom: 8px;

    .row2-content {
      height: 255px;
      box-sizing: border-box;
      padding: 10px;
      overflow-y: auto;

      .row2-3-top {
        padding: 0 20px 10px;
        box-sizing: border-box;
        border-bottom: 1px #cccccc dotted;

        .num {
          font-weight: 700;
          font-size: 20px;
        }
      }

      .row2-3-bottom {
        box-sizing: border-box;
        padding: 20px 10px;

        .row2-3-bottom-item {
          display: flex;
          margin-bottom: 20px;

          img {
            width: 32px;
            height: 32px;
          }

          .bottom-item-t {
            margin-left: 10px;

            .num {
              font-size: 28px;

              &.in {
                color: #0260ac;
              }

              &.out {
                color: #ef6671;
              }
            }
          }
        }
      }

      .btn-box {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        height: 230px;
        font-size: 16px;

        .row2-btn-item {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30%;
          height: 60px;
          color: #1b3d6a;
          cursor: pointer;
          background-color: #f3f4ff;

          &:nth-child(1) {
            .row2-icon {
              background-image: url(../assets/images/01项目备案立项-down.png);
            }
          }

          &:nth-child(2) {
            .row2-icon {
              background-image: url(../assets/images/02跟踪信息录入-down.png);
            }
          }

          &:nth-child(3) {
            .row2-icon {
              background-image: url(../assets/images/03投标评审-down.png);
            }
          }

          &:nth-child(4) {
            .row2-icon {
              background-image: url(../assets/images/04投标结果登记-down.png);
            }
          }

          &:nth-child(5) {
            .row2-icon {
              background-image: url(../assets/images/05合同评审-down.png);
            }
          }

          &:nth-child(6) {
            .row2-icon {
              background-image: url(../assets/images/06备案登记-down.png);
            }
          }

          &:nth-child(7) {
            .row2-icon {
              background-image: url(../assets/images/07生产任务下单-down.png);
            }
          }

          &:nth-child(8) {
            .row2-icon {
              background-image: url(../assets/images/08客户登记-down.png);
            }
          }

          &:nth-child(9) {
            .row2-icon {
              background-image: url(../assets/images/09供应商登记-down.png);
            }
          }

          &:hover {
            background-color: #0260ac;
            color: #fff;

            &:nth-child(1) {
              .row2-icon {
                background-image: url(../assets/images/01项目备案立项-on.png);
              }
            }

            &:nth-child(2) {
              .row2-icon {
                background-image: url(../assets/images/02跟踪信息录入-on.png);
              }
            }

            &:nth-child(3) {
              .row2-icon {
                background-image: url(../assets/images/03投标评审-on.png);
              }
            }

            &:nth-child(4) {
              .row2-icon {
                background-image: url(../assets/images/04投标结果登记-on.png);
              }
            }

            &:nth-child(5) {
              .row2-icon {
                background-image: url(../assets/images/05合同评审-on.png);
              }
            }

            &:nth-child(6) {
              .row2-icon {
                background-image: url(../assets/images/06备案登记-on.png);
              }
            }

            &:nth-child(7) {
              .row2-icon {
                background-image: url(../assets/images/07生产任务下单-on.png);
              }
            }

            &:nth-child(8) {
              .row2-icon {
                background-image: url(../assets/images/08客户登记-on.png);
              }
            }

            &:nth-child(9) {
              .row2-icon {
                background-image: url(../assets/images/09供应商登记-on.png);
              }
            }
          }

          .row2-icon {
            width: 32px;
            height: 32px;
            margin-right: 5px;
            background-position: center center;
            background-size: cover;
            background-repeat: no-repeat;
          }
        }

        .left-btn {
          height: 50px;
          width: 30%;
          text-align: center;
          margin: 0;
        }
      }
    }
  }
}

//.page-main {
//  background-color: var(--g-main-bg);
//  padding: 0;
//  font-size: 14px;
//
//  .left-box {
//    background-color: #fff;
//    margin-bottom: 10px;
//    padding: 10px;
//    height: 380px;
//
.tab-list-item {
  //height: 30px;
  //line-height: 30px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
}
//
//    :deep(.el-tabs__content) {
//      height: 280px;
//      overflow-y: scroll;
//    }
//
//    .box-title {
//      margin-bottom: 10px;
//    }
//
//    .btn-box {
//      display: flex;
//      flex-wrap: wrap;
//      justify-content: space-between;
//      align-items: center;
//      height: 200px;
//      font-size: 16px;
//
//      .left-btn {
//        height: 50px;
//        width: 30%;
//        text-align: center;
//        margin: 0;
//      }
//    }
//  }
//
//  .right-box {
//    margin-bottom: 10px;
//
//    .r-block {
//      background-color: #fff;
//      display: flex;
//      align-items: center;
//      justify-content: center;
//
//      .num {
//        font-size: 24px;
//        font-weight: 700;
//      }
//
//      .r-block-item {
//        padding: 0 15px;
//      }
//
//      .r-block-item:nth-child(2) {
//        border-right: 1px solid #ccc;
//        border-left: 1px solid #ccc;
//      }
//    }
//
//    .r-list {
//      padding: 10px;
//      background-color: #fff;
//
//      .r-list-content {
//        margin-top: 10px;
//        height: 450px;
//        overflow-y: scroll;
//
//        .list-item {
//          display: flex;
//          height: 30px;
//          line-height: 30px;
//
//          span:nth-child(1) {
//            flex: 2.5;
//          }
//
//          span:nth-child(2),
//          span:nth-child(3),
//          span:nth-child(4) {
//            flex: 1;
//          }
//        }
//      }
//    }
//
//    .h60 {
//      height: 80px;
//    }
//  }
//}
</style>
