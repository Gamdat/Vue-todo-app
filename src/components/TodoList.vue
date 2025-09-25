<template>
  <main>
    <header>
      <h1 class="Header">All Todos</h1>
    </header>

    <!-- Search -->
    <div class="search"><input v-model="searchTerm" type="text" placeholder="Search by title" />
</div>

    <!-- Filter Buttons -->
    <div class="filterbtn">
      <button class="allbtn" @click="setFilter('all')">All</button>
      <button class="completebtn" @click="setFilter('completed')">Completed</button>
      <button class="incompletebtn" @click="setFilter('incomplete')">Incomplete</button>
    </div>

    <!-- Todo List -->
    <ul>
      <li v-for="todo in currentTodos" :key="todo.id">
        <h3>{{ todo.title }}</h3>
        <router-link :to="`/todo/${todo.id}`">View Details</router-link>
        <button class="delete" @click="deleteTodo(todo.id)">Delete</button>
        <button class="edit" @click="updateTodo(todo)">Edit</button>
      </li>
    </ul>

    <!-- Pagination -->
    <div>
      <button class="prev" @click="prevPage" :disabled="currentPage===1">Prev</button>
      <span>Page {{ currentPage }}</span>
      <button class="next" @click="nextPage" :disabled="indexOfLastTodo >= filteredTodos.length">Next</button>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import {useToast} from "vue-toastification";

const todosPerPage = 10;
const currentPage = ref(1);
const searchTerm = ref("");
const filterStatus = ref("all");
const queryClient = useQueryClient();
const toast = useToast();



// Fetch
async function fetchTodos() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos");
  if (!res.ok) throw new Error("Failed to fetch todos");
  return res.json();
}



const { data: todos, isLoading, isError, error } = useQuery({
  queryKey: ["todos"],
  queryFn: fetchTodos,
});



// Delete
const deleteTodoMutation = useMutation({
  mutationFn: async (id) => {
    await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, { method: "DELETE" });
  },

  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["todos"] });
    toast.success("Todo Deleted Successfully");
  },

});



// Update

const updateMutation = useMutation({
  mutationFn: async (todo) => {
    await fetch(`https://jsonplaceholder.typicode.com/todos/${todo.id}`, {
      method: "PUT",
      body: JSON.stringify({ ...todo, title: todo.title + " (Updated)" }),
      headers: { "Content-Type": "application/json" },
    });

  },

  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["todos"] });
    toast.success("Todo Updated Successfully");
  },

});



// Filtering

const filteredTodos = computed(() => {
  if (!todos.value) return [];
  return todos.value.filter((todo) => {
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.value.toLowerCase());
    const matchesStatus =
      filterStatus.value === "all" ||
      (filterStatus.value === "completed" && todo.completed) ||
      (filterStatus.value === "incomplete" && !todo.completed);
    return matchesSearch && matchesStatus;
  });
});



// Pagination

const indexOfLastTodo = computed(() => currentPage.value * todosPerPage);
const indexOfFirstTodo = computed(() => indexOfLastTodo.value - todosPerPage);
const currentTodos = computed(() => filteredTodos.value.slice(indexOfFirstTodo.value, indexOfLastTodo.value));

// Actions
function setFilter(status) {
  filterStatus.value = status;
  currentPage.value = 1;

}

function prevPage() {
  currentPage.value = Math.max(currentPage.value - 1, 1);
}

function nextPage() {
  const totalPages = Math.ceil(filteredTodos.value.length / todosPerPage);
  currentPage.value = Math.min(currentPage.value + 1, totalPages);
}

function deleteTodo(id) {
  if (confirm("Are you sure?")) deleteTodoMutation.mutate(id);
}

function updateTodo(todo) {
  updateMutation.mutate(todo);

}

</script>



