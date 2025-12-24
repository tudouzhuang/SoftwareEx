<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
      @drag-sort="sortTable"
    >
      <template #tableHeader="scope">
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增账号</el-button>
        <el-button type="danger" :icon="Delete" plain :disabled="!scope.isSelected" @click="batchDelete(scope.selectedListIds)">
          批量删除
        </el-button>
      </template>

      <template #expand="scope">
        <div style="padding: 20px">
          <p><strong>真实姓名：</strong>{{ scope.row.realName }}</p>
          <p><strong>所属部门：</strong>{{ scope.row.department }}</p>
          <p><strong>完整信息 JSON：</strong>{{ scope.row }}</p>
        </div>
      </template>

      <template #usernameHeader="scope">
        <el-button type="primary" link @click="ElMessage.success('我是自定义表头点击事件')">
          {{ scope.column.label }} <el-icon class="el-icon--right"><Star /></el-icon>
        </el-button>
      </template>

      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="warning" link :icon="Refresh" @click="resetPass(scope.row)">重置密码</el-button>
        <el-button type="danger" link :icon="Delete" @click="deleteAccountFunc(scope.row)">删除</el-button>
      </template>
    </ProTable>

    <UserDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="tsx" name="accountManagePro">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { ProTableInstance, ColumnProps, HeaderRenderScope } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, Refresh, Star, UserFilled } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import UserDrawer from "@/views/proTable/components/UserDrawer.vue";
import { useHandleData } from "@/hooks/useHandleData";

// 引入账号管理 API
import {
  getAccountList,
  addAccount,
  editAccount,
  deleteAccount,
  changeAccountStatus,
  resetPassword,
  getRoleStatus
} from "@/api/modules/account";

// ProTable 实例
const proTable = ref<ProTableInstance>();

// 初始化请求参数
const initParam = reactive({ type: 1 });

// dataCallback: 处理后端返回的数据格式
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total
  };
};

// 获取表格数据
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  // 如果有时间范围查询，可以在这里处理
  return getAccountList(newParams);
};

// 自定义渲染表头 (TSX 语法)
const headerRender = (scope: HeaderRenderScope<any>) => {
  return (
    <el-button type="primary" link onClick={() => ElMessage.success("我是 TSX 渲染的表头")}>
      {scope.column.label}
    </el-button>
  );
};

// 表格配置项
const columns = reactive<ColumnProps<any>[]>([
  { type: "selection", fixed: "left", width: 70 },
  { type: "sort", label: "Sort", width: 80 },
  { type: "expand", label: "Expand", width: 85 },
  {
    prop: "username",
    label: "用户名",
    // 使用 slot 自定义表头
    headerRender: scope => (
      <el-button type="primary" link onClick={() => ElMessage.success("TSX 表头")}>
        {scope.column.label}
      </el-button>
    ),
    search: { el: "input", tooltip: "输入用户名搜索" },
    render: scope => {
      return (
        <div style="display: flex; align-items: center">
          <el-icon class="mr5">
            <UserFilled />
          </el-icon>
          <span style="font-weight: bold">{scope.row.username}</span>
        </div>
      );
    }
  },
  {
    prop: "realName",
    label: "真实姓名",
    search: { el: "input" }
  },
  {
    prop: "role",
    label: "角色",
    enum: getRoleStatus,
    search: { el: "select", props: { filterable: true } },
    fieldNames: { label: "label", value: "value" },
    render: scope => {
      return (
        <el-tag type={scope.row.role === "管理员" ? "danger" : scope.row.role === "普通用户" ? "primary" : "info"}>
          {scope.row.role}
        </el-tag>
      );
    }
  },
  {
    prop: "department",
    label: "所属部门",
    search: { el: "input" }
  },
  {
    prop: "status",
    label: "账号状态",
    render: scope => {
      return (
        <el-switch
          model-value={scope.row.status}
          active-text={scope.row.status ? "启用" : "禁用"}
          active-value={1}
          inactive-value={0}
          onClick={() => changeStatus(scope.row)}
        />
      );
    }
  },
  {
    prop: "createTime",
    label: "创建时间",
    width: 200,
    headerRender, // 使用上面定义的通用表头渲染函数
    search: {
      el: "date-picker",
      span: 2,
      props: { type: "datetimerange", valueFormat: "YYYY-MM-DD HH:mm:ss" }
    }
  },
  { prop: "operation", label: "操作", fixed: "right", width: 300 }
]);

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  ElMessage.success("修改列表排序成功");
};

// 删除账号
const deleteAccountFunc = async (params: any) => {
  await useHandleData(deleteAccount, { id: [params.id] }, `删除账号【${params.username}】`);
  proTable.value?.getTableList();
};

// 批量删除
const batchDelete = async (id: string[]) => {
  await useHandleData(deleteAccount, { id }, "删除所选账号");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 重置密码
const resetPass = async (params: any) => {
  await useHandleData(resetPassword, { id: params.id }, `重置【${params.username}】的密码`);
};

// 切换状态
const changeStatus = async (row: any) => {
  const name = row.username || row.realName || "该账号";
  await useHandleData(changeAccountStatus, { id: row.id, status: row.status === 1 ? 0 : 1 }, `切换【${name}】状态`);
  proTable.value?.getTableList();
};

// 打开 Drawer
const drawerRef = ref<InstanceType<typeof UserDrawer> | null>(null);
const openDrawer = (title: string, row: any = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addAccount : title === "编辑" ? editAccount : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
