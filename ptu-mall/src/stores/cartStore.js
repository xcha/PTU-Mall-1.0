import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getCartDetailAPI, deleteCartAPI, updateCartAPI, addCartAPI } from '@/apis/cart'

export const useCartStore = defineStore('cartStore', () => {
  const cartList = ref([])
  const getCartList = async () => {
    // 模拟假数据
    const mockData = [
      {
        id: 1,
        prodId: 101,
        name: '商品A',
        price: 100.0,
        count: 2,
        image: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=ProductA',
        stock: 10,
        selected: true,
      },
      {
        id: 2,
        prodId: 102,
        name: '商品B',
        price: 250.5,
        count: 1,
        image: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=ProductB',
        stock: 5,
        selected: false,
      },
      {
        id: 3,
        prodId: 103,
        name: '商品C',
        price: 50.0,
        count: 3,
        image: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=ProductC',
        stock: 20,
        selected: true,
      },
    ]
    cartList.value = mockData
    return mockData

    // 真实API调用 (如果需要切换回真实数据，请取消注释以下代码并删除上面的模拟数据)
    // const res = await getCartListAPI()
    // if (res.code === 200) {
    //   cartList.value = res.data
    //   return res.data // 返回购物车数据
    // }
    // return [] // 如果失败或无数据，返回空数组
  }
  const getCartDetail = async (id) => {
    const res = await getCartDetailAPI(id)

    cartList.value = res
  }
  const deleteCart = async (ids) => {
    const res = await deleteCartAPI(ids)

    cartList.value = res
  }
  const updateCart = async (data) => {
    const res = await updateCartAPI(data)

    cartList.value = res
  }
  const addCart = async (data) => {
    const res = await addCartAPI(data)

    cartList.value = res
  }
  return { cartList, addCart, deleteCart, updateCart, getCartList, getCartDetail }
})
