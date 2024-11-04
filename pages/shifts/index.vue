<template>
    <div>
        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 class="text-title-md2 font-semibold text-black">
                Shifts
            </h2>
            <div class="flex gap-2">
                <input
                type="file"
                accept=".xlsx, .xls"
                @change="handleFileUpload"
                ref="fileInput"
                class="block w-60 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <SuccessButton
                v-show="selectedFile != null"
                type="button"
                @click="submitFile"
                >
                    Import
                </SuccessButton>
                <Button
                type="button"
                :isButton="true"
                @click="addShift"
                :customClasses="['max-w-max']"
                >
                    Add Shift
                </Button>
            </div>
        </div>
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

        <EmptyData v-else :data="'Shift'"></EmptyData>

        <Modal :show="addEditModal" @close="closeModal">
            <template #header>
                {{ isEditMode ? 'Edit Shift' : 'Add Shift' }}
            </template>

            <div class="p-6">
                <InputText
                v-model="name"
                label="Shift Name"
                type="text"
                :required="true"
                />
                <div class="flex justify-around gap-5">
                    <InputText
                    v-model="timeIn"
                    label="Time in"
                    type="time"
                    :required="true"
                    class="flex-1"
                    />
                    <InputText
                    v-model="timeOut"
                    label="Time out"
                    type="time"
                    :required="true"
                    class="flex-1"
                    />
                </div>
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
                Delete shift
            </template>
            <div class="p-6">
                <h2 class="text-lg font-medium text-black">
                    Are you sure you want to delete {{ this.name }}?
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
import SuccessButton from '../../components/Buttons/SuccessButton.vue';
import Modal from '../../components/Modal.vue';
import InputText from '../../components/Forms/InputText.vue';
import EmptyData from '../../components/EmptyData.vue';

export default {
    components: {
        Table,
        Button,
        SecondaryButton,
        DangerButton,
        SuccessButton,
        Modal,
        InputText,
        EmptyData
    },
    layout: 'default',
    data() {
        return {
            from: 0,
            to: 0,
            totalItems: 0,
            totalPages: 0,
            addEditModal: false,
            isEditMode: false,
            deleteModal: false,
            itemId: '',
            name: '',
            timeIn: '',
            timeOut: '',
            myHeader: [
                'Name',
                'Shifts',
            ],
            myData: [],
            selectedFile: null,
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
        async shiftList() {
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
                .$get(`/v1/shift?${queryString}`)
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
                            Shifts: `${item.time_in} to ${item.time_out}`
                        };
                    });
                });
        },
        addShift() {
            this.addEditModal = true
        },
        closeModal() {
            this.addEditModal = false
            this.deleteModal = false
            this.itemId = '';
            this.name = '';
            this.timeIn = '';
            this.timeOut = '';
        },
        async editItem(item) {
            this.itemId = item.id;
            const response = await this.$axios.$get(`/v1/shift/${item.id}`);
            this.name = response.data.name
            this.timeIn = response.data.time_in
            this.timeOut = response.data.time_out
            this.isEditMode = true;
            this.addEditModal = true;
        },
        deleteItem(item) {
            this.itemId = item.id
            this.name= item.Name
            this.deleteModal = true
        },
        submit() {
            const data = {
                'name': this.name,
                'time_in': this.timeIn,
                'time_out': this.timeOut,
            }

            if(!this.isEditMode) {
                this.$axios
                    .$post('v1/shift/', data)
                    .then(() => {
                        this.closeModal();
                        this.$toast.success('New shift added successfully');
                        this.shiftList();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                this.$axios
                    .$put(`v1/shift/${this.itemId}`, data)
                    .then(() => {
                        this.closeModal();
                        this.$toast.success('Shift updated successfully');
                        this.shiftList();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        },
        confirmDelete(){
            this.$axios
                    .$delete(`v1/shift/${this.itemId}`)
                    .then(() => {
                        this.closeModal();
                        this.$toast.success('Shift deleted successfully');
                        this.shiftList();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
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

                const response = await this.$axios.post('/v1/import/shift', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                if(response.data.status === 201) {
                    this.$toast.success('File uploaded successfully!');
                    this.selectedFile = null;
                    this.$refs.fileInput.value = null;
                    this.shiftList();
                }
            } catch (error) {
                this.$toast.error('Error uploading file.');
                this.selectedFile = null;
                this.$refs.fileInput.value = null;
            }
        },
        setPage(page) {
            this.page = page
            this.shiftList();
        },
    },
    mounted() {
        this.shiftList();
        const clickOutsideHandler = (event) => {
            const target = this.$refs.target;
            if (target && !target.contains(event.target)) {
                this.addDepartmentModal = false
            }
        };
        document.addEventListener('click', clickOutsideHandler);
        this.$once('hook:beforeDestroy', () => {
            document.removeEventListener('click', clickOutsideHandler);
        });
     }
}
</script>
