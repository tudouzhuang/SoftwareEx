<template>
  <div class="echarts">
    <ECharts :option="option" :resize="false" />
  </div>
</template>

<script setup lang="ts">
import ECharts from "@/components/ECharts/index.vue";
import { ECOption } from "@/components/ECharts/config";

interface ChartProp {
  label: string;
  value: string[];
}

const gradientColors = ["rgba(254, 219, 101,0.1)", "rgba(0, 122, 254,0.1)", "rgba(255, 75, 122, 0.1)"];

// 修改这里：模拟各科平均分数据 (60-100之间)
const annualData = [
  {
    label: new Date().getFullYear() - 2 + "届",
    value: ["78", "82", "85", "70", "75", "88", "90", "85", "80", "72", "85", "92"]
  },
  {
    label: new Date().getFullYear() - 1 + "届",
    value: ["85", "88", "80", "75", "82", "90", "92", "88", "85", "78", "88", "95"]
  },
  {
    label: new Date().getFullYear() + "届",
    value: ["90", "92", "88", "85", "88", "95", "96", "92", "88", "85", "90", "98"]
  }
];

const data = {
  data: annualData,
  unit: annualData.map(val => val.label),
  // 修改这里：X轴改为科目名称
  columns: ["C语言", "Java", "Python", "Web", "数据库", "算法", "OS", "网络", "AI", "高数", "英语", "体育"],
  colors: ["#FFA600", "#007AFE", "#FF4B7A"]
};

const option: ECOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "none"
    },
    borderWidth: 0,
    padding: 0,
    backgroundColor: "transparent",
    formatter: (params: any) => {
      let str = "";
      params.forEach((val: { color: string; seriesName: string; data: number }) => {
        str += `
          <div class="year-item">
            <span class="year-dot" style="background-color: ${val.color};"></span>
            <span class="year-name">${val.seriesName}</span>
            <span class="year-value">${val.data} 分</span>
          </div>
          `;
      });
      // 修改这里：显示科目名称 params[0].name
      const dom = `
                    <div class="annual-tooltip">
                      <span class="annual-month">${params[0].name}</span>
                      <div class="annual-list">
                        ${str}
                      </div>
                    </div>
                  `;
      return dom;
    }
  },
  legend: {
    right: "2%",
    top: "0%",
    itemWidth: 15,
    itemHeight: 6,
    align: "auto",
    icon: "rect",
    itemGap: 15,
    textStyle: {
      color: "#ebebf0"
    }
  },
  grid: {
    top: "20%",
    left: "40",
    right: "4%",
    bottom: "15%"
  },
  xAxis: [
    {
      name: "(科目)", // 修改这里
      type: "category",
      boundaryGap: false,
      axisLine: {
        show: true,
        lineStyle: {
          color: "#233653"
        }
      },
      axisLabel: {
        color: "#7ec7ff",
        padding: 0,
        fontSize: 12,
        formatter: function (data) {
          return data;
        }
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: "#192a44"
        }
      },
      axisTick: {
        show: false
      },
      data: data.columns
    }
  ],
  yAxis: {
    name: "(平均分)", // 修改这里
    nameTextStyle: {
      color: "#D6DFEA",
      fontSize: 12,
      padding: [0, 30, 0, 0]
    },
    minInterval: 1,
    splitNumber: 5,
    splitLine: {
      show: false,
      lineStyle: {
        color: "#192a44"
      }
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: "#233653"
      }
    },
    axisLabel: {
      show: true,
      color: "#B9D6D6",
      padding: 0
    },
    axisTick: {
      show: false
    }
  },
  series: data.data.map((val: ChartProp, index: number) => {
    return {
      name: val.label,
      type: "line",
      symbol: "circle",
      showSymbol: false,
      smooth: true,
      lineStyle: {
        width: 1,
        color: data.colors[index],
        borderColor: data.colors[index]
      },
      itemStyle: {
        color: data.colors[index],
        borderColor: "#646ace",
        borderWidth: 2
      },
      tooltip: {
        show: true
      },
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: data.colors[index]
            },
            {
              offset: 1,
              color: gradientColors[index]
            }
          ],
          global: false
        },
        shadowColor: "rgba(25,163,223, 0.3)",
        shadowBlur: 20
      },
      data: val.value
    };
  })
};
</script>
<style lang="scss" scoped>
.echarts {
  width: 100%;
  height: 100%;
}
:deep(.annual-tooltip) {
  box-sizing: border-box;
  width: 206px;
  height: 103px;
  padding: 5px 20px;
  background: url("../images/contrast-bg.png") no-repeat;
  background-size: 100% 100%;
  .annual-month {
    display: inline-block;
    margin-bottom: 2px;
    font-size: 10px;
    color: #03b8e2;
    transform: scale(0.9);
  }
  .annual-list {
    display: flex;
    flex-direction: column;
    width: 100%;
    .year-item {
      display: flex;
      align-items: center;
      width: 100%;
      height: 22px;
      .year-dot {
        width: 5px;
        height: 5px;
        margin: 0 2px;
        border-radius: 50%;
      }
      .year-name,
      .year-value {
        font-size: 10px;
        color: #03b8e2;
        transform: scale(0.8);
      }
      .year-name {
        margin: 0 2px;
      }
      .year-value {
        display: inline-block;
        width: 25%;
      }
    }
  }
}
</style>
