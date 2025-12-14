import request from '@/utils/http'

export const loginAPI = (data) => {
  return request({
    url: '/user/login',
    method: 'post',
    data,
  })
}

export const regAPI = (data) => {
  return request({
    url: '/user/reg',
    method: 'post',
    data,
  })
}
