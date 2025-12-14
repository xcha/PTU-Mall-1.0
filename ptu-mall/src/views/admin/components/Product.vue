<script setup>
import { ref, onMounted } from 'vue'
import { useProductStore } from '@/stores/productStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { ElMessage } from 'element-plus'
import axios from 'axios' // 确保你有 axios

const productStore = useProductStore()
const categoryStore = useCategoryStore()

const categoryList = ref([])
const productList = ref([])

// 加载数据
const loadData = async () => {
  try {
    await Promise.all([
      productStore.getProductList(),
      categoryStore.getCategory()
    ])

    productList.value = productStore.productList || []
    categoryList.value = categoryStore.categoryList || []

    // 给每个商品加上分类名称（用于表格显示）
    productList.value.forEach(item => {
      const cat = categoryList.value.find(c => c.id === item.categoryId)
      item.categoryName = cat ? cat.name : '未分类'
    })
  } catch (error) {
    console.error(error)
    ElMessage.error('加载数据失败')
  }
}

onMounted(() => {
  loadData()
})

// ==================== 编辑弹窗 ====================
const dialogVisible = ref(false)

// 关键：字段名必须和后端实体完全一致！
const editProductForm = ref({
  id: null,
  code: '',
  title: '',
  price: 0,
  stocks: 0,
  description: '',
  categoryId: null,
  img: '', // ← 存 OSS 的完整 URL
})

// 当前显示的图片 URL（用于回显）
const imgUrl = ref('')

const handleEdit = (row) => {
  // 深度复制 + 修复字段名
  editProductForm.value = {
    id: row.id || null,
    code: row.code || '',
    title: row.title || '',
    price: row.price || 0,
    stocks: row.stocks || 0,
    description: row.description || '',
    categoryId: row.categoryId || null,
    img: row.img || '',
  }

  // 同步到回显变量
  imgUrl.value = editProductForm.value.img
  dialogVisible.value = true
}

const handleClose = () => {
  dialogVisible.value = false
  imgUrl.value = ''
}

// 自定义上传方法
const uploadFile = async (param) => {
  const formData = new FormData()
  formData.append('file', param.file)
  // 可选：指定上传目录
  formData.append('dir', 'ptu-mall/product/')

  try {
    const res = await axios.post('/api/common/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    if (res.data.code === 200) {
      const url = res.data.data // ← 你的接口返回格式
      editProductForm.value.img = url
      imgUrl.value = url // 立即回显
      ElMessage.success('上传成功')
    }
  } catch (error) {
    ElMessage.error('上传失败')
    console.error(error)
  }
}

// 删除图片
const handleDeleteImage = () => {
  editProductForm.value.img = ''
  imgUrl.value = ''
  ElMessage.success('图片已删除')
}

const handleSave = async () => {
  try {
    if (editProductForm.value.id) {
      // 编辑商品
      await productStore.updateProduct(editProductForm.value)
      ElMessage.success('修改成功')
    } else {
      // 新增商品
      await productStore.addProduct(editProductForm.value)
      ElMessage.success('添加成功')
    }

    // 关键：保存成功后重新加载列表，页面自动刷新！
    await loadData()

    // 关闭弹窗
    dialogVisible.value = false
  } catch (error) {
    console.error(error)
    ElMessage.error('操作失败')
  }
}
</script>

<template>
  <div class="product-management">
    <h1>商品管理</h1>

    <el-table :data="productList" style="width: 100%; margin-top: 20px">
      <el-table-column prop="id" label="#" width="80" />
      <el-table-column prop="title" label="商品名称" min-width="200" />
      <el-table-column prop="code" label="商品编码" width="120" />
      <el-table-column prop="price" label="价格¥" width="120">
        <template #default="{ row }">¥{{ row.price.toFixed(2) }}</template>
      </el-table-column>
      <el-table-column prop="stocks" label="库存" width="100" />
      <el-table-column prop="categoryName" label="分类" width="120" />
      <el-table-column label="图片" width="100">
        <template #default="{ row }">
          <el-image v-if="row.img" :src="row.img" style="width: 50px; height: 50px" fit="cover"
            :preview-src-list="[row.img]" />
          <span v-else class="text-gray-400">无图</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-button type="primary" class="add-product-btn" @click="handleEdit({})">
      + 添加商品
    </el-button>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="editProductForm.id ? '编辑商品' : '新增商品'" width="600px">
      <el-form :model="editProductForm" label-width="100px">
        <el-form-item label="商品标题">
          <el-input v-model="editProductForm.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="商品编码">
          <el-input v-model="editProductForm.code" />
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input-number v-model="editProductForm.price" :precision="2" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="商品库存">
          <el-input-number v-model="editProductForm.stocks" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select v-model="editProductForm.categoryId" placeholder="请选择" clearable style="width: 100%">
            <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

        <!-- 图片上传 + 回显（重头戏！） -->
        <el-form-item label="商品图片">
          <div class="upload-box">
            <!-- 有图：显示图片 + 删除按钮 -->
            <div v-if="imgUrl" class="image-wrapper">
              <img :src="imgUrl" alt="商品图片" />
              <div class="delete-btn" @click="handleDeleteImage">
                <i class="el-icon-delete"></i>
              </div>
            </div>

            <!-- 无图：显示上传按钮 -->
            <el-upload drag v-else action="" :http-request="uploadFile" :show-file-list="false" accept="image/*">
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div>点击或拖转上传</div>
            </el-upload>

            <div class="tip">建议尺寸 800x800，格式 jpg/png</div>
          </div>
        </el-form-item>

        <el-form-item label="商品描述">
          <el-input type="textarea" v-model="editProductForm.description" :rows="4" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.product-management {
  padding: 20px;
  background: #fff;
}

.add-product-btn {
  margin-top: 20px;
}

.upload-box {
  text-align: center;
}

.upload-placeholder {
  width: 148px;
  height: 148px;
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8c939d;
  font-size: 28px;
}

.upload-placeholder:hover {
  border-color: #409eff;
  color: #409eff;
}

.image-wrapper {
  position: relative;
  display: inline-block;
}

.image-wrapper img {
  width: 148px;
  height: 148px;
  border-radius: 6px;
  border: 1px solid #ebeef5;
}

.delete-btn {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  cursor: pointer;
  color: white;
  font-size: 20px;
}

.image-wrapper:hover .delete-btn {
  opacity: 1;
}

.tip {
  margin-top: 10px;
  color: #999;
  font-size: 12px;
}
</style>
