<template>
    <ul class="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
        <!-- Move the key to the <li> element -->
        <li v-for="(childItem, index) in items" :key="index">
            <router-link
            :to="childItem.route"
            @click="handleItemClick(childItem)"
            class="group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white"
            :class="{
                '!text-white': childItem.label === sidebarStore.selected
            }"
            >
            <span v-html="childItem.icon"></span>
                {{ childItem.label }}
            </router-link>
        </li>
    </ul>
</template>

<script>
export default {
    props: {
        items: {
            type: Array,
            required: true
        },
        page: {
            type: String,
            required: true
        }
    },
    computed: {
        sidebarStore() {
            return this.$store.state.sidebar;
        }
    },
    methods: {
        handleItemClick(childItem) {
            this.$store.commit('sidebar/setSelected', childItem.label);
        }
    }
};
</script>
