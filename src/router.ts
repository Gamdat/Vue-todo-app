import {createRouter, createWebHistory} from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import Home from "./components/Home.vue";
import TodoList from "./components/TodoList.vue";
import CreateTodo from "./components/CreateTodo.vue";
import TodoDetails from "./components/TodoDetails.vue";
import NotFound from "./components/NotFound.vue";
import ErrorPage from "./components/ErrorPage.vue";
import ChatGPT from "./components/ChatGPT.vue";


const routes: Array<RouteRecordRaw> = [
    { path: "/", component: Home},
    { path: "/create", component: CreateTodo},
{ path: "/todo/id", component: TodoDetails, props: true},
{ path: "/todos", component: TodoList},
{ path: "/chatgpt", component: ChatGPT},
{ path: "/error-test", component: ErrorPage, props: {message: "Test error page"}},
{ path: "/:pathMAtch(.*)*", component: NotFound},
];

const router = createRouter ({
    history: createWebHistory(),
    routes,
})

export default router;