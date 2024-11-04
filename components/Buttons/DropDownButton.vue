<template>
    <div class="relative inline-block text-left">
        <button
            @click="toggleDropdown"
            class="inline-flex justify-center w-full rounded-md shadow-md px-4 py-2 bg-transparent text-graydark text-md  hover:text-primary "
            type="button"
            aria-expanded="true"
            aria-haspopup="true"
        >
            {{ label }}
            <svg
            class="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            >
            <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
            />
            </svg>
        </button>

        <div
            v-if="isOpen"
            class="z-50 origin-top-right absolute right-0 mt-2 w-30 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabindex="-1"
        >
            <div class="py-1 px-1" role="none">
                <slot />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            default: 'Actions',
        },
    },
    data() {
        return {
            isOpen: false,
        };
    },
    mounted() {
        this.$root.$on('closeDropdowns', this.closeDropdown);
        document.addEventListener('click', this.handleClickOutside);
    },
    beforeDestroy() {
        this.$root.$off('closeDropdowns', this.closeDropdown);
        document.removeEventListener('click', this.handleClickOutside);
    },
    methods: {
        toggleDropdown() {
            if (!this.isOpen) {
                this.$root.$emit('closeDropdowns');
            }
            this.isOpen = !this.isOpen;
        },
        closeDropdown() {
            this.isOpen = false;
        },
        handleClickOutside(event) {
            const dropdown = this.$el;
            if (!dropdown.contains(event.target)) {
                this.closeDropdown();
            }
        },
    },
};
</script>
