<script setup>
import { computed } from 'vue'
import { ElMessageBox } from 'element-plus'

// --- 1. 接收父组件传来的静态数据 ---
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

// --- 2. 双向绑定数据 (Vue 3.4+ defineModel) ---
// 这里的 checked 对应父组件的 v-model:checked
const checked = defineModel('checked')
// 这里的 count 对应父组件的 v-model:count
const count = defineModel('count')

// --- 3. 定义事件 ---
const emit = defineEmits(['delete'])

// 计算单行小计
const subtotal = computed(() => {
  return (props.product.price * count.value).toFixed(2)
})

// 处理删除
const handleDelete = () => {
  ElMessageBox.confirm('确定要删除这个商品吗?', '提示', {
    type: 'warning'
  }).then(() => {
    // 通知父组件删除，传递商品ID
    emit('delete', props.product.id)
  }).catch(() => { })
}
</script>

<template>
  <div class="cart-item" :class="{ 'item-selected': checked }">
    <!-- 勾选框 -->
    <div class="column t-checkbox">
      <el-checkbox v-model="checked"></el-checkbox>
    </div>

    <!-- 商品信息 -->
    <div class="column t-goods">
      <div class="goods-item">
        <div class="goods-img">
          <img :src="product.imgUrl" alt="">
        </div>
        <div class="goods-msg">
          <a href="#" class="title">{{ product.title }}</a>
        </div>
      </div>
    </div>

    <!-- 属性 -->
    <div class="column t-props">
      <div class="props-txt">{{ product.spec }}</div>
    </div>

    <!-- 单价 -->
    <div class="column t-price">
      ¥{{ product.price.toFixed(2) }}
    </div>

    <!-- 数量 (双向绑定) -->
    <div class="column t-quantity">
      <el-input-number v-model="count" :min="1" :max="product.stock" size="small" style="width: 100px" />
      <div class="available" v-if="product.stock < 5">仅剩 {{ product.stock }} 件</div>
    </div>

    <!-- 小计 -->
    <div class="column t-sum">
      <strong>¥{{ subtotal }}</strong>
    </div>

    <!-- 操作 -->
    <div class="column t-action">
      <a href="javascript:;" @click="handleDelete">删除</a>
      <br />
      <a href="javascript:;" class="follow-btn">移入关注</a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* 这里保留单行的样式 */
$main-red: #e4393c;

.cart-item {
  display: flex;
  align-items: flex-start;
  padding: 20px 0;
  border-bottom: 1px solid #ccc;
  background: #fff;

  &.item-selected {
    background-color: #fff4e8;
  }

  .goods-item {
    display: flex;

    .goods-img {
      width: 80px;
      height: 80px;
      border: 1px solid #eee;
      margin-right: 10px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .goods-msg {
      line-height: 20px;
    }
  }

  .title {
    color: #333;
    text-decoration: none;

    &:hover {
      color: $main-red;
    }
  }

  .props-txt {
    color: #999;
  }

  .t-price {
    font-family: Verdana;
    color: #333;
  }

  .t-sum strong {
    font-family: Verdana;
    color: #333;
    font-weight: 700;
  }

  .available {
    color: $main-red;
    margin-top: 5px;
  }

  .follow-btn {
    color: #999;
    font-size: 12px;
    text-decoration: none;
  }

  a {
    color: #666;
    text-decoration: none;

    &:hover {
      color: $main-red;
    }
  }
}

/* 列宽定义 (需要和父组件表头保持一致) */
.column {
  float: left;
}

.t-checkbox {
  width: 100px;
  padding-left: 10px;
}

.t-goods {
  width: 450px;
}

.t-props {
  width: 150px;
}

.t-price {
  width: 120px;
  text-align: right;
  padding-right: 40px;
}

.t-quantity {
  width: 150px;
  text-align: center;
}

.t-sum {
  width: 120px;
  text-align: right;
  padding-right: 40px;
}

.t-action {
  width: 100px;
  text-align: center;
}
</style>
