<template>
    <div>
        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 class="text-title-md2 font-semibold text-black">
                Clients
            </h2>
            <Button
            type="button"
            :isButton="true"
            @click="addClient"
            >
                Add Client
            </Button>
        </div>
        <Table :tableHeader="myHeader" :tableData="myData" :editItem="editItem" :deactivateItem="deactivateItem">
            <template v-slot:action-buttons="{ item }">
                <div class="items-center space-x-3.5 relative">
                    <DropDownButton label="Action">
                        <button @click="editItem(item)" class="hover:bg-gray-3 hover:text-primary text-black w-full text-left rounded-md px-2 py-1">
                        Edit
                        </button>
                        <button @click="deactivateItem(item)" class="hover:bg-gray-2 hover:text-danger text-black w-full text-left rounded-md px-2 py-1">
                        Deactivate
                        </button>
                        <button @click="restoreItem(item)" class="hover:bg-gray-2 hover:text-success text-black w-full text-left rounded-md px-2 py-1">
                        Restore
                        </button>
                        <button @click="deleteItem(item)" class="hover:bg-gray-2 hover:text-danger text-black w-full text-left rounded-md px-2 py-1">
                        Delete
                        </button>
                    </DropDownButton>
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
        <Modal :show="modal" @close="closeModal">
            <template #header>
                {{ isEditMode ? 'Edit Client' : 'Add Client' }}
            </template>
            <form action="" @submit.prevent="submit">
                <div class="p-6">
                    <InputText
                        v-model="clientName"
                        label="Client Name"
                        type="text"
                        :required="true"
                    />
                    <InputText
                        v-model="clientEmail"
                        label="Email Address"
                        type="email"
                        :required="true"
                    />
                    <InputText
                        v-if="!isEditMode"
                        v-model="clientPassword"
                        label="Client Password"
                        type="password"
                        :required="true"
                    />
                </div>
            </form>
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
        <Modal :show="deacOrDeleteModal" @close="closeModal">
            <template #header>
                {{ isForceDelete ? 'Delete Client' : 'Deactivate Client' }}
            </template>
            <div class="p-6">
                <h2 class="text-lg font-medium text-black">
                    Are you sure you want to {{ isForceDelete ? 'delete' : 'deactivate' }} {{ clientName }}?
                </h2>

                <p class="mt-1 text-sm text-black">
                    {{ isForceDelete
                        ? 'Once a client is deleted, all related data will be permanently removed from the system.'
                        : 'Please be advised that once a client is deactivated, they will no longer have access to this system.'
                    }}
                </p>
            </div>
            <template #footer>
                    <SecondaryButton type="button" @click="closeModal">
                        Cancel
                    </SecondaryButton>
                    <Danger
                        @click="confirmDeacOrDelete"
                        type="button"
                        :isButton="true"
                    >
                        {{ isForceDelete ? 'Delete' : 'Deactivate' }}
                    </Danger>
            </template>
        </Modal>
        <Modal :show="restoreModal" @close="closeModal">
            <template #header>
                Restore Client
            </template>
            <div class="p-6">
                <h2 class="text-lg font-medium text-black">
                    Are you sure you want to Restore {{ clientName }}?
                </h2>
            </div>
            <template #footer>
                    <SecondaryButton type="button" @click="closeModal">
                        Cancel
                    </SecondaryButton>
                    <SuccessButton
                        @click="confirmRestore"
                        type="button"
                        :isButton="true"
                    >
                        Restore
                    </SuccessButton>
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
import InputText from '../../components/Forms/InputText.vue';
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
        InputText,
        Pagination
    },
    layout: 'default',
    data() {
        return {
            from: 0,
            to: 0,
            totalItems: 0,
            totalPages: 0,
            modal: false,
            deacOrDeleteModal: false,
            restoreModal: false,
            isEditMode: false,
            isForceDelete: false,
            clientId: null,
            clientName: '',
            clientEmail: '',
            clientPassword: '',
            myHeader: [
                'Name',
                'Email',
                'License Key',
                'Status',
            ],
            myData: [],
        };
    },
    computed: {
        page: {
            get() {
                return this.$store.state.client.page
            },
            set(value) {
                this.$store.commit('client/setPage', value)
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
        async clientList() {
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
                .$get(`/v1/client?${queryString}`)
                .then((response) => {
                    this.totalPages = response.data.last_page;
                    this.from = response.data.from;
                    this.to = response.data.to;
                    this.totalItems = response.data.total_items;

                    const items = response.data.items;
                    this.myData = items.map(item => {
                        const isActive = item.deleted_at === null && item.license_key !== null;
                        const key = item.license_key ? item.license_key.key : '';
                        return {
                            id: item.id,
                            Name: item.name,
                            Email: item.email,
                            'License Key': key,
                            Status: isActive ? 'Active' : 'Inactive',
                            StatusClass: isActive
                            ? 'bg-success text-white rounded-2xl flex justify-center items-center w-25 px-2 py-1'
                            : 'bg-danger text-white rounded-2xl flex justify-center items-center w-25 px-2 py-1',
                        };
                    });
                });
        },
        addClient() {
            this.isEditMode = false;
            this.modal = true;
        },
        closeModal() {
            this.modal = false
            this.isEditMode = false;
            this.deacOrDeleteModal = false;
            this.restoreModal = false;
            this.clientId = '';
            this.clientName = '';
            this.clientEmail = '';
            this.clientPassword = '';
        },
        submit() {
            const data = {
                name: this.clientName,
                email: this.clientEmail,
            };

            if (!this.isEditMode) {
                data.password = this.clientPassword;
                this.$axios
                    .$post('v1/client/', data)
                    .then(() => {
                        this.closeModal()
                        this.$toast.success('New client added successfully');
                        this.clientList();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                this.$axios
                    .$put(`v1/client/${this.clientId}`, data)
                    .then(() => {
                        this.closeModal()
                        this.$toast.success('Client updated successfully');
                        this.clientList();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        },
        editItem(item) {
            this.isEditMode = true;
            this.clientId = item.id;
            this.clientName = item.Name;
            this.clientEmail = item.Email;
            this.modal = true;
        },
        deactivateItem(item) {
            this.isForceDelete = false;
            this.clientId = item.id;
            this.clientName = item.Name;
            this.deacOrDeleteModal = true
        },
        deleteItem(item) {
            this.isForceDelete = true;
            this.clientId = item.id;
            this.clientName = item.Name;
            this.deacOrDeleteModal = true
        },
        confirmDeacOrDelete(item) {
            if(!this.isForceDelete) {
                this.$axios
                .$delete(`v1/client/deactivate/${this.clientId}`)
                .then(() => {
                    this.closeModal()
                    this.$toast.success('Client deactivated successfully');
                    this.clientList();
                })
                .catch((err) => {
                    this.$toast.error('Failed to deactivate client');
                });
            } else {
                this.$axios
                .$delete(`v1/client/delete/${this.clientId}`)
                .then(() => {
                    this.closeModal()
                    this.$toast.success('Client deleted successfully');
                    this.clientList();
                })
                .catch((err) => {
                    this.$toast.error('Failed to delete client');
                });
            }
        },
        restoreItem(item) {
            this.clientId = item.id;
            this.clientName = item.Name;
            this.restoreModal = true;
        },
        confirmRestore(item) {
            this.$axios
                .$delete(`v1/client/restore/${this.clientId}`)
                .then(() => {
                    this.closeModal()
                    this.$toast.success('Client restore successfully');
                    this.clientList();
                })
                .catch((err) => {
                    this.$toast.error('Failed to restore client');
                });
        },
        setPage(page) {
            this.page = page
            this.clientList();
        },
    },
    mounted() {
        this.clientList();
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
