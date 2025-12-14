import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  getCategoryAPI,
  insertCategoryAPI,
  deleteCategoryAPI,
  updateCategoryAPI,
} from '@/apis/category'

export const useCategoryStore = defineStore('categoryStore', () => {
  //state
  const categoryList = ref([
    { id: 1, code: 1001, name: '手机' },
    { id: 2, code: 1002, name: '电脑' },
    { id: 3, code: 1003, name: 'ears' },
    { id: 4, code: 1004, name: 'tv' },
  ])
  //action
  const getCategory = async () => {
    const res = await getCategoryAPI()
    categoryList.value = res
  }
  const updateCategory = async (data) => {
    const res = await updateCategoryAPI(data)
    categoryList.value = res
  }
  const deleteCategory = async (ids) => {
    const res = await deleteCategoryAPI(ids)
    categoryList.value = res
  }
  const insertCategory = async (data) => {
    const res = await insertCategoryAPI(data)
    categoryList.value = res
  }

  return {
    categoryList,
    getCategory,
    updateCategory,
    deleteCategory,
    insertCategory,
  }
})
