export default {
  // Target: https://go.nuxtjs.dev/config-target
  ssr: false,
  target: 'server',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: '',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/css/main.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {
        src: '~/plugins/vuex-persist.js',
        mode: 'client',
    },
    {
        src: '~/plugins/axios.js'
    },
    {
        src: '~/plugins/vue-toastr.js'
    }
  ],

  router: {
    middleware: [
        'auth'
    ],
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    // '@nuxtjs/composition-api'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
  ],

  publicRuntimeConfig: {
    axios: {
        baseURL: process.env.BACKEND_URL + process.env.API_PATH,
        credentials: true,
        withCredentials: true,
    },
    environment: process.env.ENVIRONMENT,
    baseURL: process.env.BASE_URL,
    apiURL: process.env.BACKEND_URL + process.env.API_PATH,
    persistentVuexModules: process.env.PERSISTENT_VUEX_MODULES.split(','),
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    headers: {
      common: {
        'Accept': 'application/json'
      }
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    postcss: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        },
      },
    extend(config) {
        config.module.rules.push({
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules\/(?!chart.js|vue-chartjs)/,
        });
      },
  },
}
