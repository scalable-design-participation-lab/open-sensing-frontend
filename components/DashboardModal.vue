<template>
    <div ref="chart" class="chart-container" @click.self="closeModal">
        <button class="close-btn" @click="closeModal">X</button>
        <FloatingNav />
        <div class="scroll-container"></div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import * as d3 from 'd3';

const chart = ref(null);

const drawChart = async () => {
    const data = await d3.csv('/sensorData.csv', d => {
        d.timestamp = d3.timeParse("%Y-%m-%d %H:%M:%S")(d.timestamp);
        return d;
    });

    const containerWidth = chart.value.clientWidth;
    const svgHeight = 300;

    const existingDatasets = ['temperature', 'relative_humidity', 'voc', 'nox', 'pm1', 'pm25', 'pm4', 'pm10'];
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    existingDatasets.forEach((metric, index) => {
        const margin = { top: 40, right: 40, bottom: 60, left: 40 },
            width = containerWidth - margin.left - margin.right,
            height = svgHeight - margin.top - margin.bottom;

        const svgContainer = d3.select(chart.value).select(".scroll-container").append("div")
            .style("margin-bottom", "10px")
            .append("svg")
            .attr("width", containerWidth)
            .attr("height", svgHeight)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Chart title
        svgContainer.append("text")
            .attr("x", 0)
            .attr("y", -10)
            .attr("text-anchor", "start")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text(metric.toUpperCase());

        const x = d3.scaleTime()
            .domain(d3.extent(data, d => d.timestamp))
            .range([0, width]);
        svgContainer.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => +d[metric])])
            .range([height, 0]);
        svgContainer.append("g")
            .call(d3.axisLeft(y));

        svgContainer.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#609F80")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(d => x(d.timestamp))
                .y(d => +d[metric]));
    });
};

onMounted(() => {
    drawChart();
});

const props = defineProps(['visible']);
const emit = defineEmits(['close']);

const closeModal = () => {
    emit('close');
};
</script>

<style scoped>
.chart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 53%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 95%;
    height: 85%;
    background-color: white;
    border-radius: 15px;
    box-shadow: 10px 10px 35px rgba(0, 0, 0, 0.35);
    z-index: 10;
    overflow: hidden;
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    border: none;
    font-size: 15px;
    font-weight: bold;
    color: lightgray;
    cursor: pointer;
}

.close-btn:hover {
    color: #609F80;
}

.scroll-container {
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    overflow-x: hidden;
    width: calc(100% - 320px);
    height: 95%;
    padding: 5px;
    margin-left: 300px;
    margin-top: 50px;
    margin-bottom: 30px;
}

.scroll-container::-webkit-scrollbar {
    width: 10px;
    background-color: transparent;
}

.scroll-container::-webkit-scrollbar-thumb {
    background-color: #609F80;
    border-radius: 10px;
    border: 1px solid transparent;
    background-clip: padding-box;
}

.scroll-container::-webkit-scrollbar-button {
    display: none;
}

svg {
    pointer-events: auto;
}
</style>