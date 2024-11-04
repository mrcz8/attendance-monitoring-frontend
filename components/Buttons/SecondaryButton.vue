<template>
    <button
        :type="type"
        @click="$emit('click', $event)"
        class="text-white inline-flex items-center px-4 py-2 bg-secondary border border-secondary rounded-md font-semibold text-xs  uppercase tracking-widest shadow-sm focus:outline-none  hover:bg-secondaryHover focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
    >
        <slot />
    </button>
</template>

<script>
    export default {
        props: {
            type: {
                type: String,
                default: 'button'
            }
        },
    }
</script>
