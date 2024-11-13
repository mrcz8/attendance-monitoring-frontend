<template>
    <div class="flex flex-col items-center justify-center gap-8">
        <!-- First Form -->
        <div class="rounded-md border border-stroke bg-white shadow-default md:w-full xl:w-1/2">
            <div class="w-full p-6 sm:p-12 xl:p-16">
                <InputText v-model="name" label="Name" type="text" :required="true" class="mb-6" />
                <InputText v-model="email" label="Email" type="email" :required="true" />

                <div class="flex justify-end mt-6">
                    <SecondaryButton @click="update">Update Profile</SecondaryButton>
                </div>
            </div>
        </div>

        <div class="rounded-md border border-stroke bg-white shadow-default md:w-full xl:w-1/2">
            <div class="w-full p-6 sm:p-12 xl:p-16">
                <InputText v-model="oldPassword" label="Old Password" type="password" :required="true" class="mb-6" />
                <InputText v-model="newPassword" label="New Password" type="password" :required="true" class="mb-6" />
                <InputText v-model="confirmPassword" label="Confirm Password" type="password" :required="true" />

                <div class="flex justify-end mt-6">
                    <SecondaryButton @click="changePassword">Change Password</SecondaryButton>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import InputText from '../../components/Forms/InputText.vue';
import SecondaryButton from '../../components/Buttons/SecondaryButton.vue';

export default {
    components: {
        InputText,
        SecondaryButton
    },
    layout: 'default',
    data() {
        return {
            name: '',
            email: '',
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    },
    computed: {
        userName() {
            return this.$store.state.auth.user ? this.$store.state.auth.user.name : null
        },
        userEmail() {
            return this.$store.state.auth.user ? this.$store.state.auth.user.email : null
        }
    },
    mounted() {
        this.$nextTick(() => {
            if (this.$store.state.auth.user !== null) {
                this.name = this.$store.state.auth.user.name
                this.email = this.$store.state.auth.user.email
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
    methods: {
        async update() {
            try {
                const data = {
                    name: this.name,
                    email: this.email,
                };

                const response = await this.$axios.put('v1/users/update', data);

                if (response.status === 200) {
                    this.$store.commit('auth/setUser', { ...this.$store.state.auth.user, name: this.name });

                    this.$toast.success('User updated successfully');
                } else {
                    this.$toast.error('Failed to update user');
                }
            } catch (error) {
                this.$toast.error('User update failed');
            }
        },
        async changePassword() {
            if (this.newPassword !== this.confirmPassword) {
                this.$toast.error('New password and confirm password do not match');
                return;
            }

            const data = {
                oldPassword: this.oldPassword,
                newPassword: this.newPassword
            };

            try {
                const response = await this.$axios.put('v1/users/changePassword', data);

                if (response.status === 200) {
                    this.$toast.success('Password changed successfully');
                    this.oldPassword = '';
                    this.newPassword = '';
                    this.confirmPassword = '';
                } else {
                    this.$toast.error('Failed to change password');
                }
            } catch (error) {
                this.$toast.error(error.response?.data?.message || 'User update failed');
            }
        }
    }
}
</script>