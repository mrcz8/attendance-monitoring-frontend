<template>
    <div class="mb-4" ref="dropdown">
        <label class="mb-2.5 block font-medium text-black">{{ label }}</label>
        <div
            class="flex flex-wrap gap-2 w-full rounded-lg border border-stroke bg-transparent py-1 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none cursor-pointer"
            @click="toggleDropdown"
            :class="{ 'border-blue-500': isDropdownOpen }"
        >
            <span
                v-for="(item) in selectedItems"
                :key="item.id"
                class="bg-blue-100 text-blue-700 px-2 rounded-full flex items-center"
            >
                {{ item.displayText }}
                <button
                    type="button"
                    @click.stop="removeItem(item)"
                    class="ml-1 text-red-500"
                >
                    &times;
                </button>
            </span>
            <input
                type="text"
                placeholder="Select options..."
                class="flex-1 outline-none cursor-text"
                readonly
            />
        </div>
        <div
            v-if="isDropdownOpen"
            class="absolute left-10 right-10 mt-1 bg-white border border-stroke rounded-lg shadow-lg z-10"
        >
            <div class="max-h-48 overflow-y-auto">
                <div
                    v-for="option in filteredOptions"
                    :key="option.id"
                    class="flex items-center p-2 hover:bg-blue-100 cursor-pointer"
                    @click="selectItem(option)"
                >
                    <span>{{ option.displayText }}</span>
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
            required: true
        },
        placeholder: {
            type: String,
            default: ''
        },
        required: {
            type: Boolean,
            default: false
        },
        options: {
            type: Array,
            required: true,
        },
        value: {
            type: [String, Array],
            default: () => [],
        },
    },
    data() {
        return {
            isDropdownOpen: false,
            selectedItems: [...this.value],
        };
    },
    computed: {
        filteredOptions() {
            return this.options.filter(
                (option) => !this.selectedItems.some((item) => item.id === option.id)
            );
        },
    },
    watch: {
        selectedItems(newVal) {
            this.$emit('input', newVal);
        }
    },
    methods: {
        toggleDropdown() {
            this.isDropdownOpen = !this.isDropdownOpen;
        },
        selectItem(item) {
            this.selectedItems.push(item);
            this.isDropdownOpen = false;
        },
        removeItem(item) {
            this.selectedItems = this.selectedItems.filter((i) => i.id !== item.id);
        },
        handleClickOutside(event) {
            const dropdownElement = this.$refs.dropdown;
            if (this.isDropdownOpen && dropdownElement && !dropdownElement.contains(event.target)) {
                this.isDropdownOpen = false;
            }
        },
    },
    mounted() {
        document.addEventListener('click', this.handleClickOutside);
    },
    beforeDestroy() {
        document.removeEventListener('click', this.handleClickOutside);
    },
};
</script>
