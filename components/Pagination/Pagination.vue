<template>
    <div class="flex justify-center">
        <nav>
            <ul class="list-style-none page-numbers flex flex-wrap justify-end">
                <li class="page-item">
                    <PaginationButton @click="setPage('prev')">
                        <span class="text-3xl">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="m14 7l-5 5m0 0l5 5"/>
                            </svg>
                        </span>
                    </PaginationButton>
                </li>
                <li
                    v-for="page in pages"
                    :key="page"
                    class="mx-1"
                >
                    <PaginationButton
                    :active="page == activePage"
                    class="text-black hover:bg-primaryHover hover:text-white"
                    @click="setPage(page)"
                    >
                        <span class="">{{ page }}</span>
                    </PaginationButton>
                </li>
                <li class="page-item">
                    <PaginationButton @click="setPage('next')">
                        <span class="text-3xl">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="m10 17l5-5m0 0l-5-5"/>
                            </svg>
                        </span>
                    </PaginationButton>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
import PaginationButton from './PaginationButton.vue';
export default {
    components: { PaginationButton },
    props: {
        activePage: {
            type: Number,
            required: true,
        },
        totalPages: {
            type: Number,
            required: true
        },
        pagesEachSide: {
            type: Number,
            default: 2,
        },
        pageStart: {
            type: Number,
            default: 1
        },
    },
    data() {
        return { unevenBuffer: 0 }
    },
    computed: {
        pages: {
            get() {
                this.resetBuffer()
                let leftPages = this.generateLeftPages()
                const rightPages = this.generateRightPages()
                if (this.unevenBuffer > 0) {
                    leftPages = this.generateLeftPages()
                }

                return [
                    ...leftPages,
                    this.activePage,
                    ...rightPages
                ]
            },
        },
    },
    methods: {
        setPage(page) {
            let newPage = this.activePage;
            if (page === 'next') {
                if (newPage < this.totalPages) {
                    newPage += 1
                }
            } else if (page === 'prev') {
                if (newPage > 1) {
                    newPage -= 1
                }
            } else {
                newPage = page
            }
            this.$emit('change', newPage)
        },
        resetBuffer() {
            this.unevenBuffer = 0
        },
        generateLeftPages() {
            const pages = []
            let start = this.activePage - (this.pagesEachSide + this.unevenBuffer)
            if (start < this.pageStart) {
                this.unevenBuffer = this.pageStart - start
                start = this.pageStart
            }
            for (let i = start; i < this.activePage; i++) {
                pages.push(i)
            }

            return pages
        },
        generateRightPages() {
            const pages = []
            let end = this.activePage + (this.pagesEachSide + this.unevenBuffer)
            if (end > this.totalPages) {
                this.unevenBuffer = end - this.totalPages
                end = this.totalPages
            }
            for (let i = this.activePage + 1; i <= end; i++) {
                pages.push(i)
            }

            return pages
        }
    },
};
</script>