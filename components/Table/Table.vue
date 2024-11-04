<template>
    <div class="rounded-md border border-stroke bg-white shadow-md">
        <div class="relative">
            <div class="overflow-x-auto lg:hidden">
                <table class="min-w-full table-auto rounded-lg">
                    <thead class="bg-gray-2">
                        <tr>
                            <th
                                v-for="(header, index) in tableHeader"
                                :key="index"
                                class="min-w-[120px] py-2 pl-9 px-4 font-medium text-black text-left"
                            >
                                {{ header }}
                            </th>
                            <th class="py-2 px-4 font-medium text-black text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, rowIndex) in tableData" :key="rowIndex"
                            :class="[
                                'border-b-indigo-100 border-b hover:bg-gray-2',
                                rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-2'
                            ]"
                        >
                            <td v-for="(header, colIndex) in tableHeader" :key="colIndex" class="py-2 px-4 pl-9 xl:pl-9">
                                <p class="text-black" :class="header === 'Status' ? item.StatusClass : ''">
                                    <span v-if="header === 'Shifts'" v-html="item[header] || '-'"></span>
                                    <span v-else>{{ item[header] || '-' }}</span>
                                </p>
                            </td>
                            <td class="py-2 px-4">
                                <div class="flex items-center space-x-3.5">
                                    <slot name="action-buttons" :item="item"></slot>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- larger screens -->
            <div class="hidden lg:block">
                <table class="min-w-full table-auto rounded-lg">
                    <thead class="bg-gray-2">
                        <tr>
                            <th
                                v-for="(header, index) in tableHeader"
                                :key="index"
                                class="min-w-[120px] py-2 pl-9 px-4 font-medium text-black text-left"
                            >
                                {{ header }}
                            </th>
                            <th class="py-2 px-4 font-medium text-black text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, rowIndex) in tableData" :key="rowIndex"
                            :class="[
                                'border-b-indigo-100 border-b hover:bg-gray-2',
                                rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-2'
                            ]"
                        >
                            <td v-for="(header, colIndex) in tableHeader" :key="colIndex" class="py-2 px-4 pl-9 xl:pl-9">
                                <p class="text-black" :class="header === 'Status' ? item.StatusClass : ''">
                                    <span v-if="header === 'Shifts'" v-html="item[header] || '-'"></span>
                                    <span v-else>{{ item[header] || '-' }}</span>
                                </p>
                            </td>
                            <td class="py-2 px-4">
                                <div class="flex items-center space-x-3.5">
                                    <slot name="action-buttons" :item="item"></slot>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div>
            <slot name="pagination" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'TableComponent',
    props: {
        tableHeader: {
            type: Array,
            required: true,
        },
        tableData: {
            type: Array,
            required: true,
        },
        editItem: Function,
        deactivateItem: Function,
        restoreItem: Function,
        forceDelete: Function
    },
    methods: {

    },
};
</script>
