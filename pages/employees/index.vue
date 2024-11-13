<template>
    <div>
        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 class="text-title-md2 font-semibold text-black">
                Employees
            </h2>
        </div>
        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <SuccessButton
            v-if="this.myData.length > 0"
            type="button"
            :isButton="true"
            @click="generateSchedule"
            >
                <template v-if="generating">
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Generating...
                </template>
                <template v-else>
                    Generate Schedule
                </template>
            </SuccessButton>
            <Button
            type="button"
            :isButton="true"
            @click="addEmployee"
            >
                Add Employee
            </Button>
        </div>
        <isLoading v-if="isLoading" />
        <Table v-if="this.myData.length > 0"  :tableHeader="myHeader" :tableData="myData">
            <template v-slot:action-buttons="{ item }">
                <div class="flex items-center space-x-3.5">
                    <Button
                    type="button"
                    :isButton="true"
                    @click="editItem(item)"
                    >
                        Edit
                    </Button>
                    <DangerButton
                    @click="deleteItem(item)">
                    </DangerButton>
                </div>
            </template>
            <template v-slot:pagination>
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
            </template>
        </Table>

        <EmptyData v-else :data="'Employee'"></EmptyData>

        <Modal :show="addEditModal" @close="closeModal">
            <template #header>
                {{ isEditMode ? 'Edit Employee' : 'Add Employee' }}
            </template>

            <div class="p-6">
                <InputText
                v-model="name"
                label="Employee Name"
                type="text"
                :required="true"
                />
                <SelectInput
                v-model="selectedDepartment"
                label="Select Department"
                :options="departmentList"
                placeholder="Choose..."
                />
                <SelectInput
                v-model="selectedShift"
                label="Select Shift"
                :options="shiftList"
                placeholder="Choose..."
                />
            </div>

            <template #footer>
                    <SecondaryButton type="button" @click="closeModal">
                        Cancel
                    </SecondaryButton>
                    <Button
                    @click="submit"
                    type="button"
                    :isButton="true"
                    >
                        Submit
                    </Button>
            </template>
        </Modal>
        <Modal :show="deleteModal" @close="closeModal">
            <template #header>
                Delete employee
            </template>
            <div class="p-6">
                <h2 class="text-lg font-medium text-black">
                    Are you sure you want to delete this employee?
                </h2>
            </div>
            <template #footer>
                    <SecondaryButton type="button" @click="closeModal">
                        Cancel
                    </SecondaryButton>
                    <DangerButton
                        @click="confirmDelete"
                        type="button"
                        :isButton="true"
                    >
                        Delete
                    </DangerButton>
            </template>
        </Modal>
    </div>
</template>

<script>
import Table from '../../components/Table/Table.vue';
import Button from '../../components/Buttons/DefaultButton.vue';
import SecondaryButton from '../../components/Buttons/SecondaryButton.vue';
import DangerButton from '../../components/Buttons/DangerButton.vue';
import Modal from '../../components/Modal.vue';
import InputText from '../../components/Forms/InputText.vue';
import SelectInput from '../../components/Forms/SelectInput.vue';
import deptShift from '../../mixins/dept-shift';
import EmptyData from '../../components/EmptyData.vue';
import isLoading from '../../components/isLoading.vue';
import SuccessButton from '../../components/Buttons/SuccessButton.vue';

