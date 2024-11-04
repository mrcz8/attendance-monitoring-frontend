<template>
    <div>
       <div>
           <Head title="Log in"></Head>

           <div class="flex items-center justify-center min-h-screen bg-gray-100">
               <div class="flex flex-col justify-center w-full max-w-4xl bg-white shadow-lg rounded-lg px-4 py-12 m-5 lg:px-10">
                   <div>
                       <h2 class="text-2xl font-bold leading-9 tracking-tight text-gray-900">Enter License Key</h2>
                   </div>

                   <div class="mt-10">
                       <div>
                           <form @submit.prevent="proceed" class="space-y-4">
                               <InputText v-model="key" label="License Key" type="text" :required="true" />

                               <button
                                    type="submit"
                                    class="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-1 mt-6 text-md font-semibold leading-6
                                    text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                    Authenticate
                                </button>

                                <button
                                    @click="logout"
                                    type="button"
                                    class="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-1 mt-6 text-md font-semibold leading-6
                                    text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                    Logout
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
import InputText from '../../components/Forms/InputText.vue';

export default {
    name: 'Onboarding',
    layout: 'authlayout',
    components: {
        InputText,
    },
    data() {
        return {
            key: ''
        };
    },
    methods: {
        proceed(e) {
            e.preventDefault();
            this.$axios
                .$post('/v1/client/onboard', {
                    key: this.key,
                })
                .then((response) => {
                    this.$toast.success('Onboarded');
                    this.$store.dispatch('auth/setUser', response.data);
                    this.$router.push('/admin');
                })
                .catch((err) => {
                    this.$toast.error('Invalid License key');
                });
        },
        logout() {
            this.$axios
                .$post('/v1/auth/logout')
                .then(() => {
                    this.$store.dispatch('auth/clearUser')
                    this.$router.push('/')
                })
        },
        isFormEmpty() {
            return (
                this.key === '' ||
                typeof this.key === 'undefined'
            );
        },
    },
}
</script>