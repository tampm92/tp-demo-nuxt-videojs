<template>
  <div
    class="text-white mt-0 border border-blue-800 py-0 w-full h-full"
    style="background-image:url('/header-background.jpg')"
  >
    <header class="flex md:justify-between p-8">
      <div class="flex items-center">
        <img src="/tp-100.png" alt="tp-logo" class="w-16 mx-5" />
        <h1 class="inline text-white sm:text-3xl text-2xl font-bold">
          <a href="/">TP-Demo</a>
        </h1>
      </div>
    </header>
    <section class="px-8 md:px-10 mt-10 sm:mt-16 flex w-full container mx-auto pb-16">
      <div class="flex flex-wrap w-full text-white flex">
        <div class="w-full md:w-1/2 w-full">
          <h2
            class="leading-none font-bold text-3xl xs:text-2x1 md:text-5xl lg:6x1 uppercase"
          >Nuxt - VideoJs - Tailwindcss</h2>

          <div class="mt-12 mb-4">
            <h1 class="text-2xl md:text-5xl text-blue-400">Features</h1>

            <div class="text-xl md:text-2xl">
              <p>Vue</p>
              <p>Nuxt</p>
              <p>PWA</p>
              <p>Tailwind CSS</p>
              <p>VideoJs</p>
              <div class="text-sm md:text-xl ml-2 text-gray-500">
                <p>Custom skin</p>
                <p>Custom control</p>
                <p>Custom hotkeys</p>
              </div>
            </div>
          </div>

          <div class="py-4 flex">
            <a
              href="/video"
              class="px-6 md:px-16 py-2 md:py-4 rounded-full bg-blue-400 text-white font-bold uppercase border-blue-500 border hover:bg-blue-600"
            >Lauch Demo</a>
          </div>
        </div>
        <div class="w-full md:w-1/2 md:justify-center items-center flex">
          <img src="/web-designing.png" alt="Mobile Phone" />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
</style>
