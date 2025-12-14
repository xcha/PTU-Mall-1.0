<script setup>

import { ElIcon } from 'element-plus'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ShowItem from './components/showItem.vue';
import { useCategoryStore } from '@/stores/categoryStore'
import { useProductStore } from '@/stores/productStore'
import { useBannerStore } from '@/stores/bannerStore'
import { useCartStore } from '@/stores/cartStore'

const categoryStore = useCategoryStore()
const productStore = useProductStore()
const bannerStore = useBannerStore()
const cartStore = useCartStore()
const router = useRouter()

const getBannerList = async () => {
  const res = await bannerStore.getBannerList()
  bannerList.value = res
}
const getCartList = async () => {
  const res = await cartStore.getCartList()
  CartList.value = res
  cartCount.value = CartList.value.reduce((total, item) => total + item.count, 0)
}

// 关键：用 computed 计算购物车总数
const cartCount = ref(0)
const bannerList = ref({})
const CartList = ref([])
const userInfo = ref([])



// 获取登录状态
const loadUserInfo = () => {
  const info = localStorage.getItem('userInfo')
  if (info) {
    try {
      userInfo.value = JSON.parse(info)
      // 隐藏手机号中间4位
      if (userInfo.value.phone) {
        userInfo.value.displayPhone =
          userInfo.value.phone.slice(0, 3) + '****' + userInfo.value.phone.slice(7)
      }
    } catch (e) {
      userInfo.value = null
      console.error('解析用户信息失败', e)
    }
  }
}

onMounted(() => {
  categoryStore.getCategory()
  productStore.getProductList()
  getBannerList()
  getCartList()
  loadUserInfo()

})


const showIndex = ref(0)

const handleCartClick = () => {
  router.push({ name: 'cart' })
}

</script>

<template>
  <div class="common-layout">
    <!-- Top Bar -->
    <div class="top-bar">
      <div class="container" style="background-color: #f5f5f5;">
        <div class="top-bar-left">
          <Router-link to="/login">你好{{ userInfo.displayPhone || '请登录' }}！</Router-link>
          <Router-link v-if="!userInfo.displayPhone" to="/login">免费注册</Router-link>
          <a>网络无障碍</a>
        </div>
      </div>
    </div>

    <!-- Header -->
    <header class="header">
      <div class="container">
        <div class="logo">
          <img src="@/assets/imgs/school.png" alt="PUTIAN UNIVERSITY" />
        </div>
        <div class="search-bar">
          <input type="text" placeholder="搜你所想" />
          <div class="search-icon">
            <el-icon size="30">
              <Search />
            </el-icon>
          </div>
        </div>
        <div class="my-cart">
          <div class="cart-icon" @click="handleCartClick">
            <el-icon size="30">
              <ShoppingCart />
            </el-icon>
          </div>
          <div class="cart-count">{{ cartCount }}</div>
        </div>

      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <div class="container" @mouseleave="showIndex = null">
        <!-- Left Sidebar -->
        <aside class="sidebar">
          <ul v-for="(item, index) in categoryStore.categoryList" :key="item.id">
            <li @mouseenter="showIndex = index + 1">
              <a href="#">{{ item.name }}</a>
            </li>
          </ul>
        </aside>

        <!-- Right Main Area (Banner) -->
        <section class="banner">
          <div class="block">
            <div class="Item-list" v-if="showIndex">
              <p v-for="(subItem, index) in productStore.productList.filter(item => item.categoryId == showIndex)"
                :key="index">
                {{ subItem.title }}
              </p>
            </div>
            <el-carousel motion-blur height="400px" v-else>
              <el-carousel-item v-for="(item, index) in bannerStore.bannerList" :key="index">
                <img :src="item.img" alt="GIVE ANCHY" />
              </el-carousel-item>
            </el-carousel>
          </div>
        </section>
      </div>

      <section class="showItems">
        <ShowItem v-for="item in categoryStore.categoryList" :items="item" :key="item.id" />
      </section>

    </main>


  </div>
</template>


<style lang="scss" scoped>
.common-layout {
  width: 100%;
  min-width: 1200px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.container {
  width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
}

.top-bar {
  background-color: #f5f5f5;
  padding: 5px 0;
  font-size: 12px;
  border-bottom: 1px solid #eee;

  .container {
    display: flex;
    justify-content: flex-end;
  }

  .top-bar-left {
    display: flex;

    a {
      margin-left: 10px;
      color: #999;
      text-decoration: none;

      &:hover {
        color: #e4393c;
      }
    }
  }
}

.header {
  padding: 20px 0;
  border-bottom: 2px solid #e4393c;

  .logo {
    img {
      height: 60px;
      /* Adjust as needed */
    }
  }

  .search-bar {
    display: flex;
    border: 2px solid #e4393c;
    height: 36px;

    .search-icon {
      background-color: #e4393c;
      color: white;
      cursor: pointer;
    }

    input {
      border: none;
      padding: 0 10px;
      width: 400px;
      outline: none;
    }

    button {
      background-color: #e4393c;
      color: white;
      border: none;
      padding: 0 15px;
      cursor: pointer;
    }
  }

  .my-cart {
    display: flex;

    .cart-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      height: 30px;
      width: 30px;
      color: #e4393c;
      cursor: pointer;
      z-index: 1000;

    }

    .cart-count {
      display: flex;
      justify-content: center;
      width: 18px;
      height: 18px;
      background-color: #e4393c;
      color: white;
      border-radius: 50%;
    }


  }
}

.main-content {
  padding: 20px 0;
  background-color: #f5f5f5;

  .container {
    align-items: flex-start;
  }

  .sidebar {
    width: 200px;
    border: 1px solid #eee;
    padding: 10px 0;
    background-color: white;

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        a {
          display: block;
          padding: 10px 15px;
          color: #333;
          text-decoration: none;

          &:hover {
            background-color: #e4393c;
            color: white;
          }
        }
      }
    }
  }

  .banner {
    flex-grow: 1;
    margin-left: 20px;
    position: relative;
    /* Adjust as needed */
    display: flex;
    align-items: center;
    justify-content: center;

    .block {
      width: 100%;
    }

    img {
      width: 100%;
      height: 100%;
      position: absolute;
      object-fit: fill;
      top: 0;
      left: 0;
    }

    .banner-content {
      position: relative;
      z-index: 1;
      color: white;
      text-align: center;

      h2 {
        font-size: 48px;
        margin-bottom: 10px;
      }

      h3 {
        font-size: 24px;
        margin-bottom: 15px;
      }

      p {
        font-size: 18px;
        margin-bottom: 20px;
      }

      button {
        background-color: black;
        color: white;
        border: none;
        padding: 10px 30px;
        font-size: 16px;
        cursor: pointer;

        &:hover {
          background-color: #333;
        }
      }
    }
  }
}

.showItems {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 300px;
}

.footer {
  background-color: #f5f5f5;
  padding: 20px 0;
  text-align: center;
  font-size: 12px;
  color: #999;
  border-top: 1px solid #eee;
}


.Item-list {
  display: flex;
  gap: 20px;
  height: 400px;
  background-color: white;
  z-index: 100;
}
</style>
