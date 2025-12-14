import { defineStore } from 'pinia'
import {
  getProductListAPI,
  updateProductAPI,
  addProductAPI,
  deleteProductAPI,
} from '@/apis/product'
import { ref } from 'vue'
export const useProductStore = defineStore('productStore', () => {
  const productList = ref([
    {
      id: 1, // 商品ID，主键，自增
      code: 'P001', // 商品编码，最大长度50
      title: '示例商品1', // 商品标题，最大长度255
      categoryId: 101, // 分类ID
      img: 'http://example.com/img1.jpg', // 商品图片URL，最大长度255
      price: 99.99, // 商品价格，总共10位，小数点后2位
      stocks: 100, // 库存数量
      description: '这是示例商品1的详细描述。', // 商品描述，最大长度255
      creator: 'admin', // 创建者，最大长度255
      create_time: '2023-01-01 10:00:00', // 创建时间
      update_time: '2023-01-01 10:00:00', // 更新时间
      is_del: 0, // 是否删除，0表示未删除，1表示已删除
    },
    {
      id: 2,
      code: 'P002',
      title: '示例商品2',
      categoryId: 102,
      img: 'http://example.com/img2.jpg',
      price: 199.5,
      stocks: 50,
      description: '这是示例商品2的详细描述。',
      creator: 'admin',
      create_time: '2023-01-02 11:00:00',
      update_time: '2023-01-02 11:00:00',
      is_del: 0,
    },
  ])
  const getProductList = async () => {
    const res = await getProductListAPI()
    productList.value = res
  }

  const addProduct = async (data) => {
    await addProductAPI(data)
  }
  const updateProduct = async (data) => {
    await updateProductAPI(data)
  }

  const delProduct = async (ids) => {
    await deleteProductAPI(ids)
  }

  return {
    productList,
    getProductList,
    addProduct,
    updateProduct,
    delProduct,
  }
})
