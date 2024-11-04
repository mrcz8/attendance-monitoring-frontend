<template>
    <div>
        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 class="text-title-md2 font-semibold text-black">
                License Keys
            </h2>
            <Button
            type="button"
            :isButton="true"
            @click="generateLicense"
            >
                Generate License
            </Button>
        </div>
        <Table :tableHeader="myHeader" :tableData="myData">
            <template v-slot:action-buttons="{ item }">
                <div class="items-center space-x-3.5 relative">
                    <Danger
                        @click="deleteItem(item)"
                        type="button"
                        :isButton="true"
                    >
                        Delete
                    </Danger>
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
        <Modal :show="deleteModal" @close="closeModal">
            <template #header>
                Delete License
            </template>
            <div class="p-6">
                <h2 class="text-lg font-medium text-black">
                    Are you sure you want to delete this license?
                </h2>
            </div>
            <template #footer>
                    <SecondaryButton type="button" @click="closeModal">
                        Cancel
                    </SecondaryButton>
                    <Danger
                        @click="confirmDelete"
                        type="button"
                        :isButton="true"
                    >
                        Delete
                    </Danger>
            </template>
        </Modal>
    </div>
</template>

<script>
import Table from '../../components/Table/Table.vue';
import Button from '../../components/Buttons/DefaultButton.vue';
import Danger from '../../components/Buttons/DangerButton.vue';
import SecondaryButton from '../../components/Buttons/SecondaryButton.vue';
import SuccessButton from '../../components/Buttons/SuccessButton.vue';
import DropDownButton from '../../components/Buttons/DropDownButton.vue';
import Modal from '../../components/Modal.vue';
import Pagination from '../../components/Pagination/Pagination.vue';

export default {
    components: {
        Table,
        Button,
        Danger,
        SecondaryButton,
        SuccessButton,
        DropDownButton,
        Modal,
        Pagination
    },
    layout: 'default',
    data() {
        return {
            from: 0,
            to: 0,
            totalItems: 0,
            totalPages: 0,
            deleteModal: false,
            itemId: null,
            myHeader: [
                'License Key',
                'Status',
            ],
            myData: [],
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
        async licenseList() {
            const query = {
                page: this.$store.state.pagination.page,
            };
            Object.keys(query).forEach((key) => {
                if (query[key] == null) {
                delete query[key]
                }
            })
            const queryString = new URLSearchParams(query).toString()
            await this.$axios
                .$get(`/v1/license?${queryString}`)
                .then((response) => {
                    this.totalPages = response.data.last_page;
                    this.from = response.data.from;
                    this.to = response.data.to;
                    this.totalItems = response.data.total_items;

                    const items = response.data.items;
                    this.myData = items.map(item => {
                        const isTaken = item.user_id !== null;
                        return {
                            id: item.id,
                            'License Key': item.key,
                            Status: isTaken ? 'Not available' : 'Available',
                            StatusClass: isTaken
                            ? 'bg-danger text-white rounded-2xl flex justify-center items-center w-40 px-2 py-1'
                            : 'bg-success text-white rounded-2xl flex justify-center items-center w-30 px-2 py-1',
                        };
                    });
                });
        },
        async generateLicense(){
            await this.$axios
                .$post(`/v1/license`)
                .then(() => {
                    this.closeModal();
                    this.$toast.success('New license generated');
                    this.licenseList();
                })
                .catch((err) => {
                    this.$toast.error('Failed to generate license');
                });
        },
        deleteItem(item) {
            this.deleteModal = true;
            this.itemId = item.id;
        },
        async confirmDelete(){
            await this.$axios
                .$delete(`/v1/license/${this.itemId}`)
                .then(() => {
                    this.closeModal();
                    this.$toast.success('License deleted successfully');
                    this.licenseList();
                })
                .catch((err) => {
                    this.$toast.info('This license key is associated with a client and cannot be deleted.');
                });
        },
        closeModal() {
            this.deleteModal = false;
            this.itemId = '';
        },
        setPage(page) {
            this.page = page
            this.licenseList();
        },
    },
    mounted() {
        this.licenseList();
        const clickOutsideHandler = (event) => {
            const target = this.$refs.target;
            if (target && !target.contains(event.target)) {
                this.modal = false
            }
        };
        document.addEventListener('click', clickOutsideHandler);
        this.$once('hook:beforeDestroy', () => {
            document.removeEventListener('click', clickOutsideHandler);
        });
     }
}
</script>
