<template>
  <div class="login-wrapper">
    <canvas id="tech-canvas" ref="canvasRef"></canvas>

    <div class="login-box-tech">
      <div class="tech-decoration top-left"></div>
      <div class="tech-decoration top-right"></div>
      <div class="tech-decoration bottom-left"></div>
      <div class="tech-decoration bottom-right"></div>

      <h2 class="tech-title">SYSTEM ACCESS</h2>

      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large" class="tech-form">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="ACCESS ID / ADMIN" class="tech-input">
            <template #prefix>
              <el-icon class="el-input__icon"><user /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="ACCESS CODE"
            show-password
            autocomplete="new-password"
            class="tech-input"
          >
            <template #prefix>
              <el-icon class="el-input__icon"><lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-form>

      <div class="login-btn">
        <el-button :icon="CircleClose" round size="large" class="tech-btn-reset" @click="resetForm(loginFormRef)">
          重置 / RESET
        </el-button>
        <el-button
          :icon="UserFilled"
          round
          size="large"
          type="primary"
          :loading="loading"
          class="tech-btn-login"
          @click="login(loginFormRef)"
        >
          登录 / LOGIN
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { HOME_URL } from "@/config";
import { Login } from "@/api/interface";
import { ElNotification } from "element-plus";
import { loginApi } from "@/api/modules/login";
import { useUserStore } from "@/stores/modules/user";
import { useTabsStore } from "@/stores/modules/tabs";
import { useKeepAliveStore } from "@/stores/modules/keepAlive";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import { CircleClose, UserFilled } from "@element-plus/icons-vue";
import type { ElForm } from "element-plus";
import md5 from "md5";

// ------------------- 原有逻辑开始 -------------------
const router = useRouter();
const userStore = useUserStore();
const tabsStore = useTabsStore();
const keepAliveStore = useKeepAliveStore();

type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();
const loginRules = reactive({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }]
});

const loading = ref(false);
const loginForm = reactive<Login.ReqLoginForm>({
  username: "",
  password: ""
});

// login
const login = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async valid => {
    if (!valid) return;
    loading.value = true;
    try {
      const { data } = await loginApi({ ...loginForm, password: md5(loginForm.password) });
      userStore.setToken(data.access_token);
      await initDynamicRouter();
      tabsStore.setTabs([]);
      keepAliveStore.setKeepAliveName([]);
      router.push(HOME_URL);
      ElNotification({
        title: "智慧教务系统",
        dangerouslyUseHTMLString: true,
        message: "系统连接成功<br/>System Connected...",
        type: "success",
        duration: 3000,
        customClass: "tech-notification"
      });
    } finally {
      loading.value = false;
    }
  });
};

// resetForm
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
// ------------------- 原有逻辑结束 -------------------

// ------------------- 特效逻辑开始 (Canvas 粒子动画) -------------------
const canvasRef = ref<HTMLCanvasElement | null>(null);
let animationFrameId: number;
// 定义一个变量存 resize 函数的引用，为了解决 ESLint 报错和内存泄漏
let resizeHandler: (() => void) | null = null;

const initCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // 设置全屏
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  // 保存引用并监听
  resizeHandler = resize;
  window.addEventListener("resize", resizeHandler);

  resize();

  // 粒子配置
  const particles: any[] = [];
  const particleCount = 80; // 粒子数量
  const connectionDistance = 150; // 连线距离

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      size: Math.random() * 2 + 1
    });
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制背景网格
    ctx.strokeStyle = "rgba(0, 243, 255, 0.05)";
    ctx.lineWidth = 1;

    // 更新和绘制粒子
    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      // 边界反弹
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      // 画粒子
      ctx.fillStyle = "#00f3ff";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      // 画连线
      for (let j = i + 1; j < particles.length; j++) {
        let p2 = particles[j];
        let dx = p.x - p2.x;
        let dy = p.y - p2.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          ctx.strokeStyle = `rgba(0, 243, 255, ${1 - dist / connectionDistance})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
    animationFrameId = requestAnimationFrame(animate);
  };
  animate();
};
// ------------------- 特效逻辑结束 -------------------

onMounted(() => {
  // 启动 Canvas
  initCanvas();

  // 监听 enter
  document.onkeydown = (e: KeyboardEvent) => {
    if (e.code === "Enter" || e.code === "enter" || e.code === "NumpadEnter") {
      if (loading.value) return;
      login(loginFormRef.value);
    }
  };
});

onBeforeUnmount(() => {
  document.onkeydown = null;
  cancelAnimationFrame(animationFrameId);
  // 修复：使用保存的引用来移除监听器
  if (resizeHandler) {
    window.removeEventListener("resize", resizeHandler);
  }
});
</script>

<style scoped lang="scss">
/* 核心变量 */
$tech-color: #00f3ff; /* 青色霓虹 */
$tech-bg: #0a0a0a; /* 深黑背景 */
$tech-glass: rgba(10, 20, 30, 0.7); /* 毛玻璃背景 */

.login-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $tech-bg;
  overflow: hidden;
}

#tech-canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}

/* 科技感登录框 */
.login-box-tech {
  position: relative;
  z-index: 10;
  width: 420px;
  padding: 50px 40px;
  background: $tech-glass;
  backdrop-filter: blur(10px);
  border: 1px solid rgba($tech-color, 0.3);
  box-shadow: 0 0 30px rgba($tech-color, 0.1);
  border-radius: 4px;

  /* 扫描线动画效果 */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, transparent 50%, rgba($tech-color, 0.05) 50%);
    background-size: 100% 4px;
    pointer-events: none;
    z-index: -1;
  }
}

.tech-title {
  text-align: center;
  color: $tech-color;
  font-family: "Courier New", Courier, monospace; /* 等宽字体增加代码感 */
  font-size: 24px;
  letter-spacing: 4px;
  margin-bottom: 30px;
  text-shadow: 0 0 10px $tech-color;
  font-weight: bold;
}

/* 四角装饰 */
.tech-decoration {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid $tech-color;
  transition: all 0.3s ease;
}
.top-left {
  top: -2px;
  left: -2px;
  border-right: none;
  border-bottom: none;
}
.top-right {
  top: -2px;
  right: -2px;
  border-left: none;
  border-bottom: none;
}
.bottom-left {
  bottom: -2px;
  left: -2px;
  border-right: none;
  border-top: none;
}
.bottom-right {
  bottom: -2px;
  right: -2px;
  border-left: none;
  border-top: none;
}

.login-box-tech:hover .tech-decoration {
  width: 30px;
  height: 30px;
  box-shadow: 0 0 15px $tech-color;
}

/* 深度定制 Element Plus Input */
:deep(.tech-input) {
  .el-input__wrapper {
    background-color: rgba(0, 0, 0, 0.5) !important;
    box-shadow: none !important;
    border: 1px solid rgba($tech-color, 0.3);
    border-radius: 0; /* 硬朗直角 */
    padding: 10px;
    transition: all 0.3s;

    &:hover,
    &.is-focus {
      border-color: $tech-color;
      box-shadow: 0 0 15px rgba($tech-color, 0.3) !important;
    }
  }

  .el-input__inner {
    color: white;
    font-family: "Courier New", monospace;
    &::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }
  }

  .el-input__icon {
    color: $tech-color;
  }
}

.login-btn {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 30px;
}

/* 按钮样式 */
.tech-btn-login {
  width: 48%;
  background: rgba($tech-color, 0.2);
  border: 1px solid $tech-color;
  color: $tech-color;
  border-radius: 2px;
  font-weight: bold;
  letter-spacing: 1px;
  transition: all 0.3s;

  &:hover {
    background: $tech-color;
    color: black;
    box-shadow: 0 0 20px $tech-color;
    transform: translateY(-2px);
  }
}

.tech-btn-reset {
  width: 48%;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.7);
  border-radius: 2px;

  &:hover {
    border-color: white;
    color: white;
  }
}
</style>
