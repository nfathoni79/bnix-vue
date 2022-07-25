<template>
  <button type="button" :class="['inline-flex justify-center w-full sm:w-auto px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2', colorClasses]">
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: ['color'],
  computed: {
    colorClasses() {
      switch (this.color) {
        case 'green':
          return 'text-white bg-green-600 hover:bg-green-700 focus:ring-green-500'
        case 'red':
          return 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500'
        case 'blue':
          return 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        default:
          return 'text-white bg-green-600 hover:bg-green-700 focus:ring-green-500'
      }
    }
  },
}
</script>
