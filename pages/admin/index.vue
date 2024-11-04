<template>
        <div>
            <h1>Welcome, {{ name }}!</h1>
            <h1>Welcome, {{ role }}!</h1>
        </div>
</template>

<script>
export default {
    layout: 'default',
    data() {
        return {
            name: '',
            role: '',
        }
    },
    computed: {
        userName() {
            return this.$store.state.auth.user ? this.$store.state.auth.user.name : null
        },
        userRole() {
            return this.$store.state.auth.user ? this.$store.state.auth.user.role : null
        }
    },
    mounted() {
        this.$nextTick(() => {
            if (this.$store.state.auth.user !== null) {
                this.name = this.$store.state.auth.user.name
                this.role = this.$store.state.auth.user.role
            }
            if (this.$store.state.auth.isLoggedIn === false) {
                this.$router.push('/');
            }
            setInterval(() => {
                this.$axios
                .$get('v1/users/me')
            }, 1800000);
            document.addEventListener('click', this.close)
        })
    },
}
</script>