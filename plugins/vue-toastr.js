import Vue from 'vue';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const options = {
    timeout: 5000,
    position: 'top-right',
};

Vue.use(Toast, options);


/**
 * TO USE
 *
 * this.$toast.success('This is a success message!');
 * this.$toast.error('This is an error message!');
 * this.$toast.info('This is an info message!');
 * this.$toast.warning('This is a warning message!');
 */