<template>
    <div>
        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 class="text-title-md2 font-semibold text-black">Attendance Logs</h2>
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
            <div class="flex">
                <input
                type="file"
                @change="handleFileUpload"
                ref="fileInput"
                accept=".xlsx, .xls"
                class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-200 file:text-blue-700 hover:file:bg-blue-300"
                />
                <SuccessButton
                v-show="selectedFile != null"
                type="button" @click="submitFile"
                >
                    Submit
                </SuccessButton>
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
                                        <span>{{ getAttendanceTime(employee.id, date) }}</span>
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

        <EmptyData v-else :data="'Logs'"></EmptyData>

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
            selectedFile: null,
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

        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.selectedFile = file;
            }
        },

        async submitFile() {
            if (!this.selectedFile) {
                alert('Please select a file first.');
                return;
            }

            try {
                const formData = new FormData();
                formData.append('file', this.selectedFile);

                const response = await this.$axios.post('/v1/import/logs', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if(response.data.status === 201) {
                    this.$toast.success('File uploaded successfully!');
                    this.selectedFile = null;
                    this.$refs.fileInput.value = null;
                    this.attandanceSheet();
                }
            } catch (error) {
                this.$toast.error('Error uploading file.');
                this.selectedFile = null;
                this.$refs.fileInput.value = null;
            }
        },
        formatTimeTo12Hour(time) {
            if (time === "00:00:00" || time === null) return "-";

            const [hours, minutes] = time.split(":");
            const hours12 = hours % 12 || 12;
            const ampm = hours >= 12 ? "PM" : "AM";

            return `${hours12}:${minutes} ${ampm}`;
        },
        getAttendanceTimeIn(empId, date) {
            const attendance = this.employees
                .find(emp => emp.id === empId)
                ?.attendance_records.find(record => record.date === date);

            if (attendance) {
                const timeIn = attendance.time_in;
                return this.formatTimeTo12Hour(timeIn);
            }
            return "-";
        },

        getAttendanceTimeOut(empId, date) {
            const attendance = this.employees
                .find(emp => emp.id === empId)
                ?.attendance_records.find(record => record.date === date);

            if (attendance) {
                const timeOut = attendance.time_out;
                return this.formatTimeTo12Hour(timeOut);
            }
            return "-";
        },

        getAttendanceTime(empId, date) {
            const timeIn = this.getAttendanceTimeIn(empId, date);
            const timeOut = this.getAttendanceTimeOut(empId, date);

            return `${timeIn} | ${timeOut}`;
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