export default {
    mixins: [ deptShift ],
    components: {
        Table,
        Button,
        SecondaryButton,
        DangerButton,
        Modal,
        InputText,
        SelectInput,
        EmptyData,
        isLoading,
        SuccessButton
    },
    layout: 'default',
    data() {
        return {
            from: 0,
            to: 0,
            totalItems: 0,
            totalPages: 0,
            addEditModal: false,
            deleteModal: false,
            itemId: '',
            isEditMode: false,
            name: '',
            selectedDepartment: '',
            selectedShift: '',
            departmentList: [],
            shiftList: [],
            myHeader: [
                'Name',
                'Department',
                'Shift',
            ],
            myData: [],
            isLoading: true,
            generating: false
        };
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
    },
    watch: {
        totalPages() {
            if (this.page > this.totalPages) {
                this.setPage(1)
            }
        },
    },
    methods: {
        async employeeList() {
            this.isLoading = true;
            const query = {
                q: this.$store.state.client.q,
                page: this.$store.state.client.page,
            };
            Object.keys(query).forEach((key) => {
                if (query[key] == null) {
                delete query[key]
                }
            })
            const queryString = new URLSearchParams(query).toString()
            await this.$axios
                .$get(`/v1/employee?${queryString}`)
                .then((response) => {
                    this.totalPages = response.data.last_page;
                    this.from = response.data.from;
                    this.to = response.data.to;
                    this.totalItems = response.data.total_items;

                    const items = response.data.items;
                    this.myData = items.map(item => {
                        return {
                            id: item.id,
                            Name: item.name,
                            Department: item.department?.name,
                            Shift: item.shift?.name,
                        };
                    });
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },
        addEmployee() {
            this.addEditModal = true;
            this.retrieve().then(() => {
                this.departmentList = this.departments.map((department) => {
                    return {
                        id: department.id,
                        displayText: department.name,
                    };
                });
                this.shiftList = this.shifts.map((shift) => {
                    return {
                        id: shift.id,
                        displayText: shift.name,
                    };
                });
            });
        },
        async editItem(item) {
            this.itemId = item.id;
            this.retrieve().then(() => {
                this.departmentList = this.departments.map((department) => ({
                    id: department.id,
                    displayText: department.name,
                }));
                this.shiftList = this.shifts.map((shift) => ({
                    id: shift.id,
                    displayText: shift.name,
                }));
            });
            const response = await this.$axios.$get(`/v1/employee/${this.itemId}`);

            this.name = response.data.name;
            this.selectedDepartment = response.data.department.id;
            this.selectedShift = response.data.shift?.id;
            this.isEditMode = true;
            this.addEditModal = true;
        },
        deleteItem(item) {
            this.deleteModal = true;
            this.itemId = item.id;
        },
        confirmDelete(){
            this.$axios
                .$delete(`/v1/employee/${this.itemId}`)
                .then(() => {
                    this.closeModal()
                    this.$toast.success('Employee deleted successfully');
                    this.employeeList();
                })
                .catch((err) => {
                    console.log(err)
                });
        },
        closeModal() {
            this.addEditModal = false,
            this.deleteModal = false,
            this.isEditMode = false
            this.name = '',
            this.selectedDepartment = '',
            this.selectedShift = ''
        },
        submit() {
            const data = {
                'name': this.name,
                'deptId': this.selectedDepartment,
                'shiftId': this.selectedShift,
            }

            if(!this.isEditMode) {
                this.$axios
                    .$post('v1/employee/', data)
                    .then(() => {
                        this.closeModal()
                        this.$toast.success('New employee added successfully');
                        this.employeeList();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                this.$axios
                    .$put(`v1/employee/${this.itemId}`, data)
                    .then(() => {
                        this.closeModal()
                        this.$toast.success('Employee updated successfully');
                        this.employeeList();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        },
        generateSchedule() {
            this.generating = true;
            this.$axios
                .$post(`/v1/employee/generate`, {}, { responseType: 'blob' })
                .then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'AttSetting.xls');
                    document.body.appendChild(link);
                    link.click();
                    // this.$toast.success('Employee schedule Generated');
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    this.generating = false;
                });
        },
        setPage(page) {
            this.page = page
            this.employeeList();
        },
    },
    mounted() {
        this.employeeList();
        const clickOutsideHandler = (event) => {
            const target = this.$refs.target;
            if (target && !target.contains(event.target)) {
                this.addClientModal = false
            }
        };
        document.addEventListener('click', clickOutsideHandler);
        this.$once('hook:beforeDestroy', () => {
            document.removeEventListener('click', clickOutsideHandler);
        });
     }
}
</script>
