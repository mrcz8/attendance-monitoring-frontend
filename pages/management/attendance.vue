<template>
    <div>
        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 class="text-title-md2 font-semibold text-black">Attendance</h2>
        </div>
        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex gap-3">
                <SelectInput
                v-model="filterMonth"
                :options="monthList"
                placeholder="Filter Month"
                :customClasses="['bg-blue-200', 'placeholder-blue-700', 'text-sm', 'font-semibold', 'py-2', 'hover:bg-blue-300']"
                ></SelectInput>

                <SelectInput
                v-model="filterYear"
                :options="yearOptions"
                placeholder="Filter Year"
                :customClasses="['bg-blue-200', 'placeholder-blue-700', 'text-sm', 'font-semibold', 'py-2', 'hover:bg-blue-300']"
                ></SelectInput>
            </div>
        </div>
        <div v-if="hasAttendanceRecords" class="card rounded-md border border-stroke bg-white shadow-md">
            <div class="card-body p-5">
                <div class="overflow-x-auto">
                    <table class="min-w-full border-collapse border border-gray-300" id="printTable">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="border border-gray-300 px-4 py-2 text-left">Employee Name</th>
                            <th class="border border-gray-300 px-4 py-2 text-left">Department</th>
                            <th
                                v-for="date in dates"
                                :key="date"
                                class="border border-gray-300 px-4 py-2 text-center whitespace-nowrap"
                            >
                                {{ date }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="employee in employees" :key="employee.id">
                            <td class="border border-gray-300 px-4 py-2">{{ employee.name }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ employee.department?.name }}</td>
                            <td
                                v-for="date in dates"
                                :key="date"
                                class="border border-gray-300 px-4 py-2 text-center whitespace-nowrap"
                            >
                                <div class="flex justify-center">
                                    <div class="form-check form-check-inline text-xs">
                                        <div v-if="isEmployeeLate(employee.id, date)" class="flex items-center justify-center space-x-1">
                                            <div
                                                class="w-2 h-2 rounded-full bg-dangerHover">
                                            </div>
                                            <p>
                                            {{ late(employee.id, date) === 0
                                                ? late(employee.id, date)
                                                : `${late(employee.id, date)} min. late`
                                            }}
                                            </p>
                                        </div>
                                        <div v-if="isEmployeeUnderTime(employee.id, date)" class="flex items-center justify-center space-x-1">
                                            <div
                                                class="w-2 h-2 rounded-full bg-info">
                                            </div>
                                            <p>
                                            {{ underTime(employee.id, date) === 0
                                                ? underTime(employee.id, date)
                                                : `${underTime(employee.id, date)} min. undertime`
                                            }}
                                            </p>
                                        </div>
                                        <div v-if="!isEmployeeLate(employee.id, date) && !isEmployeeUnderTime(employee.id, date) && !isAbsent(employee.id, date)"
                                            class="flex items-center justify-center space-x-1">
                                            <div
                                                class="w-2 h-2 rounded-full bg-success">
                                            </div>
                                            <p>on time</p>
                                        </div>
                                        <div v-if="isAbsent(employee.id, date)" class="flex items-center justify-center space-x-1">
                                            <div
                                                class="w-2 h-2 rounded-full bg-danger">
                                            </div>
                                            <p>absent</p>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    </table>
                </div>
                <div class="min-w-[120px] w-full py-2 pl-9 px-10 flex flex-wrap items-center justify-around gap-x-2 lg:justify-between">
                    <span class="text-base leading-[2.5em] text-black">
                        Showing {{ from }}-{{ to }} of {{ totalItems }} results
                    </span>
                    <Pagination
                        :active-page="page"
                        :total-pages="totalPages"
                        @change="setPage"
                    />
                </div>
            </div>
        </div>

        <EmptyData v-else :data="'Data'"></EmptyData>

    </div>
</template>

<script>
import SuccessButton from '../../components/Buttons/SuccessButton.vue';
import InputText from '../../components/Forms/InputText.vue';
import EmptyData from '../../components/EmptyData.vue';
import SelectInput from '../../components/Forms/SelectInput.vue';

