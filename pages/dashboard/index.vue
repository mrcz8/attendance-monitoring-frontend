<template>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <div class="bg-white shadow-md rounded-lg p-6">
            <h1>Month Summary</h1>
            <div class="flex justify-center items-center">
                <PieChart
                    :chart-data="monthlyChart"
                    :chart-options="chartOptions"
                    class="h-64 w-64"
                />
            </div>
        </div>
        <div class="bg-white shadow-md rounded-lg p-6">
            <h1>On Time Today</h1>
            <div class="flex justify-center items-center">
                <PieChart
                    :chart-data="onTimeToday"
                    :chart-options="chartOptions"
                    class="h-64 w-64"
                />
            </div>
        </div>
        <div class="bg-white shadow-md rounded-lg p-6">
            <h1>Late Today</h1>
            <div class="flex justify-center items-center">
                <PieChart
                    :chart-data="lateToday"
                    :chart-options="chartOptions"
                    class="h-64 w-64"
                />
            </div>
        </div>
    </div>
</template>

<script>
import PieChart from '~/components/PieChart.vue';

export default {
    components: {
        PieChart,
    },
    data() {
        return {
            monthlyChart: {
                labels: ['On Time', 'Late', 'Undertime', 'Absent'],
                datasets: [
                    {
                        data: [0, 0, 0, 0],
                        backgroundColor: ['#3C50E0', '#6577F3', '#8FD0EF', '#0FADCF'],
                        hoverOffset: 2,
                    },
                ],
            },
            onTimeToday: {
                labels: ['On Time', 'Total Employee'],
                datasets: [
                    {
                        data: [0, 0, 0, 0],
                        backgroundColor: ['#3C50E0', '#EFF4FB'],
                        hoverOffset: 2,
                    },
                ],
            },
            lateToday: {
                labels: ['Late', 'Total Employee'],
                datasets: [
                    {
                        data: [0, 0, 0, 0],
                        backgroundColor: ['#e53935', '#EFF4FB'],
                        hoverOffset: 2,
                    },
                ],
            },
            chartOptions: {
                responsive: true,
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        align: 'start',
                        labels: {
                            boxWidth: 15,
                            padding: 10,
                            usePointStyle: true,
                        },
                    },
                },
                layout: {
                    padding: {
                        top: 20,
                        bottom: 20,
                    },
                },
            },
        };
    },
    mounted() {
        this.fetchAttendanceSummary();
    },
    methods: {
        async fetchAttendanceSummary() {
            try {
                const response = await this.$axios.$get('/v1/attendance/summary');

                const monthly = response.monthlySummary;
                const daily = response.dailySummary;
                console.log(response)
                this.monthlyChart = {
                    labels: ['On Time', 'Late', 'Undertime', 'Absent'],
                    datasets: [
                        {
                            data: [
                                monthly.onTime,
                                monthly.late,
                                monthly.undertime,
                                monthly.absent,
                            ],
                            backgroundColor: ['#33d277', '#f87171', '#00e4f8', '#e53935'],
                            hoverOffset: 4,
                        },
                    ],
                };

                this.onTimeToday = {
                    labels: ['On Time', 'Total Employee',],
                    datasets: [
                        {
                            data: [
                                daily.onTime,
                                daily.totalEmployee,
                            ],
                            backgroundColor: ['#33d277', '#F5F7FD'],
                            hoverOffset: 4,
                        },
                    ],
                };

                this.lateToday = {
                    labels: ['Late', 'Total Employee',],
                    datasets: [
                        {
                            data: [
                                daily.late,
                                daily.totalEmployee,
                            ],
                            backgroundColor: ['#e53935', '#F5F7FD'],
                            hoverOffset: 4,
                        },
                    ],
                };
            } catch (error) {
                console.error('Error fetching attendance summary:', error);
            }
        },
    },
};
</script>

<style scoped>
.card {
    border: 1px solid #ddd;
    border-radius: 0.375rem;
    padding: 1rem;
    background-color: white;
}

.card-header h1 {
    font-size: 1.25rem;
    font-weight: 600;
}

.card-body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 250px;
}

.doughnut-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
