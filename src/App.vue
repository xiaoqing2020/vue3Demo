<template>
  <div class="app">
    <div v-if="!isLoggedIn" class="login-form">
      <h2>登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>邮箱:</label>
          <input type="email" v-model="loginForm.email" required />
        </div>
        <div class="form-group">
          <label>密码:</label>
          <input type="password" v-model="loginForm.password" required />
        </div>
        <button type="submit">登录</button>
      </form>
    </div>

    <div v-else class="user-info">
      <h2>用户信息</h2>
      <pre>{{ userInfo }}</pre>
      <button @click="handleLogout">登出</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getCsrfCookie, login, logout, getUserInfo } from "./api";

const isLoggedIn = ref(false);
const userInfo = ref(null);
const loginForm = ref({
  email: "test@example.com",
  password: "password",
});

// 获取CSRF token
const fetchCsrfToken = async () => {
  try {
    await getCsrfCookie();
  } catch (error) {
    console.error("获取CSRF token失败:", error);
  }
};

// 处理登录
const handleLogin = async () => {
  try {
    await fetchCsrfToken(); // 登录前先获取CSRF token
    await login(loginForm.value);
    isLoggedIn.value = true;
    await fetchUserInfo();
  } catch (error) {
    console.error("登录失败:", error);
  }
};

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const response = await getUserInfo();
    userInfo.value = response.data;
  } catch (error) {
    console.error("获取用户信息失败:", error);
  }
};

// 处理登出
const handleLogout = async () => {
  try {
    await logout();
    isLoggedIn.value = false;
    userInfo.value = null;
  } catch (error) {
    console.error("登出失败:", error);
  }
};

onMounted(() => {
  fetchCsrfToken();
});
</script>

<style scoped>
.app {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.login-form {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.user-info {
  margin-top: 20px;
}
</style>
