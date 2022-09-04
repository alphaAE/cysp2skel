<template>
  <div class="home">
    <ThreeTest1 />
  </div>
</template>

<script>
// @ is an alias to /src
import ThreeTest1 from '@/views/ThreeTest1.vue'

export default {
  name: 'HomeView',
  components: {
    ThreeTest1
  }
}
</script>
