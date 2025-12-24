<template>
  <div class="login-container">
    <SwitchDark class="dark-switch" />

    <div class="university-header">
      <img class="login-icon" src="@/assets/images/logo.svg" alt="logo" />
      <h1 class="logo-text">安徽大学智慧教务系统</h1>
      <span class="logo-sub-text">INTELLIGENT EDUCATIONAL SYSTEM</span>
    </div>

    <div class="login-content">
      <LoginForm />
    </div>

    <div class="tech-footer">
      <span>© 2025 Anhui University | Secure Access Terminal</span>
    </div>
  </div>
</template>

<script setup lang="ts" name="login">
import LoginForm from "./components/LoginForm.vue";
import SwitchDark from "@/components/SwitchDark/index.vue";
</script>

<style scoped lang="scss">
/* 定义科技风变量 */
$tech-color: #00f3ff;
$tech-bg: #0a0a0a;

.login-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  min-height: 550px;
  background-color: $tech-bg;
  overflow: hidden;

  /* 背景网格装饰 (作为 Canvas 的底层补充) */
  background-image:
    linear-gradient(rgba($tech-color, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba($tech-color, 0.03) 1px, transparent 1px);
  background-size: 30px 30px;
}

/* 顶部暗黑切换按钮 */
.dark-switch {
  position: absolute;
  top: 30px;
  right: 30px;
  z-index: 999;
}

/* 头部 Logo 区域 - 改为全息悬浮风格 */
.university-header {
  position: absolute;
  top: 8%; /* 距离顶部位置 */
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none; /* 让鼠标穿透，不影响下方操作 */

  .login-icon {
    width: 60px;
    height: 60px;
    margin-bottom: 15px;
    filter: drop-shadow(0 0 10px rgba($tech-color, 0.5)); /* Logo 发光 */
    animation: floatLogo 3s ease-in-out infinite;
  }

  .logo-text {
    font-size: 32px;
    font-weight: bold;
    color: #ffffff;
    letter-spacing: 2px;
    text-shadow: 0 0 20px rgba($tech-color, 0.8);
    margin: 0;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  }

  .logo-sub-text {
    margin-top: 5px;
    font-size: 12px;
    color: rgba($tech-color, 0.7);
    letter-spacing: 6px;
    font-family: "Courier New", Courier, monospace;
  }
}

/* 登录框容器 */
.login-content {
  position: relative;
  z-index: 1; /* 确保在背景之上 */
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 底部页脚 */
.tech-footer {
  position: absolute;
  bottom: 20px;
  width: 100%;
  text-align: center;
  color: rgba(255, 255, 255, 0.3);
  font-size: 12px;
  font-family: "Courier New", monospace;
  z-index: 10;
  letter-spacing: 1px;
}

/* 简单的浮动动画 */
@keyframes floatLogo {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0);
  }
}

/* 响应式调整 */
@media screen and (max-width: 750px) {
  .university-header {
    top: 5%;
    .logo-text {
      font-size: 24px;
    }
  }
}
</style>
