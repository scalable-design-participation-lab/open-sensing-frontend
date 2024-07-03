<script setup>
// IMPORTS
import { ElMenu, ElSubMenu, ElMenuItem, ElSlider } from 'element-plus'
import 'element-plus/dist/index.css'
import { useDashboardUIStore } from '@/stores/dashboardUI'

// import ParallelCoords from '~~/components/ParallelCoords'

// Store
const store = useDashboardUIStore()
const { masterSolutions, updatedMaxMinVals } = storeToRefs(store)
const { setSelectedSolution } = store

const budget = ref(0)
const outreach = ref(0)
const recruitment = ref(0)
const flooding = ref(0)

const marks = ref({
  0: '0°C',
  2: '8°C',
  3: '37°C',
  5: {
    style: {
      color: '#1989FA',
    },
    label: '50%',
  },
})

const formatTooltip = (val) => {
  return
}

// const distToSelection = computed(() => {
//   return masterSolutions.value.map((solution) => {
//     return {
//       Budget: Math.abs(solution.Budget - budget.value),
//       Outreach: Math.abs(solution.Outreach - outreach.value),
//       Recruitment: Math.abs(solution.Recruitment - recruitment.value),
//       Flooding: Math.abs(solution.Flooding - flooding.value),
//       SolnIndex: solution.SolnIndex,
//       BudgetIndex: solution.Budget,
//     }
//   })
// })

// watch(distToSelection, (n) => {
//   const sorted = n.sort(
//     getSortMethod('+Budget', '+Outreach', '+Recruitment', '+Flooding')
//   )
//   setSelectedSolution(sorted[0])
//   // console.log(sorted, selectedSolution.value)
// })

onMounted(() => {
  computeSelectedSolution()
})

const computeSelectedSolution = () => {
  const distToSelection = masterSolutions.value.map((solution) => {
    return {
      Budget: Math.abs(solution.Budget - budget.value),
      Outreach: Math.abs(solution.Outreach - outreach.value),
      Recruitment: Math.abs(solution.Recruitment - recruitment.value),
      Flooding: Math.abs(solution.Flooding - flooding.value),
      SolnIndex: solution.SolnIndex,
      BudgetIndex: solution.Budget,
    }
  })

  const sorted = distToSelection.sort(
    getSortMethod('+Budget', '+Outreach', '+Recruitment', '+Flooding')
  )
  setSelectedSolution(sorted[0])
}
// const marks = ref({
//   [updatedMaxMinVals.Budget.min]: updatedMaxMinVals.Budget.min.toString(),
//   [updatedMaxMinVals.Budget.max]: updatedMaxMinVals.Budget.max.toString(),
// })

function getSortMethod() {
  var _args = Array.prototype.slice.call(arguments)
  return function (a, b) {
    for (var x in _args) {
      var ax = a[_args[x].substring(1)]
      var bx = b[_args[x].substring(1)]
      var cx

      ax = typeof ax == 'string' ? ax.toLowerCase() : ax / 1
      bx = typeof bx == 'string' ? bx.toLowerCase() : bx / 1

      if (_args[x].substring(0, 1) == '-') {
        cx = ax
        ax = bx
        bx = cx
      }
      if (ax != bx) {
        return ax < bx ? -1 : 1
      }
    }
  }
}
</script>

<template>
  <el-menu default-active="2" class="el-menu-vertical-demo" unique-opened>
    <el-sub-menu index="locations">
      <template #title> BUDGET </template>
      <el-menu-item key="budget">
        <el-slider
          v-model="budget"
          :step="1"
          show-stops
          :min="1"
          :max="
            updatedMaxMinVals.Budget !== undefined
              ? updatedMaxMinVals.Budget.max
              : 1
          "
          @change="computeSelectedSolution()"
        />
      </el-menu-item>

      <!-- <el-menu-item key="budget">
        <el-radio-group v-model="budget">
          <el-radio-button label="New York" value="New York" />
          <el-radio-button label="Washington" value="Washington" />
          <el-radio-button label="Los Angeles" value="Los Angeles" />
          <el-radio-button label="Chicago" value="Chicago" />
        </el-radio-group>
      </el-menu-item> -->
    </el-sub-menu>
    <el-sub-menu index="data">
      <template #title> OUTREACH </template>
      <el-menu-item key="outreach">
        <el-slider
          v-model="outreach"
          :step="0.01"
          :min="
            updatedMaxMinVals.Outreach !== undefined
              ? updatedMaxMinVals.Outreach.min
              : 1
          "
          :max="
            updatedMaxMinVals.Outreach !== undefined
              ? updatedMaxMinVals.Outreach.max
              : 1
          "
          @change="computeSelectedSolution()"
        />
      </el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="filter">
      <template #title> RECRUITMENT </template>
      <el-menu-item key="recruitment">
        <el-slider
          v-model="recruitment"
          :step="0.01"
          :min="
            updatedMaxMinVals.Recruitment !== undefined
              ? updatedMaxMinVals.Recruitment.min
              : 1
          "
          :max="
            updatedMaxMinVals.Recruitment !== undefined
              ? updatedMaxMinVals.Recruitment.max
              : 1
          "
          @change="computeSelectedSolution()"
        />
      </el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="flooding">
      <template #title> FLOODING </template>
      <el-menu-item key="flooding">
        <el-slider
          v-model="flooding"
          :step="0.01"
          :min="
            updatedMaxMinVals.Flooding !== undefined
              ? updatedMaxMinVals.Flooding.min
              : 1
          "
          :max="
            updatedMaxMinVals.Flooding !== undefined
              ? updatedMaxMinVals.Flooding.max
              : 1
          "
          @change="computeSelectedSolution()"
        />
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<style scoped>
.el-menu-vertical-demo {
  width: 300px;
  border-radius: 15px;
  position: absolute;
  z-index: 1000;
  background-color: #609f80;
  font-weight: bold;
  box-shadow: 10px 10px 35px rgba(0, 0, 0, 0.35);
  z-index: 10;
  /* overflow: hidden; */
}

.el-menu-vertical-demo :deep(.el-sub-menu:hover .el-sub-menu__title) {
  color: white;
  background-color: transparent;
}

.el-menu-item:hover {
  background-color: #4f8a6c;
}

.el-menu-item {
  font-size: 0.8rem;
  background-color: #609f80;
  color: black;
  margin: 0;
}

.slider-demo-block {
  max-width: 600px;
  display: flex;
  align-items: center;
}
.slider-demo-block .el-slider {
  margin-top: 0;
  margin-left: 12px;
}
</style>
