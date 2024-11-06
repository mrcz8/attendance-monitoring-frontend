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
                        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                        </svg>
                        `,
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
                        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 36 36" class="size-6">
                            <path fill="currentColor" d="M16.43 16.69a7 7 0 1 1 7-7a7 7 0 0 1-7 7m0-11.92a5 5 0 1 0 5 5a5 5 0 0 0-5-5M22 17.9a25.4 25.4 0 0 0-16.12 1.67a4.06 4.06 0 0 0-2.31 3.68v5.95a1 1 0 1 0 2 0v-5.95a2 2 0 0 1 1.16-1.86a22.9 22.9 0 0 1 9.7-2.11a23.6 23.6 0 0 1 5.57.66Zm.14 9.51h6.14v1.4h-6.14z"/><path fill="currentColor" d="M33.17 21.47H28v2h4.17v8.37H18v-8.37h6.3v.42a1 1 0 0 0 2 0V20a1 1 0 0 0-2 0v1.47H17a1 1 0 0 0-1 1v10.37a1 1 0 0 0 1 1h16.17a1 1 0 0 0 1-1V22.47a1 1 0 0 0-1-1"/>
                            </svg>`,
                        label: 'Employees',
                        route: '/employees',
                    },
                    {
                        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" class="size-6"><g fill="none">
                            <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M12 3a3 3 0 0 0-1 5.83V11H8a3 3 0 0 0-3 3v1.17a3.001 3.001 0 1 0 2 0V14a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v1.17a3.001 3.001 0 1 0 2 0V14a3 3 0 0 0-3-3h-3V8.83A3.001 3.001 0 0 0 12 3"/></g>
                            </svg>`,
                        label: 'Departments',
                        route: '/departments',
                    },
                    {
                        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" class="size-6">
                            <path fill="currentColor" d="m15.3 16.7l1.4-1.4l-3.7-3.7V7h-2v5.4zM12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.325 0 5.663-2.337T20 12t-2.337-5.663T12 4T6.337 6.338T4 12t2.338 5.663T12 20"/>
                            </svg>`,
                        label: 'Shift',
                        route: '/shifts',
                    },
                    {
                        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" class="size-6">
                            <path fill="none" stroke="currentColor" stroke-linejoin="round" d="M6 2.5H3.5v12h9v-12H10m-5 8h6m-4-1v2m-2-4h6m-2-1v2m-3-5l-.5-2h5l-.5 2z"/>
                            </svg>`,
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
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" class="size-6">
                        <g fill="none" fill-rule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M20 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 2H4v14h16zm-3 10a1 1 0 0 1 .117 1.993L17 17H7a1 1 0 0 1-.117-1.993L7 15zm-7-8a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2zm7 4a1 1 0 1 1 0 2h-3a1 1 0 1 1 0-2zm-7-2H8v2h2zm7-2a1 1 0 0 1 .117 1.993L17 9h-3a1 1 0 0 1-.117-1.993L14 7z"/></g>
                        </svg>`,
                    label: 'Profile',
                    route: '#',
                    children: [
                        {
                            label: 'Settings',
                            route: '#',
                            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32" class="size-6">
                                <path fill="currentColor" d="M27 16.76v-1.53l1.92-1.68A2 2 0 0 0 29.3 11l-2.36-4a2 2 0 0 0-1.73-1a2 2 0 0 0-.64.1l-2.43.82a11 11 0 0 0-1.31-.75l-.51-2.52a2 2 0 0 0-2-1.61h-4.68a2 2 0 0 0-2 1.61l-.51 2.52a11.5 11.5 0 0 0-1.32.75l-2.38-.86A2 2 0 0 0 6.79 6a2 2 0 0 0-1.73 1L2.7 11a2 2 0 0 0 .41 2.51L5 15.24v1.53l-1.89 1.68A2 2 0 0 0 2.7 21l2.36 4a2 2 0 0 0 1.73 1a2 2 0 0 0 .64-.1l2.43-.82a11 11 0 0 0 1.31.75l.51 2.52a2 2 0 0 0 2 1.61h4.72a2 2 0 0 0 2-1.61l.51-2.52a11.5 11.5 0 0 0 1.32-.75l2.42.82a2 2 0 0 0 .64.1a2 2 0 0 0 1.73-1l2.28-4a2 2 0 0 0-.41-2.51ZM25.21 24l-3.43-1.16a8.9 8.9 0 0 1-2.71 1.57L18.36 28h-4.72l-.71-3.55a9.4 9.4 0 0 1-2.7-1.57L6.79 24l-2.36-4l2.72-2.4a8.9 8.9 0 0 1 0-3.13L4.43 12l2.36-4l3.43 1.16a8.9 8.9 0 0 1 2.71-1.57L13.64 4h4.72l.71 3.55a9.4 9.4 0 0 1 2.7 1.57L25.21 8l2.36 4l-2.72 2.4a8.9 8.9 0 0 1 0 3.13L27.57 20Z"/><path fill="currentColor" d="M16 22a6 6 0 1 1 6-6a5.94 5.94 0 0 1-6 6m0-10a3.91 3.91 0 0 0-4 4a3.91 3.91 0 0 0 4 4a3.91 3.91 0 0 0 4-4a3.91 3.91 0 0 0-4-4"/>
                                </svg>`,
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