import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getBannerListAPI } from '@/apis/banner'

export const useBannerStore = defineStore('bannerStore', () => {
  //state
  const bannerList = ref([])
  //action
  const getBannerList = async () => {
    const res = await getBannerListAPI()
    bannerList.value = res
  }
  return {
    bannerList,
    getBannerList,
  }
})
