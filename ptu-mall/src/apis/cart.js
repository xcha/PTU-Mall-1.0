import request from '@/utils/http'

export const getCartListAPI = () => {
  return request({
    url: '/cart/list',
    method: 'get',
  })
}

export const getCartDetailAPI = (id) => {
  return request({
    url: '/cart/' + id,
    method: 'get',
    params: { id },
  })
}

export const deleteCartAPI = (ids) => {
  return request({
    url: '/cart/delete',
    method: 'post',
    data: ids, // 期望接收 JSON 格式的 Integer 数组
  })
}

export const updateCartAPI = (data) => {
  return request({
    url: '/cart/update',
    method: 'post',
    data,
  })
}

export const addCartAPI = (data) => {
  return request({
    url: '/cart/insertOrUpdate',
    method: 'post',
    data,
  })
}
