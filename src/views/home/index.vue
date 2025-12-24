<template>
  <div class="home-tech-container">
    <canvas id="home-canvas" ref="canvasRef"></canvas>

    <div class="hud-content">
      <div class="welcome-box">
        <div class="hud-line top"></div>
        <h1 class="tech-title">SYSTEM ONLINE</h1>
        <p class="tech-subtitle">欢迎回到智慧教务指挥中心</p>
        <p class="tech-time">{{ currentTime }}</p>
        <div class="hud-line bottom"></div>
      </div>

      <div class="tech-cards">
        <div class="tech-card">
          <div class="card-icon">
            <el-icon><User /></el-icon>
          </div>
          <div class="card-info">
            <span class="label">在线学生</span>
            <span class="value count-up">12,450</span>
          </div>
        </div>
        <div class="tech-card">
          <div class="card-icon">
            <el-icon><DataLine /></el-icon>
          </div>
          <div class="card-info">
            <span class="label">今日访问</span>
            <span class="value">8,932</span>
          </div>
        </div>
        <div class="tech-card">
          <div class="card-icon">
            <el-icon><Cpu /></el-icon>
          </div>
          <div class="card-info">
            <span class="label">系统负载</span>
            <span class="value warning">32%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="home">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { User, DataLine, Cpu } from "@element-plus/icons-vue";

const canvasRef = ref<HTMLCanvasElement | null>(null);
const currentTime = ref("");
let timer: any = null;
let animationFrameId: number;
let resizeHandler: (() => void) | null = null;

// 更新时间
const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString() + " | " + now.toDateString();
};

// Canvas 动画 (类似登录页，但改成更沉稳的网格波浪)
const initCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const resize = () => {
    // 减去侧边栏和顶栏的大致高度/宽度，或者直接取父容器
    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    }
  };

  resizeHandler = resize;
  window.addEventListener("resize", resizeHandler);
  resize();

  let offset = 0;

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制流动的地平线网格
    ctx.strokeStyle = "rgba(0, 243, 255, 0.15)";
    ctx.lineWidth = 1;

    const width = canvas.width;
    const height = canvas.height;
    const gap = 40;

    // 垂直线
    for (let x = 0; x <= width; x += gap) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // 水平线 (流动效果)
    offset = (offset + 0.5) % gap;
    for (let y = offset; y <= height; y += gap) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    animationFrameId = requestAnimationFrame(animate);
  };
  animate();
};

onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
  initCanvas();
});

onBeforeUnmount(() => {
  clearInterval(timer);
  cancelAnimationFrame(animationFrameId);
  if (resizeHandler) window.removeEventListener("resize", resizeHandler);
});
</script>

<style scoped lang="scss">
$tech-color: #00f3ff;

.home-tech-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 确保占据整个内容区 */
  min-height: calc(100vh - 100px);
}

#home-canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}

.hud-content {
  position: relative;
  z-index: 10;
  text-align: center;
  width: 80%;
}

/* 欢迎中心框 */
.welcome-box {
  border: 1px solid rgba($tech-color, 0.3);
  background: rgba(0, 20, 30, 0.6);
  padding: 40px;
  position: relative;
  backdrop-filter: blur(5px);
  margin-bottom: 50px;

  .tech-title {
    font-family: "Impact", sans-serif;
    font-size: 60px;
    color: #fff;
    margin: 0;
    letter-spacing: 10px;
    text-shadow: 0 0 20px $tech-color;
  }

  .tech-subtitle {
    color: $tech-color;
    font-size: 20px;
    letter-spacing: 5px;
    margin-top: 10px;
  }

  .tech-time {
    color: rgba(255, 255, 255, 0.5);
    font-family: "Courier New", monospace;
    margin-top: 20px;
  }

  /* 上下扫描线装饰 */
  .hud-line {
    position: absolute;
    left: 0;
    width: 100%;
    height: 2px;
    background: $tech-color;
    box-shadow: 0 0 10px $tech-color;

    &.top {
      top: 0;
    }
    &.bottom {
      bottom: 0;
    }
  }
}

/* 数据卡片 */
.tech-cards {
  display: flex;
  justify-content: space-around;
  gap: 20px;
}

.tech-card {
  flex: 1;
  background: rgba(0, 243, 255, 0.05);
  border: 1px solid rgba($tech-color, 0.2);
  padding: 20px;
  display: flex;
  align-items: center;
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    background: rgba(0, 243, 255, 0.15);
    box-shadow: 0 0 20px rgba($tech-color, 0.2);
    transform: translateY(-5px);
  }

  .card-icon {
    font-size: 40px;
    color: $tech-color;
    margin-right: 20px;
  }

  .card-info {
    text-align: left;
    display: flex;
    flex-direction: column;

    .label {
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
    }

    .value {
      color: #fff;
      font-size: 28px;
      font-weight: bold;
      font-family: "Courier New", monospace;

      &.warning {
        color: #ff9900;
      }
    }
  }
}
</style>
