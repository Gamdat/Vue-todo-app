<template>

  <div class="add-todo">

    <input

      v-model="title"

      type="text"

      placeholder="Enter your todo"

    />

    <button @click="handleSubmit" class="Add">Add Todo</button>

  </div>

</template>



<script setup>

import { ref } from "vue";
import {useToast} from "vue-toastification"
import { useMutation, useQueryClient } from "@tanstack/vue-query";




const title = ref("");

const queryClient = useQueryClient();

const toast = useToast();



const addTodoMutation = useMutation({

  mutationFn: async (newTodo) => {

    const res = await fetch("https://jsonplaceholder.typicode.com/todos", {

      method: "POST",

      body: JSON.stringify(newTodo),

      headers: { "Content-Type": "application/json" },

    });



    if (!res.ok) throw new Error("Failed to create todo");

    return res.json();

  },

  onSuccess: () => {

    queryClient.invalidateQueries({ queryKey: ["todos"] });

    title.value = "";

    toast.success("Todo Created Successfully");

  },

});



function handleSubmit() {

  if (!title.value.trim()) return;



  const newTodo = {

    userId: 1,

    title: title.value,

    completed: false,

  };



  addTodoMutation.mutate(newTodo);

}

</script>

