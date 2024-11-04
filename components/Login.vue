<template>
 <div>
    <div>
        <Head title="Log in"></Head>

        <div class="flex items-center justify-center min-h-screen bg-gray-100">
            <div class="flex flex-col justify-center w-full max-w-sm px-4 py-10 sm:px-6 lg:w-96 bg-white">
                <div>
                    <h2 class="text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
                </div>

                <div class="mt-10">
                    <div>
                        <form @pclass="space-y-3">

                            <InputText v-model="email" label="Email" type="email" :required="true" />

                            <InputText v-model="password" label="Password" type="password" :required="true" />

                            <button
                                type="submit"
                                @click="authenticate"
                                class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1 mt-[30px] text-md font-semibold leading-6
                                text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                Sign in
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
 </div>
</template>

<script>
import InputText from './Forms/InputText.vue';

export default {
    name: 'Login',
    layout: 'authlayout',
    components: {
        InputText,
    },
    data() {
        return {
            email: '',
            password: '',
        };
    },
    methods: {
    authenticate(e) {
        e.preventDefault();
        if (!this.isFormEmpty()) {
            this.$axios
            .$get(`${this.$config.baseURL}/sanctum/csrf-cookie`)
            .then(() => {
                this.$axios
                .$post('/v1/auth/login', {
                    email: this.email,
                    password: this.password,
                })
                .then((response) => {

                    if (response.data.isLoggedIn) {
                        this.$store.dispatch('auth/setUser', response.data);

                        if (response.data.user.role === 'admin') {
                            if (response.data.user.hasLicenseKey) {
                                this.$router.push('/employees');
                            } else {
                                this.$router.push('/onboarding');
                            }
                        } else {
                            this.$router.push('/admin');
                        }
                    } else {
                        console.log('not logged in');
                    }
                })
                .catch((err) => {
                    console.log(err)
                });
            })
            .catch((err) => {
                console.log(err)
            });
        } else {
            console.log('email password must not empty')
        }
        },
        isFormEmpty() {
        return (
            this.email === '' ||
            typeof this.email === 'undefined' ||
            this.password === '' ||
            typeof this.password === 'undefined'
        );
        },
    },
}
</script>