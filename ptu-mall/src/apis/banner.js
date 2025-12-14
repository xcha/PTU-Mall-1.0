import request from '@/utils/http'

export const getBannerListAPI = () => {
  return request({
    url: '/banner/list',
    method: 'get',
  })
}

export const getBannerDetailAPI = (id) => {
  return request({
    url: '/banner/' + id,
    method: 'get',
    params: { id },
  })
}

export const deleteBannerAPI = (ids) => {
  return request({
    url: '/banner/delete',
    method: 'post',
    data: ids, // 期望接收 JSON 格式的 Integer 数组
  })
}

export const updateBannerAPI = (data) => {
  return request({
    url: '/banner/update',
    method: 'post',
    data,
  })
}

export const addBannerAPI = (data) => {
  return request({
    url: '/banner/insert',
    method: 'post',
    data,
  })
}
