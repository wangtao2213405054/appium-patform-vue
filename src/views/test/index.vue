<script setup lang="ts">
import {onMounted, ref, shallowRef, watch} from 'vue'
import { Codemirror } from "vue-codemirror"
import { json } from "@codemirror/lang-json"
import { useTheme } from "@/hooks/useTheme"
import { normal, dark } from "@/utils/theme"
import { ElMessage } from "element-plus"
import { CopyDocument } from "@element-plus/icons-vue"
import clip from "@/utils/clipboard"

const { activeThemeName } = useTheme()

const extensions = [json()]
watch(activeThemeName, (theme) => {
	currentCount.value++
	extensions[1] = theme === "normal" ? normal : dark
})

onMounted(() => {
	currentCount.value++
	extensions[1] = activeThemeName.value === "normal" ? normal : dark
})


const code = ref("")
const currentCount = ref(0)


// Codemirror EditorView instance ref
const view = shallowRef()
const handleReady = (payload) => {
	view.value = payload.view
}

const copyCode = (event: any) => {
	if (!code.value) {
		ElMessage.error("暂无可复制数据, 请添加数据后重试")
		return
	}
	clip(code.value, event)
}

const log = console.log
</script>

<template>
	<div style="padding: 20px">
		<div class="box">
			<div class="title">
				<span class="text">Json</span>
				<el-button class="copy" type="info" size="small" link :icon="CopyDocument" @click="copyCode($event)">复制</el-button>
			</div>
			<codemirror
				:key="currentCount"
				v-model="code"
				:style="{ height: '400px' }"
				:autofocus="true"
				:indent-with-tab="true"
				:tab-size="2"
				:extensions="extensions"
				@ready="handleReady"
				@change="log('change', $event)"
				@focus="log('focus', $event)"
				@blur="log('blur', $event)"
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">
.box {
	border: 1px solid var(--el-border-color);
	border-radius: 10px;
	overflow: hidden;

	.title {
		background-color: var(--code-background-color);
		border-bottom: 1px solid var(--el-border-color);
		height: 30px;
		overflow: hidden;
		display: flex;
		justify-content: space-between;
		place-items: center;

		.text {
			font-size: 10px;
			color: var(--el-color-info);
			padding-left: 15px;
		}

		.copy {
			padding-right: 15px;
		}
	}
}
</style>