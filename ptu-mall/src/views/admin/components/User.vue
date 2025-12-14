<!-- src/views/UserManagement.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useAdminStore } from '@/stores/adminStore'
import { ElMessage, ElMessageBox } from 'element-plus'

const adminStore = useAdminStore()
const userList = ref([])
// 加载用户列表
const loadData = async () => {
  await adminStore.getUserList()
  userList.value = adminStore.userList
}

onMounted(() => {
  loadData()
})

// ==================== 编辑弹窗 ====================
const dialogVisible = ref(false)
const editForm = ref({
  id: null,
  phone: '',
  nickName: '',
})

const handleEdit = (row) => {
  editForm.value = {
    id: row.id,
    phone: row.phone,
    nickName: row.nickName || '',
  }
  dialogVisible.value = true
}

const handleClose = () => {
  dialogVisible.value = false
}

const handleSave = async () => {
  try {
    await adminStore.updateUser(editForm.value)
    ElMessage.success('修改成功')
    dialogVisible.value = false
    await loadData() // 保存后刷新列表
  } catch (error) {
    ElMessage.error('修改失败')
    console.error(error)
  }
}

// 删除用户
const handleDelete = async (row) => {
  ElMessageBox.confirm(`确定要删除用户【${row.nickName || row.phone}】吗？`, '警告', {
    type: 'warning'
  }).then(async () => {
    await adminStore.delUser([row.id])
    ElMessage.success('删除成功')
    await loadData()
  }).catch(() => { })
}

// 批量删除
const selectRows = ref([])
const handleBatchDelete = async () => {
  if (selectRows.value.length === 0) {
    ElMessage.warning('请先选择要删除的用户')
    return
  }
  ElMessageBox.confirm(`确定要删除这 ${selectRows.value.length} 个用户吗？`, '警告', {
    type: 'warning'
  }).then(async () => {
    const ids = selectRows.value.map(item => item.id)
    await adminStore.delUser(ids)
    ElMessage.success('批量删除成功')
    await loadData()
  }).catch(() => { })
}
</script>

<template>
  <div class="user-management">
    <h1>用户管理</h1>

    <!-- 操作栏 -->
    <div class="toolbar" style="margin-bottom: 20px;">
      <el-button type="danger" @click="handleBatchDelete" :disabled="selectRows.length === 0">
        批量删除
      </el-button>
      <el-button type="primary" @click="loadData">刷新</el-button>
    </div>

    <!-- 用户表格 -->
    <el-table :data="userList" style="width: 100%" @selection-change="selectRows = $event" v-loading="loading" border>
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="phone" label="手机号" width="140" />
      <el-table-column prop="nickName" label="昵称">
        <template #default="{ row }">
          <el-tag v-if="row.nickName">{{ row.nickName }}</el-tag>
          <span v-else class="text-gray-500">未设置</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="注册时间" width="180">
        <template #default="{ row }">
          {{ row.createTime ? new Date(row.createTime).toLocaleString() : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination" style="margin-top: 20px; text-align: right;">
      <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :total="total"
        layout="total, sizes, prev, pager, next, jumper" @size-change="loadData" @current-change="loadData" />
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="dialogVisible" title="编辑用户" width="500px">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="用户ID">
          <el-input v-model="editForm.id" disabled />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="editForm.phone" disabled />
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="editForm.nickName" placeholder="请输入昵称" clearable />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.user-management {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  min-height: calc(100vh - 100px);
}
</style>
