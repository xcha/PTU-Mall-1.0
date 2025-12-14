<!-- src/views/Cart.vue -->
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import { ElMessage, ElMessageBox } from 'element-plus'
import CartItem from './components/CartItem.vue' // 你的单行组件
const cartStore = useCartStore()

const cartList = ref([])

const getCartList = async () => {
  const res = await cartStore.getCartList()
  cartList.value = res
  console.log(cartList.value)
}



// 页面挂载时加载
onMounted(() => {
  getCartList()

})

// 全选/反选
const allChecked = computed({
  get() {
    if (cartList.value.length === 0) return false
    return cartList.value.every(item => item.checked)
  },
  set(val) {
    if (val) {
      cartList.value.forEach(item => item.checked = true)
    } else {
      cartList.value.forEach(item => item.checked = false)
    }
  }
})

// 选中商品的总价
const totalPrice = computed(() => {
  return cartList.value
    .filter(item => item.checked)
    .reduce((sum, item) => sum + item.price * item.count, 0)
    .toFixed(2)
})

// 选中商品数量
const selectedCount = computed(() => {
  return cartList.value
    .filter(item => item.checked)
    .reduce((sum, item) => sum + item.count, 0)
})

// 处理子组件删除事件
const handleDelete = async (id) => {
  await cartStore.deleteCart([id])
  cartList.value = cartList.value.filter(item => item.id !== id)
  ElMessage.success('删除成功')
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedCount.value === 0) {
    ElMessage.warning('请先选择要删除的商品')
    return
  }
  ElMessageBox.confirm(`确定删除这 ${selectedCount.value} 件商品吗？`, '提示', {
    type: 'warning'
  }).then(async () => {
    await cartStore.deleteCart(cartList.value.filter(item => item.checked).map(item => item.id))
    cartList.value = cartList.value.filter(item => !item.checked)
    ElMessage.success('批量删除成功')
  })
}

// 去结算（你可以跳转订单页面）
const handleCheckout = () => {
  if (selectedCount.value === 0) {
    ElMessage.warning('请选择要结算的商品')
    return
  }
  // 跳转到订单确认订单页，携带 selectedIds
  console.log('去结算，商品ID：', cartList.value.filter(item => item.checked).map(item => item.id))
  ElMessage.success('即将跳转订单确认页')
}
</script>

<template>
  <div class="cart-page">
    <h2>我的购物车</h2>

    <!-- 空购物车 -->
    <div v-if="cartStore.cartList.length === 0" class="empty-cart">
      <p>购物车空空如也，快去逛逛吧~</p>
      <el-button type="primary" @click="$router.push('/')">去首页逛逛</el-button>
    </div>

    <!-- 有商品 -->
    <div v-else class="cart-container">
      <div class="cart-table">
        <div class="table-header">
          <div class="column t-checkbox">
            <el-checkbox v-model="allChecked" label="全选" />
          </div>
          <div class="column t-goods">商品信息</div>
          <div class="column t-props">属性</div>
          <div class="column t-price">单价</div>
          <div class="column t-quantity">数量</div>
          <div class="column t-sum">小计</div>
          <div class="column t-action">操作</div>
        </div>

        <!-- 商品列表 -->
        <CartItem v-for="item in cartList" :key="item.id" :product="item" v-model:checked="item.checked"
          @update:checked="val => item.checked = val" v-model:count="item.count" @delete="handleDelete"
          @change:count="() => cartStore.updateCart({ id: item.id, num: item.count })" />

      </div>

      <!-- 底部结算栏 -->
      <div class="cart-footer">
        <div class="left">
          <el-checkbox v-model="allChecked">全选</el-checkbox>
          <el-button type="text" @click="handleBatchDelete">删除选中商品</el-button>
          <el-button type="text">清空购物车</el-button>
        </div>
        <div class="right">
          <span class="total">
            已选 <strong>{{ selectedCount }}</strong> 件商品
          </span>
          <span class="price">
            总计（不含运费）：<strong>¥{{ totalPrice }}</strong>
          </span>
          <el-button type="danger" size="large" @click="handleCheckout">
            去结算
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cart-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #f5f5f5;
}

.empty-cart {
  text-align: center;
  padding: 100px 0;

  img {
    width: 200px;
    margin-bottom: 20px;
  }

  p {
    color: #999;
    font-size: 18px;
    margin-bottom: 30px;
  }
}

.cart-container {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.table-header {
  display: flex;
  align-items: center;
  height: 60px;
  background: #eee;
  font-weight: bold;
  padding: 0 20px;
  border-bottom: 1px solid #ddd;
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  padding: 0 30px;
  background: #fff;
  border-top: 1px solid #ddd;
  font-size: 16px;

  .right {
    .total strong {
      color: #e4393c;
      font-size: 18px;
    }

    .price strong {
      color: #e4393c;
      font-size: 24px;
      font-weight: bold;
      margin: 0 20px;
    }
  }
}

/* 列宽和你的 CartItem 完全一致 */
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
