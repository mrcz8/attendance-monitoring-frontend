export default function({ $axios, store, redirect, app }) {
    $axios.interceptors.response.use(function(response) {
        return response;
    }, function(error) {
        const errorCode = error.response.status

        if (errorCode === 401) {
            store.dispatch('auth/clearUser')
            redirect('/')
        } else if (errorCode === 419) {
            store.dispatch('auth/clearUser')
            redirect('/')
        } else {
            return Promise.reject(error);
        }
    })
}