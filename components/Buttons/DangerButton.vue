<template>
    <div>
        <button
            :type="type"
            @click="$emit('click', $event)"
            class="inline-flex items-center px-4 py-2 bg-danger text-white rounded-md
            font-semibold text-xs text-gray-700 uppercase tracking-widest border border-danger shadow-sm hover:bg-gray-50 hover:bg-dangerHover
            focus:outline-none focus:ring-2 focus:ring-dangerHover focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
            :class="[customClasses]"
            >
            <slot>Delete</slot>
        </button>
    </div>
</template>

<script>
    export default {
        props: {
            type: {
                type: String,
                default: 'button'
            },
            customClasses: {
                type: String,
                default: ''
            },
            onClick: {
                type: Function,
                default: null
            }
        }
    }
</script>
