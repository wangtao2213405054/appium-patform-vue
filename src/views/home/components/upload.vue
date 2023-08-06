<script setup lang="ts">
import { Plus, ZoomIn, Delete } from "@element-plus/icons-vue"
import { ElDialog } from "element-plus"
import { apiUploadImageFile } from "@/api/upload"
import { ref, watch, onMounted } from "vue"

interface Props {
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: ""
})

const emit = defineEmits(["update:modelValue"])

watch(
  () => props.modelValue,
  (newValue) => {
    fileList.value = newValue ? [{ url: newValue }] : []
    uploadDisabled.value = !!newValue
    avatarUrl.value = newValue
  }
)

onMounted(() => {
  fileList.value = props.modelValue ? [{ url: props.modelValue }] : []
  uploadDisabled.value = !!props.modelValue
  avatarUrl.value = props.modelValue
})

const avatarUrl = ref<string>("")
const uploadDisabled = ref(false)
const dialogVisible = ref(false)
const dialogImageUrl = ref("")
const fileList = ref<string[]>([])
const avatarPrefix = "?imageView2/1/w/480/h/480"

// 上传图片
async function uploadAvatarImage(file: any) {
  const files = new FormData()
  files.append("file", file.file)
  uploadDisabled.value = true
  avatarUrl.value = (await apiUploadImageFile(files)).data.url
  emit("update:modelValue", avatarUrl.value)
}

// 删除活动展示照片
const handleRemove = () => {
  uploadDisabled.value = false
  avatarUrl.value = ""
  fileList.value = []
}

// 预览图片
const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}
</script>

<template>
  <el-upload
    :class="{ disabled: uploadDisabled }"
    list-type="picture-card"
    :auto-upload="true"
    :limit="1"
    :http-request="uploadAvatarImage"
    :on-remove="handleRemove"
    :on-preview="handlePictureCardPreview"
    :file-list="fileList"
  >
    <el-icon><Plus /></el-icon>
    <template #file="{ file }">
      <div>
        <img class="el-upload-list__item-thumbnail" :src="avatarUrl ? avatarUrl + avatarPrefix : file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
            <el-icon><ZoomIn /></el-icon>
          </span>
          <span class="el-upload-list__item-delete" @click="handleRemove(file)">
            <el-icon><Delete /></el-icon>
          </span>
        </span>
      </div>
    </template>
    <el-dialog v-model="dialogVisible" width="530px" center append-to-body>
      <img :src="dialogImageUrl" style="width: 480px" alt="Preview Image" />
    </el-dialog>
  </el-upload>
</template>

<style scoped lang="scss">
:deep(.disabled) {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
