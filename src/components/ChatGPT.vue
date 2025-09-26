<template>

  <main class="chat-container">

    <h1>Simple ChatGPT</h1>



    <div class="chat-box" ref="chatBox">

      <div v-for="(msg, idx) in messages" :key="idx" class="message">

        <strong>{{ msg.role }}:</strong> {{ msg.content }}

      </div>

    </div>



    <div class="chat-input">

      <input

        v-model="userInput"

        type="text"

        placeholder="Ask me anything..."

        @keyup.enter="sendMessage"

        :disabled="isLoading"

      />

      <button @click="sendMessage" :disabled="isLoading || !userInput.trim()">

        {{ isLoading ? "Thinking..." : "Send" }}

      </button>

    </div>

  </main>

</template>



<script setup lang="ts">

import { ref, nextTick } from "vue";



interface Message {

  role: "system" | "user" | "assistant" | string;

  content: string;

}



const userInput = ref("");

const messages = ref<Message[]>([

  { role: "system", content: "Hello! Ask me anything " },

]);



const isLoading = ref(false);

const chatBox = ref<HTMLElement | null>(null);



function scrollToBottom() {

  nextTick(() => {

    if (chatBox.value) {

      chatBox.value.scrollTop = chatBox.value.scrollHeight;

    }

  });

}



async function callOpenAiDirect(question: string) {

  // only for local quick-testing if you put a VITE_OPENAI_API_KEY in .env.local

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) throw new Error("No VITE_OPENAI_API_KEY found for direct call");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {

    method: "POST",

    headers: {

      "Content-Type": "application/json",

      Authorization: `Bearer ${apiKey}`,

    },

    body: JSON.stringify({

      model: "gpt-3.5-turbo",

      messages: [{ role: "user", content: question }],

    }),

  });



  if (!response.ok) {

    const txt = await response.text();

    throw new Error(`OpenAI error: ${response.status} ${txt}`);

  }



  const payload = await response.json();

  return payload.choices?.[0]?.message?.content ?? null;

}



async function callServerApi(question: string) {

  const response = await fetch("/api/chat", {

    method: "POST",

    headers: { "Content-Type": "application/json" },

    body: JSON.stringify({ message: question }),

  });



  if (!response.ok) {

    const txt = await response.text();

    throw new Error(`Server API error: ${response.status} ${txt}`);

  }



  const payload = await response.json();

  // expecting { reply: "..." } from your serverless function

  return payload.reply ?? null;

}



async function sendMessage() {

  if (!userInput.value.trim()) return;



  // push user message

  const question = userInput.value;

  messages.value.push({ role: "user", content: question });

  userInput.value = "";

  scrollToBottom();



  isLoading.value = true;



  try {

    // Prefer server API route (Vercel). If running locally and you set VITE_OPENAI_API_KEY, fall back to direct call.

    const useDirectLocal = import.meta.env.DEV && !!import.meta.env.VITE_OPENAI_API_KEY;

    const replyText = useDirectLocal

      ? await callOpenAiDirect(question)

      : await callServerApi(question);



    if (replyText) {

      messages.value.push({ role: "assistant", content: replyText });

    } else {

      messages.value.push({

        role: "assistant",

        content: " No reply received from server.",

      });

    }

  } catch (err: unknown) {

    // log and show friendly message

    // eslint-disable-next-line no-console

    console.error("Chat error:", err);

    messages.value.push({

      role: "assistant",

      content: " Error: Could not fetch response. Check console for details.",

    });

  } finally {

    isLoading.value = false;

    scrollToBottom();

  }

}

</script>