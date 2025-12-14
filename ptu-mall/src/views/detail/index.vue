<script setup>
import { ref, onMounted, computed } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue' // 需要引入的面包屑图标
import { useRoute } from 'vue-router'
import { getProductDetailAPI } from '@/apis/product'


//获取url参数
const route = useRoute()
const id = computed(() => route.params.id)

const getProductList = async () => {
  const res = await getProductDetailAPI(id.value)
  product.value = res
}

onMounted(() => {
  getProductList()
})
const product = ref([
  {
  }
])
// --- 2. 放大镜逻辑 ---
const showMagnifier = ref(false) // 是否显示放大镜
const maskX = ref(0) // 遮罩层(黄色小块)的X坐标
const maskY = ref(0) // 遮罩层(黄色小块)的Y坐标
const bgX = ref(0)   // 大图背景的X偏移
const bgY = ref(0)   // 大图背景的Y偏移

// 鼠标在图片上移动时的处理函数
const onMouseMove = (e) => {
  // 获取左侧图片容器的 DOM 信息
  const previewBox = document.querySelector('.preview-box')
  if (!previewBox) return

  const rect = previewBox.getBoundingClientRect()

  // 1. 计算鼠标在盒子内的坐标
  let x = e.clientX - rect.left
  let y = e.clientY - rect.top

  // 遮罩层大小的一半 (假设遮罩层是 200px * 200px)
  const maskSize = 200
  const halfMask = maskSize / 2

  // 2. 计算遮罩层的 top 和 left (让鼠标处于遮罩层中心)
  let top = y - halfMask
  let left = x - halfMask

  // 3. 边界限制 (不能移出图片盒子)
  // 图片盒子假设是 450px
  const boxSize = 450
  const maxMove = boxSize - maskSize // 最大移动距离

  if (top < 0) top = 0
  if (left < 0) left = 0
  if (top > maxMove) top = maxMove
  if (left > maxMove) left = maxMove

  maskX.value = left
  maskY.value = top

  // 4. 计算大图的移动距离 (放大倍数，这里假设大图是小图的2倍)
  // 背景图移动方向是相反的
  bgX.value = -left * 2
  bgY.value = -top * 2
}

</script>

<template>
  <div class="product-detail-container">

    <!-- A. 顶部面包屑 -->
    <div class="breadcrumb-nav">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ product.title }}</el-breadcrumb-item>
        <el-breadcrumb-item>商品详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- B. 主要内容区 -->
    <div class="product-main">

      <!-- 左侧：图片与放大镜 -->
      <div class="preview-wrap">
        <div class="preview-box" @mouseenter="showMagnifier = true" @mouseleave="showMagnifier = false"
          @mousemove="onMouseMove">
          <!-- 小图 (正常显示的图) -->
          <img :src="product.img" alt="商品主图" />

          <!-- 遮罩层 (鼠标放上去显示的黄色半透明块) -->
          <div v-show="showMagnifier" class="mask" :style="{ top: maskY + 'px', left: maskX + 'px' }"></div>

          <!-- 大图查看器 (鼠标放上去才显示) -->
          <div v-show="showMagnifier" class="big-view">
            <!-- 使用背景图方式显示放大效果 -->
            <img :src="product.img" :style="{ left: bgX + 'px', top: bgY + 'px' }" />
          </div>
        </div>

        <div class="preview-list">
          <span>查看更多图片 ></span>
        </div>
      </div>

      <!-- 右侧：商品信息 -->
      <div class="item-info-wrap">
        <div class="sku-name">
          <el-tag type="danger" effect="dark" v-if="product" style="margin-right: 5px;">自营</el-tag>
          {{ product.name }}
        </div>

        <div class="summary-price-wrap">
          <div class="dt">京东价</div>
          <div class="dd">
            <span class="symbol">¥</span>
            <span class="price">{{ product.price }}</span>
            <a href="#" class="notice">降价通知</a>
          </div>
        </div>

        <div class="summary-other">
          <div class="row">
            <div class="dt">配送至</div>
            <div class="dd">北京朝阳区八里庄街道 <strong>有货</strong></div>
          </div>
          <div class="row" style="border-bottom: 1px solid #eee; padding-bottom: 10px;">
            <div class="dt">介绍</div>
            <div class="dd">{{ product.description }}</div>
          </div>
        </div>

        <!-- 购买按钮区 -->
        <div class="trade-btns">
          <!-- 数量选择 -->
          <!-- 默认为1 并禁用左边边框 -->
          <el-input-number v-model="num" :min="1" size="large" style="width: 120px; margin-right: 15px;" />
          <button class="btn-add-cart">加入购物车</button>
          <button class="btn-buy-now">立即购买</button>
        </div>

        <div class="tips">
          温馨提示 · 支持7天无理由退货
        </div>
      </div>

    </div>
  </div>
