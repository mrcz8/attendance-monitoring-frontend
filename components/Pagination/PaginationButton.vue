<template>
    <button
      type="button"
      :class="`
        rounded-lg
        flex items-center justify-center
        md:h-10 md:w-8
        cursor-pointer
        bg-gray-500
        text-center text-lg
        md:text-md
        outline-none
        transition-all
        duration-300
        focus:shadow-none
        ${activeClass}
      `"
      @click="$emit('click')"
    >
      <slot></slot>
    </button>
  </template>

<script>
export default {
    props: {
        active: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        activeClass() {
            if (this.active) {
                return 'bg-primary text-white'
            }
            else {
                return 'text-black hover:bg-primaryHover hover:text-white'
            }
        },
    },
}
</script>