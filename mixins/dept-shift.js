export default {
    data() {
        return {
            departments: [],
            shifts: [],
        };
    },
    methods: {
        retrieve() {
            return this.$axios
                .$get('v1/employee/getDeptShift')
                .then((response) => {
                    this.departments = response.departments.map(department => ({
                        id: department.id,
                        name: department.name
                    }));
                    this.shifts = response.shifts;
                })
                .catch((error) => {
                    console.error("Failed to retrieve data:", error);
                });
        },
    },
};
