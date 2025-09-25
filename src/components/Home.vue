<template>
  <main>
    <div class="Header">
      <header>
        <h1 class="welcome">Welcome to Gloria's Todo App</h1>
        <p class="plan">....Plan it, Track it, Slay it</p>
      </header>

      <div class="Link">
        <router-link to="/todos"><button class="todo">View All Todos</button></router-link>
        <br />
        <router-link to="/create"><button class="create">Add New Todo</button></router-link>
        <br />
        <router-link to="/error-test"><button class="errorpage">Test Error Page</button></router-link>
        <br />
        <router-link to="/notfound"><button class="notfound">NotFound</button></router-link>
        <br/>
         <router-link to="/chatgpt"><button class="chatgpt">ChatGPT</button></router-link>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts"></script>

