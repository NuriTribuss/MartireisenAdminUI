require('dotenv').config()

export default {
  ssr: false,
 
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],

    link: [
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,400i,700,700i,900'
      },
      
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#fff'
  },
  /*
   ** Global CSS
   */
  css: [

    'ant-design-vue/dist/antd.css',
    '@/assets/global.scss',
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/antd-ui',
    '@/plugins/axios',
    '@/plugins/i18n.js',
    '@/plugins/vee-validate.js',
  ],

  /** Router  **/
  router: {
    middleware: ['auth', 'i18n']
  },


  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxtjs/moment',
    '@nuxtjs/dotenv'
  ],
  dotenv: {
    /* module options */
  },
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],
  /*
   ** Build configuration
   */

  axios: {
    baseURL: process.env.url+'/api'
  },

  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  },

  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/auth/login',
            method: 'post',
            propertyName: 'data.token'
          },
          logout: {
            url: '/auth/logout',
            method: 'post'
          },
          user: {
            url: '/auth/user',
            method: 'get',
            propertyName: 'data.account'
          }
        }
      },
    }
  }
}
