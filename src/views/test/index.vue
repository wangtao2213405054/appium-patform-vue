<script lang="ts" setup>
import { ref } from "vue"
import { MagicStick, FullScreen } from "@element-plus/icons-vue"
import { ElDialog } from "element-plus"

const input = ref("")
const dialogTableVisible = ref(false)
const clickButton = () => {
  dialogTableVisible.value = true
}
</script>

<template>
  <div style="margin: 10px">
    <el-dialog v-model="dialogTableVisible" title="魔法变量">
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item title="Consistency" name="1">
          <div>
            Consistent with real life: in line with the process and logic of real life, and comply with languages and
            habits that the users are used to;
          </div>
          <div>
            Consistent within interface: all elements should be consistent, such as: design style, icons and texts,
            position of elements, etc.
          </div>
        </el-collapse-item>
        <el-collapse-item title="Feedback" name="2">
          <div>
            Operation feedback: enable the users to clearly perceive their operations by style updates and interactive
            effects;
          </div>
          <div>Visual feedback: reflect current state by updating or rearranging elements of the page.</div>
        </el-collapse-item>
        <el-collapse-item title="Efficiency" name="3">
          <div>Simplify the process: keep operating process simple and intuitive;</div>
          <div>
            Definite and clear: enunciate your intentions clearly so that the users can quickly understand and make
            decisions;
          </div>
          <div>
            Easy to identify: the interface should be straightforward, which helps the users to identify and frees them
            from memorizing and recalling.
          </div>
        </el-collapse-item>
        <el-collapse-item title="Controllability" name="4">
          <div>
            Decision making: giving advices about operations is acceptable, but do not make decisions for the users;
          </div>
          <div>
            Controlled consequences: users should be granted the freedom to operate, including canceling, aborting or
            terminating current operation.
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-dialog>
    <el-input v-model="input" class="w-50 m-2" style="width: 150px" placeholder="Pick a date">
      <template #suffix>
        <el-button link :icon="MagicStick" @click="clickButton" />
        <el-button link :icon="FullScreen" @click="clickButton" />
      </template>
    </el-input>
  </div>
</template>

<style scoped lang="scss">
.el-button {
  margin-left: 0;
}
:deep(.el-input__wrapper) {
  padding: 1px 3px 1px 11px;
}
</style>
