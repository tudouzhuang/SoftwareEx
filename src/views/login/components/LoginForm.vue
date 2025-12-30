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
        <el-form-item prop="role">
          <el-select v-model="loginForm.role" placeholder="IDENTITY / 身份选择" class="tech-input" popper-class="tech-dropdown">
            <template #prefix>
              <el-icon class="el-input__icon"><Avatar /></el-icon>
            </template>
            <el-option label="学生 / Student" value="student" />
            <el-option label="教师 / Teacher" value="teacher" />
            <el-option label="管理员 / Admin" value="admin" />
          </el-select>
        </el-form-item>

        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="ACCESS ID / 账号" class="tech-input">
            <template #prefix>
              <el-icon class="el-input__icon"><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="ACCESS CODE / 密码"
            show-password
            autocomplete="new-password"
            class="tech-input"
          >
            <template #prefix>
              <el-icon class="el-input__icon"><Lock /></el-icon>
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
import { ElNotification } from "element-plus";
import { loginApi } from "@/api/modules/login";
import { useUserStore } from "@/stores/modules/user";
import { useTabsStore } from "@/stores/modules/tabs";
import { useKeepAliveStore } from "@/stores/modules/keepAlive";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
// 引入 Avatar 图标
import { CircleClose, UserFilled, User, Lock, Avatar } from "@element-plus/icons-vue";
import type { ElForm } from "element-plus";
import md5 from "md5";

// ------------------- 原有逻辑开始 -------------------
const router = useRouter();
const userStore = useUserStore();
const tabsStore = useTabsStore();
const keepAliveStore = useKeepAliveStore();

type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();

// 这里的校验规则增加了 role
const loginRules = reactive({
  role: [{ required: true, message: "请选择登录身份", trigger: "change" }],
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }]
});

const loading = ref(false);
// 数据增加了 role
const loginForm = reactive({
  role: "", // 默认为空
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
      // 注意：这里虽然前端选择了 role，但后端接口如果不接收 role 参数，传过去也没事，或者你可以只传 username/password
      const { data } = await loginApi({ ...loginForm, password: md5(loginForm.password) } as any);
      userStore.setToken(data.access_token);
      await initDynamicRouter();
      tabsStore.setTabs([]);
      keepAliveStore.setKeepAliveName([]);
      router.push(HOME_URL);

      // 根据选择的角色提示不同的信息（纯前端视觉欺骗）
      const roleName = loginForm.role === "admin" ? "管理员" : loginForm.role === "teacher" ? "教师" : "学生";

      ElNotification({
        title: "智慧教务系统",
        dangerouslyUseHTMLString: true,
        message: `身份验证通过: <strong style="color: #00f3ff">${roleName}</strong><br/>System Connected...`,
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
let resizeHandler: (() => void) | null = null;

const initCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  resizeHandler = resize;
  window.addEventListener("resize", resizeHandler);

  resize();

  const particles: any[] = [];
  const particleCount = 80;
  const connectionDistance = 150;

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
    ctx.strokeStyle = "rgba(0, 243, 255, 0.05)";
    ctx.lineWidth = 1;

    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.fillStyle = "#00f3ff";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

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
  initCanvas();
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
  if (resizeHandler) {
    window.removeEventListener("resize", resizeHandler);
  }
});
</script>

<style scoped lang="scss">
/* 核心变量 */
$tech-color: #00f3ff;
$tech-bg: #0a0a0a;
$tech-glass: rgba(10, 20, 30, 0.7);

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
  font-family: "Courier New", Courier, monospace;
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

/* 深度定制 Element Plus Input 和 Select */
:deep(.tech-input) {
  /* 针对 Input 和 Select 的外层包装容器 */
  .el-input__wrapper,
  .el-select__wrapper {
    background-color: rgba(0, 0, 0, 0.5) !important;
    box-shadow: none !important;
    border: 1px solid rgba($tech-color, 0.3);
    border-radius: 0;
    padding: 10px;
    transition: all 0.3s;
    width: 100%;

    &:hover,
    &.is-focus,
    &.is-focused {
      border-color: $tech-color;
      box-shadow: 0 0 15px rgba($tech-color, 0.3) !important;
    }
  }

  /* 输入框文字 */
  .el-input__inner {
    color: white;
    font-family: "Courier New", monospace;
    &::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }
  }

  /* 图标颜色 */
  .el-input__icon,
  .el-select__caret {
    color: $tech-color !important;
  }
}

.login-btn {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 30px;
}

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

<style lang="scss">
.tech-dropdown {
  background-color: rgba(10, 20, 30, 0.95) !important;
  border: 1px solid #00f3ff !important;
  box-shadow: 0 0 20px rgba(0, 243, 255, 0.2) !important;

  .el-select-dropdown__item {
    color: rgba(255, 255, 255, 0.7);
    font-family: "Courier New", monospace;

    &.hover,
    &:hover {
      background-color: rgba(0, 243, 255, 0.2);
      color: #00f3ff;
    }

    &.selected {
      color: #00f3ff;
      font-weight: bold;
      background-color: transparent;

      &::after {
        content: "<";
        position: absolute;
        right: 10px;
      }
    }
  }

  /* 隐藏箭头 */
  .el-popper__arrow::before {
    background-color: #00f3ff !important;
    border: 1px solid #00f3ff !important;
    display: none; /* 科技风通常不要小三角，直接去掉更简洁 */
  }
}
</style>
