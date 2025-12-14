import request from '@/utils/http'

export const getCaptchaAPI = () => {
  return request({
    url: '/common/captcha',
    method: 'get',
  })
}
