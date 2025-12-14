import request from '@/utils/http'

export const updateUserAPI = (data) => {
  return request({
    url: '/admin/update',
    method: 'post',
    data,
  })
}

export const delUserAPI = (id) => {
  return request({
    url: '/admin/delete',
    method: 'post',
    data: id,
  })
}

export const getUserListAPI = () => {
  return request({
    url: '/admin/list',
    method: 'get',
  })
}
