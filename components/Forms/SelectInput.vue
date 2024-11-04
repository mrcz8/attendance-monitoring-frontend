<template>
    <div class="mb-4">
        <label class="mb-2.5 block font-medium text-black">{{ label }}</label>
        <div class="relative">
            <input
                type="text"
                class="w-full rounded-lg border border-stroke bg-transparent py-1 pl-6 pr-10 cursor-pointer outline-none focus:border-primary focus-visible:shadow-none"
                :class="customClasses"
                :placeholder="placeholder"
                :value="selectedItem ? selectedItem.displayText : ''"
                @click="toggleDropdown"
                readonly
            />
            <span class="absolute right-4 top-1">
                <slot></slot>
            </span>

            <div
                v-if="isDropdownOpen"
                class="absolute left-0 right-0 mt-1 bg-white border border-stroke rounded-lg shadow-lg z-10"
            >
                <div class="max-h-48 overflow-y-auto">
                    <div
                        v-for="option in options"
                        :key="option.id"
                        @click="selectItem(option)"
                        class="flex items-center p-2 hover:bg-blue-100 cursor-pointer"
                    >
                        <span>{{ option.displayText }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            required: false,
        },
        placeholder: {
            type: String,
            default: "Select an option...",
        },
        options: {
            type: Array,
            required: true,
        },
        value: {
            type: [String, Number],
            default: null,
        },
        customClasses: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            isDropdownOpen: false,
            selectedItem: null,
        };
    },
    watch: {
        value(newValue) {
            this.selectedItem = this.options.find((option) => option.id === newValue);
        },
    },
    methods: {
        toggleDropdown() {
            this.isDropdownOpen = !this.isDropdownOpen;
        },
        selectItem(item) {
            this.selectedItem = item;
            this.isDropdownOpen = false;
            this.$emit("input", item.id);
        },
        handleClickOutside(event) {
            if (!this.$el.contains(event.target)) {
                this.isDropdownOpen = false;
            }
        },
    },
    mounted() {
        document.addEventListener("click", this.handleClickOutside);
        this.selectedItem = this.options.find((option) => option.id === this.value);
    },
    beforeDestroy() {
        document.removeEventListener("click", this.handleClickOutside);
    },
};
</script>
