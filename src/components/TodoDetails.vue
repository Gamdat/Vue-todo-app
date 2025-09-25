<template>

  <div>

    <h1>Todo Details</h1>

    <div v-if="isLoading">Loading...</div>

    <div v-else-if="isError">Error loading todo</div>

    <div v-else>

      <h2>{{ data.title }}</h2>

      <p>Status: {{ data?.completed ? " Done" : " Pending" }}</p>

    </div>

  </div>

</template>



<script setup lang="ts">

import { useRoute } from "vue-router";

import { useQuery } from "@tanstack/vue-query";



const route = useRoute();

const todoId = route.params.id as string;



const { isLoading, isError, data } = useQuery({

  queryKey: ["todo", todoId],

  queryFn: async () => {

    const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`);

    return res.json();

  },

});

</script>



