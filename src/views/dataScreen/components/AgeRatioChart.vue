<template>
  <div class="echarts">
    <ECharts :option="option" :resize="false" />
  </div>
</template>

<script setup lang="ts">
import ECharts from "@/components/ECharts/index.vue";
import { ECOption } from "@/components/ECharts/config";

interface ChartProp {
  value: number;
  name: string;
  percentage: string;
}

// 修改这里：将年龄改为学院名称
let data: ChartProp[] = [
  { value: 200, name: "计算机学院", percentage: "16%" },
  { value: 110, name: "外语学院", percentage: "8%" },
  { value: 150, name: "经管学院", percentage: "12%" },
  { value: 310, name: "艺术学院", percentage: "24%" },
  { value: 250, name: "土木工程", percentage: "20%" },
  { value: 260, name: "机电学院", percentage: "20%" }
];

const colors = ["#F6C95C", "#EF7D33", "#1F9393", "#184EA1", "#81C8EF", "#9270CA"];

const option: ECOption = {
  color: colors,
  tooltip: {
    show: true,
    trigger: "item",
    formatter: "{b} <br/>占比：{d}%"
  },
  legend: {
    orient: "vertical",
    right: "20px",
    top: "15px",
    itemGap: 15,
    itemWidth: 14,
    formatter: function (name: string) {
      let text = "";
      data.forEach((val: ChartProp) => {
        if (val.name === name) text = " " + name + "　 " + val.percentage;
      });
      return text;
    },
    textStyle: { color: "#fff" }
  },
  grid: { top: "bottom", left: 10, bottom: 10 },
  series: [
    {
      zlevel: 1,
      name: "学院人数占比", // 修改这里
      type: "pie",
      selectedMode: "single",
      radius: [50, 90],
      center: ["35%", "50%"],
      startAngle: 60,
      label: {
        position: "inside",
        show: true,
        color: "#fff",
        formatter: function (params) {
          return (params.data as ChartProp).percentage;
        },
        rich: {
          b: {
            fontSize: 16,
            lineHeight: 30,
            color: "#fff"
          }
        }
      },
      itemStyle: {
        shadowColor: "rgba(0, 0, 0, 0.2)",
        shadowBlur: 10
      },
      data: data.map((val: ChartProp, index: number) => {
        return {
          value: val.value,
          name: val.name,
          percentage: val.percentage,
          itemStyle: {
            borderWidth: 10,
            shadowBlur: 20,
            borderColor: colors[index],
            borderRadius: 10
          }
        };
      })
    },
    {
      name: "",
      type: "pie",
      selectedMode: "single",
      radius: [50, 90],
      center: ["35%", "50%"],
      startAngle: 60,
      data: [
        {
          value: 1000,
          name: "",
          label: {
            show: true,
            formatter: "{a|学生总数}", // 修改这里：本日总数 -> 学生总数
            rich: {
              a: {
                align: "center",
                color: "rgb(98,137,169)",
                fontSize: 14
              }
            },
            position: "center"
          }
        }
      ]
    }
  ]
};
</script>
<style lang="scss" scoped>
.echarts {
  width: 100%;
  height: 100%;
}
</style>
