<template>
    <div>
        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 class="text-title-md2 font-semibold text-black">
                Departments
            </h2>
            <Button
            type="button"
            :isButton="true"
            @click="addDepartment"
            >
                Add Department
            </Button>
        </div>
        <isLoading v-if="isLoading" />
        <Table v-if="this.myData.length > 0" :tableHeader="myHeader" :tableData="myData">
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

        <EmptyData v-else :data="'Department'"></EmptyData>

        <Modal :show="addEditModal" @close="closeModal">
            <template #header>
                {{ isEditMode ? 'Edit Department' : 'Add Department' }}
            </template>

            <div class="p-6">
                <InputText
                v-model="name"
                label="Department Name"
                type="text"
                :required="true"
                />
                <MultiSelectDropDown
                v-model="selectedShift"
                label="Select Shift"
                :options="optionsList"
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
                    label="Submit"
                    :isButton="true"
                    >
                        Submit
                    </Button>
            </template>
        </Modal>
        <Modal :show="deleteModal" @close="closeModal">
            <template #header>
                Delete department
            </template>
            <div class="p-6">
                <h2 class="text-lg font-medium text-black">
                    Are you sure you want to delete this department?
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
import MultiSelectDropDown from '../../components/Forms/MultiSelectDropDown.vue';
import EmptyData from '../../components/EmptyData.vue';
import isLoading from '../../components/isLoading.vue';

export default {
    components: {
        Table,
        Button,
        SecondaryButton,
        DangerButton,
        Modal,
        InputText,
        MultiSelectDropDown,
        EmptyData,
        isLoading
    },
    layout: 'default',
    data() {
        return {
            from: 0,
            to: 0,
            totalItems: 0,
            totalPages: 0,
            addEditModal: false,
            name: '',
            selectedShift: [],
            myHeader: [
                'Name',
                'Shifts',
            ],
            myData: [],
            optionsList: [],
            isEditMode: false,
            deleteModal: false,
            itemId: '',
            isLoading: true,
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
        async departmentList() {
            this.isLoading = true;
            const query = {
                q: this.$store.state.client.q,
                page: this.$store.state.pagination.page,
            };
            Object.keys(query).forEach((key) => {
                if (query[key] == null) {
                delete query[key]
                }
            })
            const queryString = new URLSearchParams(query).toString()
            await this.$axios
                .$get(`/v1/department?${queryString}`)
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
                            Shifts: item.shifts.map(shift =>
                                `${shift.name} - ${shift.time_in} to ${shift.time_out}`
                            ).join('<br>')
                        };
                    });
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },
        async shiftList() {
            const query = {
                q: '',
                page: '',
            };
            Object.keys(query).forEach((key) => {
                if (query[key] == null) {
                delete query[key];
                }
            });
            const queryString = new URLSearchParams(query).toString();
            await this.$axios
                .$get(`/v1/shift?${queryString}`)
                .then((response) => {
                    const items = response.data.items;
                    this.optionsList = items.map((item) => {
                        return {
                            id: item.id,
                            displayText: `${item.name} (${item.time_in} - ${item.time_out})`,
                        };
                    });
                });
        },
        addDepartment() {
            this.isEditMode = false,
            this.addEditModal = true
            this.shiftList();
        },
        closeModal() {
            this.addEditModal = false
            this.isEditMode = false;
            this.deleteModal = false;
            this.name = '';
            this.selectedShift = [];
        },
        async editItem(item) {
            this.clientId = item.id;
            const response = await this.$axios.$get(`/v1/department/${item.id}`);
            const department = response.data;
            this.name = department.name;
            this.selectedShift = department.shifts.map(shift => ({
                id: shift.id,
                displayText: `${shift.name} (${shift.time_in} - ${shift.time_out})`
            }));
            await this.shiftList();
            this.isEditMode = true;
            this.addEditModal = true;
        },
        deleteItem(item) {
            this.deleteModal = true;
            this.itemId = item.id;
        },
        async confirmDelete(){
            await this.$axios
                .$delete(`/v1/department/${this.itemId}`)
                .then(() => {
                    this.closeModal()
                    this.$toast.success('Department deleted successfully');
                    this.departmentList();
                })
                .catch((err) => {
                    console.log(err)
                });
        },
        submit() {
            const data = {
                'name': this.name,
                'shifts': this.selectedShift.map(item => item.id),
            }
            if(!this.isEditMode) {
                this.$axios
                    .$post('v1/department/', data)
                    .then(() => {
                        this.closeModal()
                        this.$toast.success('New department added successfully');
                        this.departmentList();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                this.$axios
                    .$put(`v1/department/${this.clientId}`, data)
                    .then(() => {
                        this.closeModal()
                        this.$toast.success('Department updated successfully');
                        this.departmentList();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        },
        setPage(page) {
            this.page = page
            this.departmentList();
        },
    },
    mounted() {
        this.departmentList();
        const clickOutsideHandler = (event) => {
            const target = this.$refs.target;
            if (target && !target.contains(event.target)) {
                this.closeModal()
            }
        };
        document.addEventListener('click', clickOutsideHandler);
        this.$once('hook:beforeDestroy', () => {
            document.removeEventListener('click', clickOutsideHandler);
        });
     }
}
</script>
