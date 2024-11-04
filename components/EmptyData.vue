<template>
    <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div class="mx-auto max-w-screen-sm text-center">
            <p class="mb-4 text-3xl tracking-tight font-bold text-gray-4 md:text-3xl">No {{ data }} Available.</p>
            <!-- <p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Sorry, we can't find that page. You'll find lots to explore on the home page. </p> -->
        </div>
    </div>
</template>

<script>
export default {
    name: 'NoData',
    props: {
        data: {
            type: String,
            default: 'Data'
        },
    },
}
</script>