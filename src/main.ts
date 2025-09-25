import { createApp } from "vue";
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";
import  Toast  from "vue-toastification";
import "vue-toastification/dist/index.css";
import App from "./App.vue";
import router from "./router";



// Create Vue app

const app = createApp(App);

// Vue Query client
const queryClient = new QueryClient();
app.use(VueQueryPlugin, { queryClient });

app.use(Toast);

// Router
app.use(router);

app.use(Toast, { position: "top-right", timeout:3000});

// Mount app
app.mount("#app");