export default {
    components: {
        SuccessButton,
        InputText,
        EmptyData,
        SelectInput
    },
    layout: 'default',
    data() {
        return {
            from: 0,
            to: 0,
            totalItems: 0,
            totalPages: 0,
            employees: [],
            dates: [],
            filterMonth: '',
            filterYear: '',
            month: [
                { value: 1, text: 'January' },
                { value: 2, text: 'February' },
                { value: 3, text: 'March' },
                { value: 4, text: 'April' },
                { value: 5, text: 'May' },
                { value: 6, text: 'June' },
                { value: 7, text: 'July' },
                { value: 8, text: 'August' },
                { value: 9, text: 'September' },
                { value: 10, text: 'October' },
                { value: 11, text: 'November' },
                { value: 12, text: 'December' },
            ],
        };
    },
    mounted() {
        this.attandanceSheet();
    },
    computed: {
        page: {
            get() {
                return this.$store.state.pagination.page
            },
            set(value) {
                this.$store.commit('pagination/setPage', value)
            },
        },
        monthList() {
            return this.month.map(({ value, text }) => ({
                id: value,
                displayText: text,
            }));
        },
        yearOptions() {
            const currentYear = new Date().getFullYear();
            return Array.from({ length: 6 }, (_, i) => ({
                id: currentYear - i,
                displayText: `${currentYear - i}`,
            }));
        },
        hasAttendanceRecords() {
            return this.employees.some(employee => employee.attendance_records && employee.attendance_records.length > 0);
        },
    },
    methods: {
        async attandanceSheet(){
            const query = {
                month: this.filterMonth,
                year: this.filterYear,
                page: this.$store.state.pagination.page,
            };
            Object.keys(query).forEach((key) => {
                if (query[key] == null) {
                delete query[key]
                }
            })
            const queryString = new URLSearchParams(query).toString()

            await this.$axios
                .$get(`/v1/attendance/logs?${queryString}`)
                .then((response) => {
                    this.from = response.data.from;
                    this.to = response.data.to;
                    this.totalItems = response.data.total_items;
                    this.totalPages = response.data.last_page;
                    const data = response.data.items;

                    this.employees = data;
                    const datesSet = new Set();
                    data.forEach(employee => {
                        employee.attendance_records.forEach(record => {
                            datesSet.add(record.date);
                        });
                    });

                    this.dates = Array.from(datesSet).sort();
                });
        },

        initializeMonthOptions() {
            this.monthList = this.month.map((m) => ({
                    id: m.value,
                    displayText: m.text,
                }));
        },

        initializeYearOptions() {
            const currentYear = new Date().getFullYear();
            this.yearOptions = [];
            for (let i = 0; i < 6; i++) {
                this.yearOptions.push({
                    id: currentYear - i,
                    displayText: `${currentYear - i}`
                });
            }
        },

        isEmployeeLate(empId, date) {
            const attendance = this.employees
                .find(emp => emp.id === empId)
                ?.attendance_records.find(record => record.date === date);

            return attendance ? attendance.isLate : false;
        },

        late(empId, date) {
            const timeIn = this.getLateDuration(empId, date);
            return timeIn;
        },

        getLateDuration(empId, date) {
            const attendance = this.employees
                .find(emp => emp.id === empId)
                ?.attendance_records.find(record => record.date === date);

            if (attendance) {
                const timeIn = attendance.lateDuration;
                return timeIn;
            }
            return "-";
        },

        isEmployeeUnderTime(empId, date) {
            const attendance = this.employees
                .find(emp => emp.id === empId)
                ?.attendance_records.find(record => record.date === date);

            return attendance ? attendance.isUnderTime : false;
        },

        underTime(empId, date) {
            const timerOut = this.getUnderTimeDuration(empId, date);
            return timerOut;
        },

        getUnderTimeDuration(empId, date) {
            const attendance = this.employees
                .find(emp => emp.id === empId)
                ?.attendance_records.find(record => record.date === date);

            if (attendance) {
                const timeOut = attendance.undertimeDuration;
                return timeOut;
            }
            return "-";
        },

        isAbsent(empId, date) {
            const attendance = this.employees
                .find(emp => emp.id === empId)
                ?.attendance_records.find(record => record.date === date);

            return attendance ? attendance.isAbsent : false;
        },


        setPage(page) {
            this.page = page
            this.attandanceSheet();
        },
    },
    watch: {
        totalPages() {
            if (this.page > this.totalPages) {
                this.setPage(1)
            }
        },

        filterMonth() {
            this.attandanceSheet();
        },

        filterYear() {
            this.attandanceSheet();
        }
    },
}
</script>