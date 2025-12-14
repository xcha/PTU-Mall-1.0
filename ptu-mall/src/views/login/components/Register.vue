<!-- src/components/RegisterForm.vue -->
<script setup>
import { reactive, ref, onMounted } from 'vue'
import { User, Lock, Key } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getCaptchaAPI } from '@/apis/common'
import { regAPI } from '@/apis/user'

// 定义事件：注册成功或点击去登录时，通知父组件
const emit = defineEmits(['to-login'])

const formRef = ref(null)
const loading = ref(false)
const captchaImg = ref() // 用于存储验证码图片URL

// 获取验证码图片
const getCaptcha = async () => {
  const res = await getCaptchaAPI()
  captchaImg.value = res
}

onMounted(() => {
  getCaptcha() // 组件挂载时获取验证码
})

// 表单数据
const form = reactive({
  phone: '',
  password: '',
  password2: '',
  verifyCode: ''
})

// 自定义校验规则：检查两次密码是否一致
const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

// 校验规则配置
const rules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  password2: [
    { validator: validatePass2, trigger: 'blur' }
  ],
  verifyCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ]
}

// 注册提交
const handleRegister = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 注意：接口文档显示是表单提交，如果后端需要 Form Data格式：
        const params = new URLSearchParams()
        params.append('phone', form.phone)
        params.append('password', form.password)
        params.append('password2', form.password2)
        params.append('verifyCode', form.verifyCode)
        const res = await regAPI(params)
        console.log(res)
        // 假设 request.js 拦截器里已经过滤了 code!=200 的情况

        ElMessage.success('注册成功，请登录')
        emit('to-login') // 切换回登录页

      } catch (error) {
        console.error(error)
        ElMessage.error('注册失败，请检查手机号、密码或验证码')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<template>
  <div class="register-form">
    <h3>欢迎注册</h3>
    <el-form :model="form" :rules="rules" ref="formRef" size="large">

      <el-form-item prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号" :prefix-icon="User" />
      </el-form-item>

      <el-form-item prop="password">
        <el-input v-model="form.password" type="password" placeholder="设置密码" :prefix-icon="Lock" show-password />
      </el-form-item>

      <el-form-item prop="password2">
        <el-input v-model="form.password2" type="password" placeholder="确认密码" :prefix-icon="Lock" show-password />
      </el-form-item>

      <el-form-item prop="verifyCode">
        <div class="code-box">
          <el-input v-model="form.verifyCode" placeholder="验证码" :prefix-icon="Key" style="flex: 1;" />
          <!-- 这里模拟一个验证码图片，实际项目需替换为 <img src="/api/code" /> -->
          <img :src="captchaImg" alt="验证码" class="code-img" @click="getCaptcha" />
        </div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" class="full-btn" :loading="loading" @click="handleRegister">立即注册</el-button>
      </el-form-item>

      <div class="form-footer">
        <span>已有账号？</span>
        <a href="javascript:;" @click="emit('to-login')">去登录</a>
      </div>
    </el-form>
  </div>
</template>

<style scoped>
h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.full-btn {
  width: 100%;
}

.code-box {
  display: flex;
  gap: 10px;
  width: 100%;
  align-items: center;
}

.code-img {
  width: 100px;
  height: 40px;
  background: #f0f0f0;
  text-align: center;
  line-height: 40px;
  color: #666;
  font-weight: bold;
  cursor: pointer;
}

.form-footer {
  text-align: center;
  font-size: 14px;
  color: #666;
}

.form-footer a {
  color: #409EFF;
  text-decoration: none;
  margin-left: 5px;
}
</style>
