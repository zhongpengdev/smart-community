<template>
  <div class="w-full bg-white dark:bg-white/5 rounded border border-slate-100 dark:border-white/5 shadow-sm p-4">
    <div class="flex flex-col md:flex-row gap-4 h-full divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-white/10">
      
      <div class="flex-1 px-4 flex flex-col justify-between h-[100px]">
        <div class="flex justify-between items-start">
          <div>
            <div class="text-xs text-slate-500 dark:text-slate-400">总访问量</div>
            <div class="text-2xl font-bold text-slate-800 dark:text-white mt-1">8,846</div>
          </div>
          <span class="text-xs text-green-500 bg-green-50 px-1.5 py-0.5 rounded">+12%</span>
        </div>
        <div ref="chart1Ref" class="w-full h-[50px]"></div>
      </div>

      <div class="flex-1 px-4 flex flex-col justify-between h-[100px]">
        <div class="flex justify-between items-start">
          <div>
            <div class="text-xs text-slate-500 dark:text-slate-400">支付笔数</div>
            <div class="text-2xl font-bold text-slate-800 dark:text-white mt-1">6,560</div>
          </div>
          <span class="text-xs text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">近7天</span>
        </div>
        <div ref="chart2Ref" class="w-full h-[50px]"></div>
      </div>

      <div class="flex-1 px-4 flex items-center justify-between h-[100px]">
        <div>
          <div class="text-xs text-slate-500 dark:text-slate-400">用户来源</div>
          <div class="text-2xl font-bold text-slate-800 dark:text-white mt-1">移动端</div>
          <div class="text-xs text-slate-400 mt-1">占比 65%</div>
        </div>
        <div ref="chart3Ref" class="w-[80px] h-[80px]"></div>
      </div>

      <div class="flex-1 px-4 flex flex-col justify-between h-[100px]">
         <div class="flex justify-between items-start">
          <div>
            <div class="text-xs text-slate-500 dark:text-slate-400">本月目标达成</div>
            <div class="text-2xl font-bold text-[#ff5000] mt-1">82%</div>
          </div>
           <Icon name="lucide:target" class="text-[#ff5000] opacity-50" />
        </div>
        <div ref="chart4Ref" class="w-full h-[50px]"></div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'

const chart1Ref = ref<HTMLElement>()
const chart2Ref = ref<HTMLElement>()
const chart3Ref = ref<HTMLElement>()
const chart4Ref = ref<HTMLElement>()

let charts: echarts.ECharts[] = []

// 通用的极简配置 (去掉坐标轴、网格等)
const baseOption = {
  grid: { top: 0, bottom: 0, left: 0, right: 0 },
  xAxis: { show: false, type: 'category' },
  yAxis: { show: false, type: 'value' },
  tooltip: { show: true, trigger: 'axis', confine: true }
}

const initCharts = () => {
  // 1. 折线图 (紫色渐变)
  if (chart1Ref.value) {
    const chart = echarts.init(chart1Ref.value)
    chart.setOption({
      ...baseOption,
      series: [{
        data: [120, 132, 101, 134, 90, 230, 210, 180, 250],
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2, color: '#8b5cf6' }, // 紫色线条
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(139, 92, 246, 0.3)' },
            { offset: 1, color: 'rgba(139, 92, 246, 0)' }
          ])
        }
      }]
    })
    charts.push(chart)
  }

  // 2. 柱状图 (蓝色)
  if (chart2Ref.value) {
    const chart = echarts.init(chart2Ref.value)
    chart.setOption({
      ...baseOption,
      tooltip: { show: true },
      series: [{
        data: [10, 52, 20, 33, 39, 33, 22],
        type: 'bar',
        barWidth: '40%',
        itemStyle: { borderRadius: 2, color: '#3b82f6' } // 蓝色
      }]
    })
    charts.push(chart)
  }

  // 3. 饼图 (多彩)
  if (chart3Ref.value) {
    const chart = echarts.init(chart3Ref.value)
    chart.setOption({
      series: [{
        name: '来源',
        type: 'pie',
        radius: ['60%', '90%'], // 甜甜圈
        avoidLabelOverlap: false,
        label: { show: false },
        labelLine: { show: false },
        data: [
          { value: 1048, name: '搜索', itemStyle: { color: '#3b82f6' } },
          { value: 735, name: '直达', itemStyle: { color: '#10b981' } },
          { value: 580, name: '营销', itemStyle: { color: '#f59e0b' } },
        ]
      }]
    })
    charts.push(chart)
  }

  // 4. 进度条 (橙色)
  // 这里用 bar chart 模拟一个单条进度条，比 gauge 更适合长条空间
  if (chart4Ref.value) {
    const chart = echarts.init(chart4Ref.value)
    chart.setOption({
      grid: { top: 15, bottom: 15, left: 0, right: 0 },
      xAxis: { show: false, type: 'value', max: 100 },
      yAxis: { show: false, type: 'category', data: ['Goal'] },
      series: [
        {
          // 背景条
          type: 'bar',
          data: [100],
          barWidth: 8,
          itemStyle: { color: '#f3f4f6', borderRadius: 4 }, // 浅灰底
          silent: true,
          barGap: '-100%' // 重叠
        },
        {
          // 实际进度
          type: 'bar',
          data: [82],
          barWidth: 8,
          itemStyle: { 
            color: '#ff5000', 
            borderRadius: 4,
            shadowBlur: 5,
            shadowColor: 'rgba(255, 80, 0, 0.4)'
          },
          label: { show: false }
        }
      ]
    })
    charts.push(chart)
  }
}

// 响应式调整
const handleResize = () => {
  charts.forEach(chart => chart.resize())
}

onMounted(() => {
  initCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  charts.forEach(chart => chart.dispose())
})
</script>