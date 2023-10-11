<script setup>
import { ElDropdown, ElCollapse, ElCollapseItem } from 'element-plus'
import 'element-plus/dist/index.css'
import { ArrowDown } from '@element-plus/icons-vue'
import { ref } from 'vue'

const activeName = ref('1')

const props = defineProps({
  location: { type: String, default: () => '' },
})
</script>

<template>
  <el-dropdown>
    <span class="el-dropdown-link"> Dropdown List </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>Action 1</el-dropdown-item>
        <el-dropdown-item>Action 2</el-dropdown-item>
        <el-dropdown-item>Action 3</el-dropdown-item>
        <el-dropdown-item disabled>Action 4</el-dropdown-item>
        <el-dropdown-item divided>Action 5</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

  <div
    class="absolute bg-white/90 px-3 py-3 w-1/6 overflow-y-auto h-[calc(100vh-5rem)]"
    style="background-color: #026341"
  >
    <div class="border-b-2 border-black py-4" style="background-color: #026341">
      <p class="text-xl font-bold text-white">
        {{ location }}
      </p>

      <p class="text-xs font-extralight pt-2 text-white">
        TODO: Insert dropdown menus
      </p>

      <el-collapse v-model="activeName" accordion>
        <el-collapse-item title="Consistency" name="1">
          <div>
            Consistent with real life: in line with the process and logic of
            real life, and comply with languages and habits that the users are
            used to;
          </div>
          <div>
            Consistent within interface: all elements should be consistent, such
            as: design style, icons and texts, position of elements, etc.
          </div>
        </el-collapse-item>
        <el-collapse-item title="Feedback" name="2">
          <div>
            Operation feedback: enable the users to clearly perceive their
            operations by style updates and interactive effects;
          </div>
          <div>
            Visual feedback: reflect current state by updating or rearranging
            elements of the page.
          </div>
        </el-collapse-item>
        <el-collapse-item title="Efficiency" name="3">
          <div>
            Simplify the process: keep operating process simple and intuitive;
          </div>
          <div>
            Definite and clear: enunciate your intentions clearly so that the
            users can quickly understand and make decisions;
          </div>
          <div>
            Easy to identify: the interface should be straightforward, which
            helps the users to identify and frees them from memorizing and
            recalling.
          </div>
        </el-collapse-item>
        <el-collapse-item title="Controllability" name="4">
          <div>
            Decision making: giving advices about operations is acceptable, but
            do not make decisions for the users;
          </div>
          <div>
            Controlled consequences: users should be granted the freedom to
            operate, including canceling, aborting or terminating current
            operation.
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<style scoped>
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
