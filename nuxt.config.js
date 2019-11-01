
export default {
  mode: 'spa',
  server: {
    port: 8000  
  },
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_description || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/tp-100.jpg' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '~/assets/scss/tailwind.scss',
    '~/assets/scss/global.scss'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/pwa',
    '@nuxtjs/style-resources',
  ],
  manifest: {
    name: 'TP-Demo Nuxt-VideoJs',
    short_name: 'TP',
    lang: 'en',
    description: 'TP-Demo Nuxt-VideoJs-Tailwindcss',
    theme_color: '#01229b',
    background_color: '#000',
    ogImage: `https://live.staticflickr.com/65535/48992121062_769c357412_o.png`
  },
  styleResources: {
    scss: [
      '~/assets/scss/_variables.scss',
      '~/assets/scss/_mixins.scss'
    ]
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    },
    postcss: {
      // Add plugin names as key and arguments as value
      // Install them before as dependencies with npm or yarn
      plugins: {
          // Disable a plugin by passing false as value
          tailwindcss: {
            configPath: '~/tailwind.config.js',
            cssPath: '~/assets/scss/tailwind.scss'
          }
      },
    }
  }
}
