<script setup lang="ts">
import svgIcon from "@/components/SvgIcon/index.vue"
</script>

<template>
  <el-card class="box">
    <template #header>
      <div style="height: 13px">
        <span><b>平台介绍</b></span>
      </div>
    </template>

    <div class="user-profile">
      <div class="radius">
        <img src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif" alt="" />
      </div>
      <div class="box-center">
        <div class="user-name text-center">UI自动化平台</div>
        <div class="user-role text-center text-muted">以人为驱动的测试行为转化为机器执行的一种过程</div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header">
          <svg-icon name="education" /><span><b>宗旨</b></span>
        </div>
        <div class="user-bio-section-body">
          <div class="text-muted">以目标为导向，不断抽象沉淀，消除冗余。</div>
        </div>
      </div>

      <div class="user-education user-bio-section">
        <div class="user-bio-section-header">
          <svg-icon name="education" /><span><b>说明</b></span>
        </div>
        <div class="user-bio-section-body">
          <div class="text-muted">支持Web、APP自动化测试</div>
        </div>
      </div>

      <div class="user-education user-bio-section">
        <div class="user-bio-section-header">
          <svg-icon name="edit" /><span><b>文档</b></span>
        </div>
        <div class="user-bio-section-body">
          <div class="text-muted" style="text-align: center">
            <el-link type="success">平台使用手册</el-link>
            <el-divider direction="vertical" />
            <el-link type="danger">平台使用规范</el-link>
          </div>
        </div>
      </div>

      <div class="user-skills user-bio-section">
        <div class="user-bio-section-header"><svg-icon name="skill" /><span>技能</span></div>
        <div class="user-bio-section-body">
          <div class="progress-item">
            <span>Python</span>
            <el-progress :percentage="50" />
          </div>
          <div class="progress-item">
            <span>Vue</span>
            <el-progress :percentage="30" />
          </div>
          <div class="progress-item">
            <span>TypeScript</span>
            <el-progress :percentage="15" />
          </div>
          <div class="progress-item">
            <span>Scss</span>
            <el-progress :percentage="5" />
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
.box {
  border: 1px solid var(--el-card-border-color);
  border-radius: 0;
  border-top: none;
  :deep(.el-card__header) {
    border: 0;
  }
}
.box-center {
  margin: 0 auto;
  display: table;
}

.radius {
  margin: 0 auto;
  display: table;
  width: 100px;
  height: 100px;
  border-radius: 100px;
  overflow: hidden;
}
.radius img {
  width: 100%;
  height: 100%;
}

.text-muted {
  color: var(--el-text-color-secondary);
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: var(--el-text-color-primary);

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
