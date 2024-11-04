<template>
    <div class="mb-4">
      <label class="mb-2.5 block font-medium text-black">{{ label }}</label>
        <div class="relative">
            <input
            v-model="inputValue"
            :type="type"
            :placeholder="placeholder"
            :required="isRequired"
            @focus="isInputFocused = true"
            @blur="isInputFocused = false"
            class="w-full rounded-lg border border-stroke bg-transparent py-1 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none"
            />

            <span class="absolute right-4 top-1">
                <slot></slot>
            </span>
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
        type: {
            type: String,
            default: 'text'
        },
        placeholder: {
            type: String,
            default: ''
        },
        required: {
            type: Boolean,
            default: false
        },
        value: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            inputValue: this.value,
            isInputFocused: false,
        };
    },
    computed: {
        isRequired() {
            return this.required;
        }
    },
    watch: {
        inputValue(newValue) {
            this.$emit('input', newValue);
        },
        value(newValue) {
            this.inputValue = newValue;
        }
    }
}
</script>

