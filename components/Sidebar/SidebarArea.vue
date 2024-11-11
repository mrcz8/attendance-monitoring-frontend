<template>
    <aside class="absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear lg:static lg:translate-x-0"
        :class="{
            'translate-x-0': sidebarStore.isSidebarOpen,
            '-translate-x-full': !sidebarStore.isSidebarOpen
        }"
        ref="target"
    >
        <!-- SIDEBAR HEADER -->
        <div class="flex items-center justify-end gap-2 px-6 py-5.5 lg:py-6.5">
            <button class="block lg:hidden"  @click="toggleSidebar()">
                <svg
                class="fill-current text-whiter"
                width="20"
                height="18"
                viewBox="0 0 20 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                >
                <path
                    d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                    fill=""
                />
                </svg>
            </button>
        </div>
        <!-- SIDEBAR HEADER -->

        <div class="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
            <!-- SIDEBAR MENU -->
            <nav  v-for="menuGroup in menuGroups" :key="menuGroup.name" class="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
                <template>
                    <div>
                        <h3 class="mb-4 ml-4 text-sm font-medium text-bodydark2">{{ menuGroup.name }}</h3>
                        <ul class="mb-6 flex flex-col gap-1.5">
                            <SidebarItem
                                v-for="(menuItem, index) in menuGroup.menuItems"
                                :item="menuItem"
                                :key="index"
                                :index="index"
                            />
                        </ul>
                    </div>
                </template>
            </nav>
            <!-- SIDEBAR MENU -->
        </div>
    </aside>
</template>


<script>
import SidebarItem from './SidebarItem.vue';

export default {
    components: {
        SidebarItem
    },
    data() {
        return {
            role: '',
            menuGroups: [{
                name: 'MENU',
                menuItems: this.getMenuItems()
            }]
        };
    },
    computed: {
        userRole() {
            return this.$store.state.auth.user ? this.$store.state.auth.user.role : null;
        },
        sidebarStore() {
            return this.$store.state.sidebar
        },
        menuItems() {
            return this.getMenuItems();
        }
    },
    methods: {
        toggleSidebar() {
            this.$store.commit('sidebar/toggleSidebar');
        },
        getMenuItems(){
            const items = [];

            if(this.userRole === 'super_admin') {
                items.push(
                    {
                        icon: '',
                        label: 'Dashboard',
                        route: '/admin',
                        children: [
                            {
                                label: 'Clients',
                                route: '/admin/clients',
                                icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                                </svg>
                                `,
                            },
                            {
                                label: 'License Key',
                                route: '/admin/license-key',
                                icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="size-6">
                                    <path fill="currentColor" d="M10.32 2.013A4 4 0 0 0 6.162 7.13l-3.987 3.986a.6.6 0 0 0-.176.424v2.86a.6.6 0 0 0 .6.6h2.8a.6.6 0 0 0 .6-.6V13h1.9a.6.6 0 0 0 .6-.6v-1.693l.735-.735a5.5 5.5 0 0 1-.569-.846l-.99.991a.6.6 0 0 0-.176.424V12H5.6a.6.6 0 0 0-.6.6V14H3v-2.293l4.32-4.32l-.118-.303a3 3 0 0 1 1.96-3.965c.33-.423.72-.796 1.157-1.106M13.5 6.25a.75.75 0 1 0 0-1.5a.75.75 0 0 0 0 1.5M9 6.5a4.5 4.5 0 1 1 7 3.742v2.05l.783.784a.6.6 0 0 1 0 .848L15.707 15l1.068 1.067a.6.6 0 0 1-.05.893l-2.35 1.88a.6.6 0 0 1-.75 0l-2.4-1.92a.6.6 0 0 1-.225-.468v-6.21A4.5 4.5 0 0 1 9 6.5M13.5 3a3.5 3.5 0 0 0-1.75 6.532a.5.5 0 0 1 .25.433v6.295l2 1.6l1.751-1.401l-1.034-1.035a.6.6 0 0 1 0-.848l1.076-1.076l-.617-.617a.6.6 0 0 1-.176-.424V9.965a.5.5 0 0 1 .25-.433A3.5 3.5 0 0 0 13.5 3"/>
                                    </svg>
                                `,
                            }
                        ]
                    }
                )
            } else {
                items.push(
                    {
                        icon: '',
                        label: 'Employees',
                        route: '/employees',
                    },
                    {
                        icon: '',
                        label: 'Departments',
                        route: '/departments',
                    },
                    {
                        icon: '',
                        label: 'Shift',
                        route: '/shifts',
                    },
                    {
                        icon: '',
                        label: 'Management',
                        route: '#',
                        children: [
                        {
                            label: 'Attendance',
                            route: '/management/attendance',
                        },
                        {
                            label: 'Logs',
                            route: '/management/logs',
                        }
                    ]
                    },
                )
            }
            items.push(
                {
                    icon: '',
                    label: 'Profile',
                    route: '#',
                    children: [
                        {
                            label: 'Settings',
                            route: '#',
                            icon: '',
                        },
                    ]
                }
            )

            return items;
        },
        updateMenuGroups(role) {
            // Update menuGroups based on the user role
            this.menuGroups[0].menuItems = this.getMenuItems();
        }
    },
    watch: {
        userRole(newRole) {
            this.updateMenuGroups(newRole);
        }
    },
    mounted() {
        if (this.userRole) {
            this.updateMenuGroups(this.userRole);
        }
    }
}
</script>