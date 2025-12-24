<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getCourseList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <template #tableHeader="scope">
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增课程</el-button>
        <el-button type="danger" :icon="Delete" plain :disabled="!scope.isSelected" @click="batchDelete(scope.selectedListIds)">
          批量删除
        </el-button>
      </template>

      <template #status="scope">
        <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
          {{ scope.row.status === 1 ? "已开课" : "已结课" }}
        </el-tag>
      </template>

      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="danger" link :icon="Delete" @click="deleteCourseFunc(scope.row)">删除</el-button>
      </template>
    </ProTable>

    <UserDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="tsx" name="useSelectFilter">
import { ref, reactive } from "vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import UserDrawer from "@/views/proTable/components/UserDrawer.vue";
// 修改这里：删除了未使用的 ElMessage, ElMessageBox
import { useHandleData } from "@/hooks/useHandleData";
// 引入 API
import { getCourseList, deleteCourse, addCourse, editCourse, getCourseStatus } from "@/api/modules/course";

// 表格实例
const proTable = ref<ProTableInstance>();

// 初始化参数
const initParam = reactive({});

// 数据回调处理
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total
  };
};

// 表格配置
const columns = reactive<ColumnProps[]>([
  { type: "selection", fixed: "left", width: 70 },
  { type: "index", label: "#", width: 80 },
  {
    prop: "courseName",
    label: "课程名称",
    search: { el: "input", placeholder: "输入课程名搜索" }
  },
  {
    prop: "teacher",
    label: "任课教师",
    search: { el: "input" }
  },
  {
    prop: "credits",
    label: "学分",
    width: 100
  },
  {
    prop: "time",
    label: "上课时间"
  },
  {
    prop: "location",
    label: "上课地点"
  },
  {
    prop: "status",
    label: "状态",
    enum: getCourseStatus,
    search: { el: "select" },
    fieldNames: { label: "label", value: "value" }
  },
  { prop: "operation", label: "操作", fixed: "right", width: 200 }
]);

// 删除课程
const deleteCourseFunc = async (params: any) => {
  await useHandleData(deleteCourse, { id: [params.id] }, `删除【${params.courseName}】`);
  proTable.value?.getTableList();
};

// 批量删除
const batchDelete = async (id: string[]) => {
  await useHandleData(deleteCourse, { id }, "删除所选课程");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 打开抽屉 (新增/编辑)
const drawerRef = ref<InstanceType<typeof UserDrawer> | null>(null);
const openDrawer = (title: string, row: any = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addCourse : title === "编辑" ? editCourse : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
