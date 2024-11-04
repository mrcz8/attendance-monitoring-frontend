<template>
    <div>
        <router-link
            v-if="!isButton"
            :to="route"
            class="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold leading-6
            text-white shadow-sm hover:bg-primaryHover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaryHover"
            :class="[customClasses]"
            >
            <slot />
        </router-link>

        <button
            v-else
            :type="type"
            @click="$emit('click', $event)"
            class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md
            font-semibold text-xs text-gray-700 uppercase tracking-widest border border-primary shadow-sm hover:bg-gray-50 hover:bg-primaryHover
            focus:outline-none focus:ring-2 focus:ring-primaryHover focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
            :class="[customClasses]"
            >
            <slot />
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
            route: {
                type: [String, Object],
                default: null
            },
            customClasses: {
                type: Array,
                default: () => []
            },
            isButton: {
                type: Boolean,
                default: false
            },
            onClick: {
                type: Function,
                default: null
            }
        }
    }
</script>
