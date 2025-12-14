<!-- src/views/Login.vue -->
<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock, Key } from '@element-plus/icons-vue'
import RegisterForm from './components/Register.vue' // 你的注册组件
import { getCaptchaAPI } from '@/apis/common'
import { loginAPI } from '@/apis/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const isLogin = ref(true) // true: 登录, false: 注册
const formRef = ref(null)
const loading = ref(false)

// 验证码图片
const captchaImg = ref('')

// 获取验证码
const getCaptcha = async () => {
  captchaImg.value = await getCaptchaAPI()
}

// 组件挂载时获取验证码
onMounted(() => {
  getCaptcha()
})


// 登录表单数据
const loginForm = reactive({
  phone: '',
  password: '',
  verifyCode: ''
})

// 登录校验规则
const loginRules = {
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  verifyCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}

// 切换登录/注册
const toggleView = () => {
  isLogin.value = !isLogin.value
}

// 登录处理
const handleLogin = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {

      const params = new URLSearchParams()
      params.append('phone', loginForm.phone)
      params.append('password', loginForm.password)
      params.append('verifyCode', loginForm.verifyCode)

      // 发送请求
      const res = await loginAPI(params)

      if (res.code === 500) {
        ElMessage.error(res.message)
      }

      // 成功逻辑
      ElMessage.success('登录成功')

      // 保存用户信息 (文档返回 {id, phone, nickName})
      localStorage.setItem('userInfo', JSON.stringify(res))

      // 跳转首页
      router.push('/')
    }

  })
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">

      <!-- 左侧：装饰图 -->
      <div class="login-left">
        <h2>葡萄商城</h2>
        <p>让购物更简单，生活更美好</p>
        <img src="@/assets/imgs/school.png" alt="Logo" style="width: 150px; opacity: 0.8; margin-top: 20px;">
      </div>

      <!-- 右侧：表单区域 -->
      <div class="login-right">

        <!-- 登录表单 -->
        <div v-if="isLogin" class="form-wrapper">
          <h3>账号登录</h3>
          <el-form :model="loginForm" :rules="loginRules" ref="formRef" size="large">

            <el-form-item prop="phone">
              <el-input v-model="loginForm.phone" placeholder="请输入手机号" :prefix-icon="User" />
            </el-form-item>

            <el-form-item prop="password">
              <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" :prefix-icon="Lock"
                show-password @keyup.enter="handleLogin" />
            </el-form-item>

            <el-form-item prop="verifyCode">
              <div class="code-box">
                <el-input v-model="loginForm.verifyCode" placeholder="验证码" :prefix-icon="Key" />
                <!-- 模拟验证码，文档是33 -->
                <img :src="captchaImg" alt="验证码" class="code-img" @click="getCaptcha" />
              </div>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" class="full-btn" :loading="loading" @click="handleLogin">登录</el-button>
            </el-form-item>

            <div class="form-footer">
              <span class="forget">忘记密码?</span>
              <div>
                <span>还没有账号？</span>
                <a href="javascript:;" @click="toggleView">立即注册</a>
              </div>
            </div>
          </el-form>
        </div>

        <!-- 注册表单 -->
        <RegisterForm v-else @to-login="toggleView" />

      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #74ebd5 0%, #9face6 100%);
}

.login-box {
  width: 900px;
  height: 550px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  overflow: hidden;
}

/* 左侧装饰 */
.login-left {
  width: 40%;
  background: #409EFF;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  padding: 40px;
  text-align: center;

  h2 {
    font-size: 32px;
    margin-bottom: 20px;
  }

  p {
    font-size: 16px;
    opacity: 0.8;
  }
}

/* 右侧表单 */
.login-right {
  flex: 1;
  padding: 40px 60px;
  display: flex;
  align-items: center;
  justify-content: center;

  .form-wrapper {
    width: 100%;
    max-width: 360px;
  }
}

h3 {
  font-size: 24px;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.full-btn {
  width: 100%;
}

.code-box {
  display: flex;
  width: 100%;
  gap: 10px;

  .code-img {
    width: 100px;
    height: 40px;
    background: #f2f2f2;
    text-align: center;
    line-height: 40px;
    color: #666;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    user-select: none;
  }
}

.form-footer {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666;

  .forget {
    cursor: pointer;

    &:hover {
      color: #409EFF;
    }
  }

  a {
    color: #409EFF;
    text-decoration: none;
    margin-left: 5px;
  }
}
</style>