</template>

<style lang="scss" scoped>
/* 容器 */
.product-detail-container {
  width: 1200px;
  margin: 0 auto;
  padding: 20px 0;
  font-family: "Microsoft YaHei", Arial, sans-serif;
}

/* 顶部面包屑 */
.breadcrumb-nav {
  margin-bottom: 20px;
  font-size: 12px;
}

/* 主体布局 flex */
.product-main {
  display: flex;
}

/* --- 左侧预览区样式 --- */
.preview-wrap {
  width: 452px;
  /* 图片宽 450 + 边框 */
  margin-right: 30px;

  .preview-box {
    width: 450px;
    height: 450px;
    border: 1px solid #eee;
    position: relative;
    cursor: move;

    img {
      width: 100%;
      height: 100%;
      display: block;
    }

    /* 遮罩层 (那个黄色的半透明方块) */
    .mask {
      width: 200px;
      /* 遮罩大小 */
      height: 200px;
      position: absolute;
      top: 0;
      left: 0;
      background-color: rgba(255, 230, 0, 0.4);
      /* 黄色半透明 */
      border: 1px solid #ccc;
      pointer-events: none;
    }

    /* 放大查看窗口 */
    .big-view {
      width: 540px;
      /* 放大窗口宽度 */
      height: 540px;
      position: absolute;
      top: -1px;
      left: 460px;
      /* 显示在右边 */
      border: 1px solid #ccc;
      overflow: hidden;
      /* 超出隐藏 */
      z-index: 999;
      background-color: #fff;

      img {
        width: 900px;
        /* 图片放大2倍 (450*2) */
        height: 900px;
        position: absolute;
        top: 0;
        left: 0;
        max-width: none;
        /* 覆盖默认 */
        max-height: none;
      }
    }
  }

  .preview-list {
    margin-top: 10px;
    text-align: center;
    color: #666;
    font-size: 12px;
    cursor: pointer;
  }
}

/* --- 右侧信息区样式 --- */
.item-info-wrap {
  flex: 1;

  .sku-name {
    font: 700 16px Arial, "microsoft yahei";
    color: #666;
    padding-top: 10px;
    line-height: 28px;
    margin-bottom: 10px;
  }

  /* 价格区域背景 */
  .summary-price-wrap {
    background: #f3f3f3;
    padding: 10px;
    margin-bottom: 15px;
    display: flex;
    align-items: baseline;

    .dt {
      color: #999;
      font-size: 12px;
      width: 60px;
      line-height: 22px;
    }

    .dd {
      color: #e4393c;

      .symbol {
        font-size: 18px;
      }

      .price {
        font-size: 24px;
        font-weight: 700;
      }

      .old-price {
        color: #999;
        font-size: 12px;
        text-decoration: line-through;
        margin-left: 10px;
      }

      .notice {
        font-size: 12px;
        color: #005aa0;
        margin-left: 10px;
        text-decoration: none;
      }
    }
  }

  /* 其他信息行 */
  .summary-other {
    font-size: 12px;

    .row {
      display: flex;
      margin-bottom: 10px;

      .dt {
        color: #999;
        width: 60px;
        padding-left: 10px;
      }

      .dd {
        color: #666;
        flex: 1;
      }
    }
  }

  /* 按钮区域 */
  .trade-btns {
    margin-top: 20px;
    display: flex;
    align-items: center;

    button {
      height: 46px;
      padding: 0 26px;
      font-size: 18px;
      font-weight: 700;
      border: none;
      cursor: pointer;
      font-family: "microsoft yahei";
    }

    .btn-add-cart {
      background-color: #df3033;
      color: #fff;
      margin-right: 10px;

      &:hover {
        background-color: #be2629;
      }
    }

    .btn-buy-now {
      background-color: #ffeded;
      /* 浅红背景 */
      color: #df3033;
      /* 红色字 */
      border: 1px solid #df3033;
      margin-right: 10px;

      &:hover {
        background-color: #ffdbdb;
      }
    }
  }

  .tips {
    margin-top: 15px;
    color: #999;
    font-size: 12px;
  }
}
</style>
