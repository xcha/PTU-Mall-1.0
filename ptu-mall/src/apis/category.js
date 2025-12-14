import request from '@/utils/http'

export const getCategoryAPI = () => {
  return request({
    url: '/category/list',
    method: 'get',
  })
}
export const getCategoryByIdAPI = (id) => {
  return request({
    url: '/category/' + id,
    method: 'get',
    params: { id },
  })
}
export const insertCategoryAPI = (data) => {
  return request({
    url: '/category/insert',
    method: 'post',
    data,
  })
}

export const updateCategoryAPI = (data) => {
  return request({
    url: '/category/update',
    method: 'post',
    data,
  })
}
// src/apis/category.js
export const deleteCategoryAPI = (ids) => {
  return request({
    url: '/category/admin/delete',
    method: 'post', // 改成 post
    data: ids, // 传 [1,2,3]
  })
}
