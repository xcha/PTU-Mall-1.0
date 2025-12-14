import request from '@/utils/http'

export const getProductListAPI = () => {
  return request({
    url: '/product/list',
    method: 'get',
  })
}

export const getProductDetailAPI = (id) => {
  return request({
    url: '/product/' + id,
    method: 'get',
    params: { id },
  })
}

export const deleteProductAPI = (ids) => {
  return request({
    url: '/product/delete',
    method: 'post',
    data: ids, // 期望接收 JSON 格式的 Integer 数组
  })
}

export const updateProductAPI = (data) => {
  return request({
    url: '/product/update',
    method: 'post',
    data,
  })
}

export const addProductAPI = (data) => {
  return request({
    url: '/product/insert',
    method: 'post',
    data,
  })
}
