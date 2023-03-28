<route lang="yaml">
name: home
meta:
  title: 主页
</route>

<script lang="ts" setup>
function open(url: string) {
  window.open(url, '_blank')
}

const fantasticStartkitInfo = ref({
  feature: [
    '支持 TypeScript',
    '默认集成 vue-router 和 pinia',
    '全局 SCSS 资源引入',
    '全局组件自动注册',
    '支持 SVG 图标，CSS 精灵图自动合成',
    '支持 mock 数据，可摆脱后端束缚独立开发',
    '支持 gzip / brotli 优化项目体积，提高加载速度',
    '结合 IDE 插件、ESlint 、stylelint 、Git 钩子，轻松实现团队代码规范',
  ],
})

const fantasticAdminInfo = ref({
  imageVisible: false,
  index: 0,
  data: [
    'https://hooray.gitee.io/fantastic-admin/preview1.png',
    'https://hooray.gitee.io/fantastic-admin/preview2.png',
    'https://hooray.gitee.io/fantastic-admin/preview3.png',
    'https://hooray.gitee.io/fantastic-admin/preview4.png',
    'https://hooray.gitee.io/fantastic-admin/preview5.png',
    'https://hooray.gitee.io/fantastic-admin/preview6.png',
  ],
})

const oneStepAdminInfo = ref({
  imageVisible: false,
  index: 0,
  data: [
    'https://hooray.gitee.io/one-step-admin/preview1.png',
    'https://hooray.gitee.io/one-step-admin/preview2.png',
    'https://hooray.gitee.io/one-step-admin/preview3.png',
    'https://hooray.gitee.io/one-step-admin/preview4.png',
    'https://hooray.gitee.io/one-step-admin/preview5.png',
    'https://hooray.gitee.io/one-step-admin/preview6.png',
  ],
})
</script>

<template>
  <div>
    content
  </div>
</template>

<style lang="scss" scoped>
.text-emphasis {
  text-emphasis-style: "❤";
}

.ecology {
  padding: 10px 0 0;

  &.vue {
    h1 {
      color: #41b883;
    }
  }

  &.fa {
    h1 {
      color: #e60000;
    }
  }

  &.osa {
    h1 {
      color: #67c23a;
    }
  }

  .main {
    text-align: center;

    img {
      display: block;
      margin: 0 auto;
    }

    h1 {
      margin: 10px auto 0;
      text-align: center;
    }

    h2 {
      font-size: 16px;
      font-weight: normal;
      color: var(--el-text-color-secondary);
      text-align: center;
    }
  }

  .el-carousel {
    box-shadow: var(--el-box-shadow-light);
    transition: var(--el-transition-box-shadow);
  }

  ul li {
    line-height: 28px;
  }
}

.question {
  .answer {
    margin: 20px 0 0;
    padding-left: 20px;
    font-size: 16px;
    color: var(--el-text-color-secondary);

    li {
      margin-bottom: 10px;
      line-height: 1.5;

      &:last-child {
        margin-bottom: 0;
      }
    }

    span {
      color: var(--el-text-color-primary);
      font-weight: bold;
    }
  }
}
</style>
