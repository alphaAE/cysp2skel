<template>
  <nav>
    |
    <span v-for="item in routerLinks" :key="item.label">
      <router-link :to="item.link">{{ item.label }}</router-link> |
    </span>
  </nav>
  <router-view />
</template>

<script>
export default {
  data() {
    return {
      routerLinks: [
        { label: "Test1", link: "/threeTest1" },
        { label: "Test2", link: "/threeTest2" }
      ]
    }
  }

}
</script>

<style>
body {
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 10px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
