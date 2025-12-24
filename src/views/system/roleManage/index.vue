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
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增角色</el-button>
        <el-button type="danger" :icon="Delete" plain :disabled="!scope.isSelected" @click="batchDelete(scope.selectedListIds)">
          批量删除
        </el-button>
      </template>

      <template #expand="scope">
        <div style="padding: 20px">
          <p><strong>角色标识：</strong>{{ scope.row.roleValue }}</p>
          <p><strong>备注描述：</strong>{{ scope.row.remark }}</p>
          <p><strong>完整数据：</strong>{{ scope.row }}</p>
        </div>
      </template>

      <template #roleNameHeader="scope">
        <el-button type="primary" link @click="ElMessage.success('我是角色表头点击事件')">
          {{ scope.column.label }} <el-icon class="el-icon--right"><Star /></el-icon>
        </el-button>
      </template>

      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Setting" @click="handleMenuPermissions(scope.row)">权限</el-button>
        <el-button type="danger" link :icon="Delete" @click="deleteRoleFunc(scope.row)">删除</el-button>
      </template>
    </ProTable>

    <UserDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="tsx" name="roleManageFinal">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { ProTableInstance, ColumnProps, HeaderRenderScope } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, Setting, Star, UserFilled } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import UserDrawer from "@/views/proTable/components/UserDrawer.vue";
import { useHandleData } from "@/hooks/useHandleData";

// 引入角色 API
import { getRoleList, addRole, editRole, deleteRole, changeRoleStatus, getRoleStatusEnum } from "@/api/modules/role";

// ProTable 实例
const proTable = ref<ProTableInstance>();

// 初始化请求参数
const initParam = reactive({});

// dataCallback
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total
  };
};

// 获取表格数据
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getRoleList(newParams);
};

// 自定义渲染表头 (TSX 语法通用函数)
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
    prop: "roleName",
    label: "角色名称",
    // 使用 slot 自定义表头
    headerRender: scope => (
      <el-button type="primary" link onClick={() => ElMessage.success("TSX 角色表头")}>
        {scope.column.label}
      </el-button>
    ),
    search: { el: "input", tooltip: "输入角色名称" },
    render: scope => {
      return (
        <div style="display: flex; align-items: center">
          <el-icon class="mr5">
            <UserFilled />
          </el-icon>
          <span style="font-weight: bold; color: var(--el-color-primary)">{scope.row.roleName}</span>
        </div>
      );
    }
  },
  {
    prop: "roleValue",
    label: "角色标识",
    search: { el: "input" }
  },
  {
    prop: "remark",
    label: "角色描述",
    minWidth: 150
  },
  {
    prop: "status",
    label: "状态",
    width: 100,
    enum: getRoleStatusEnum,
    search: { el: "select" },
    fieldNames: { label: "label", value: "value" },
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
    headerRender, // 使用通用 TSX 表头渲染
    search: {
      el: "date-picker",
      span: 2,
      props: { type: "datetimerange", valueFormat: "YYYY-MM-DD HH:mm:ss" }
    }
  },
  { prop: "operation", label: "操作", fixed: "right", width: 280 }
]);

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  ElMessage.success("修改列表排序成功");
};

// 切换状态
const changeStatus = async (row: any) => {
  await useHandleData(changeRoleStatus, { id: row.id, status: row.status === 1 ? 0 : 1 }, `切换【${row.roleName}】状态`);
  proTable.value?.getTableList();
};

// 删除角色
const deleteRoleFunc = async (params: any) => {
  await useHandleData(deleteRole, { id: [params.id] }, `删除角色【${params.roleName}】`);
  proTable.value?.getTableList();
};

// 批量删除
const batchDelete = async (id: string[]) => {
  await useHandleData(deleteRole, { id }, "删除所选角色");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 菜单权限 (模拟)
const handleMenuPermissions = (row: any) => {
  ElMessage.success(`正在配置【${row.roleName}】的权限 (演示)`);
};

// 打开 Drawer
const drawerRef = ref<InstanceType<typeof UserDrawer> | null>(null);
const openDrawer = (title: string, row: any = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addRole : title === "编辑" ? editRole : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
