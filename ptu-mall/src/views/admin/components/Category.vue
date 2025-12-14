<!-- src/views/CategoryManagement.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useCategoryStore } from '@/stores/categoryStore'
import { ElMessage, ElMessageBox } from 'element-plus'

const categoryStore = useCategoryStore()

const categoryList = ref([])
const loading = ref(false)

// 弹窗
const dialogVisible = ref(false)
const dialogTitle = ref('新增分类')

// 表单
const form = ref({
  id: null,
  code: '',
  name: ''
})

// 选中的行（批量删除用）
const selectedRows = ref([])

// 加载分类列表
const loadData = async () => {
  loading.value = true
  try {
    await categoryStore.getCategory()
    categoryList.value = categoryStore.categoryList
  } catch (error) {
    console.error(error)
    ElMessage.error('加载分类失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

// 新增按钮
const handleAdd = () => {
  dialogTitle.value = '新增分类'
  form.value = { id: null, code: '', name: '' }
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  dialogTitle.value = '编辑分类'
  form.value = {
    id: row.id,
    code: row.code || '',
    name: row.name || ''
  }
  dialogVisible.value = true
}

// 保存
const handleSave = async () => {
  if (!form.value.code || !form.value.name) {
    ElMessage.warning('请填写完整信息')
    return
  }

  try {
    if (form.value.id) {
      // 修改
      await categoryStore.updateCategory(form.value)
      ElMessage.success('修改成功')
    } else {
      // 新增
      await categoryStore.insertCategory(form.value)
      ElMessage.success('添加成功')
    }
    dialogVisible.value = false
    await loadData() // 刷新列表
  } catch (error) {
    ElMessage.error('操作失败')
    console.error(error)
  }
}

// 删除单个
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除分类【${row.name}】吗？`, '警告', {
    type: 'warning'
  }).then(async () => {
    await categoryStore.deleteCategory([row.id])
    ElMessage.success('删除成功')
    await loadData()
  })
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要删除的分类')
    return
  }
  ElMessageBox.confirm(`确定删除这 ${selectedRows.value.length} 个分类吗？`, '警告', {
    type: 'warning'
  }).then(async () => {
    const ids = selectedRows.value.map(item => item.id)
    await categoryStore.deleteCategory(ids)
    ElMessage.success('批量删除成功')
    await loadData()
  })
}
</script>

<template>
  <div class="category-management">
    <h1>分类管理</h1>

    <!-- 操作栏 -->
    <div class="toolbar" style="margin-bottom: 20px;">
      <el-button type="primary" @click="handleAdd">
        新增分类
      </el-button>
      <el-button type="danger" :disabled="selectedRows.length === 0" @click="handleBatchDelete">
        批量删除
      </el-button>
      <el-button @click="loadData">刷新</el-button>
    </div>

    <!-- 分类表格 -->
    <el-table :data="categoryList" v-loading="loading" border style="width: 100%"
      @selection-change="selectedRows = $event">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="100" />
      <el-table-column prop="code" label="分类编码" width="180" />
      <el-table-column prop="name" label="分类名称" min-width="200" />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑弹窗 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px" destroy-on-close>
      <el-form :model="form" label-width="100px">
        <el-form-item label="分类编码" prop="code">
          <el-input v-model="form.code" placeholder="如 C001" />
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="如 手机数码" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.category-management {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
}
</style>
