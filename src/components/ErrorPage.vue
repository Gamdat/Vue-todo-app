<template>

  <main class="error-page">

    <h1> Oops! Something went wrong.</h1>

    <p>{{ message }}</p>

    <router-link to="/">Return Home</router-link>

  </main>

</template>



<script setup lang="ts">
defineProps<{ message: string }>();
</script>



<style>

.error-page {
  text-align: center;
  margin-top: 50px;
  color: darkred;
}

</style>



