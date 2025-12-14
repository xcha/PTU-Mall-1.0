<script setup>
import { Menu as IconMenu, Location } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="admin-wrap">
    <el-row class="tac">
      <el-col :span="3">
        <h2 class="mb-2">管理后台</h2>
        <el-menu default-active="1" class="admin-menu">
          <el-menu-item index="/admin" @click="router.push('/admin')">
            <template #title>
              <el-icon>
                <location />
              </el-icon>
              <span>首页</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/admin/user" @click="router.push('/admin/user')">
            <el-icon><icon-menu /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/category" @click="router.push('/admin/category')">
            <el-icon><icon-menu /></el-icon>
            <span>分类管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/product" @click="router.push('/admin/product')">
            <el-icon><icon-menu /></el-icon>
            <span>商品管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/order" @click="router.push('/admin/order')">
            <el-icon><icon-menu /></el-icon>
            <span>订单管理</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="21">
        <router-view />
      </el-col>
    </el-row>


  </div>
</template>


<style lang="scss" scoped>
.admin-wrap {
  height: 100vh;
}

.admin-menu {
  height: 100%;

  .el-menu--horizontal {
    --el-menu-horizontal-height: 100%;
  }
}
</style>
