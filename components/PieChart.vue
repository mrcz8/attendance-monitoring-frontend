<template>
    <div>
        <Chart :type="'doughnut'" :data="chartData" :options="chartOptions" />
    </div>
</template>

<script>
import { Chart } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

export default {
    components: {
        Chart,
    },
    props: {
        chartData: {
            type: Object,
            required: true,
        },
        chartOptions: {
            type: Object,
            default: () => ({}),
        },
    },
};
</script>
