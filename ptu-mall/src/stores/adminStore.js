// src/stores/adminStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserListAPI, updateUserAPI, delUserAPI } from '@/apis/admin' // 你的接口文件路径

export const useAdminStore = defineStore('adminStore', () => {
  // 用户列表（响应式，和你 productList 完全一样风格）
  const userList = ref([
    // 示例数据（真实数据会通过接口覆盖）
    {
      id: 1,
      phone: '12345678901',
      nickName: 'Alice',
    },
    {
      id: 2,
      phone: '12345678902',
      nickName: 'Bob',
    },
  ])

  // 获取用户列表（后台接口）
  const getUserList = async () => {
    userList.value = await getUserListAPI()
    console.log(userList.value)
  }

  // 修改用户（只改 nickName）
  const updateUser = async (data) => {
    await updateUserAPI(data)
  }

  // 删除用户（支持单个或批量）
  const delUser = async (ids) => {
    await delUserAPI(ids)
  }

  return {
    userList,
    getUserList,
    updateUser,
    delUser,
  }
})
