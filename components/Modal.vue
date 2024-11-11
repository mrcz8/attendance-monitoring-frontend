<template>
    <div class="">
      <transition leave-active-class="duration-200">
        <div v-if="show" class="fixed inset-0 overflow-y-auto z-50 flex justify-center items-center">
          <transition
            enter-active-class="ease-out duration-300"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="ease-in duration-200"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <div
              v-if="show"
              class="fixed inset-0 bg-black opacity-50"
              @click="close"
            ></div>
          </transition>

          <transition
            enter-active-class="ease-out duration-300"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              v-if="show"
              id="default-modal"
              tabindex="-1"
              class="relative p-4 w-full max-w-2xl max-h-full bg-white rounded-lg shadow"
            >
              <!-- Modal header -->
              <div class="flex items-center justify-between p-4 border-b rounded-t ">
                <h3 class="text-xl font-semibold text-gray-900">
                  <slot name="header">Modal Title</slot>
                </h3>
                <button
                  type="button"
                  class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  @click="close"
                >
                  <svg
                    class="w-3 h-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span class="sr-only">Close modal</span>
                </button>
              </div>

              <!-- Modal body -->
              <div class="">
                <slot></slot>
              </div>

              <!-- Modal footer -->
              <div class="flex items-center justify-end p-4 gap-3 rounded-b">
                <slot name="footer">
                </slot>
              </div>
            </div>
          </transition>
        </div>
      </transition>
    </div>
  </template>

  <script>
  export default {
    props: {
      show: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      close() {
        this.$emit("close");
      },
    },
  };
  </script>