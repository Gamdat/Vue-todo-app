<template>
  <main>
    <h1> ChatGPT</h1>
    <div class="chat-box">
      <div v-for="(msg, index) in messages" :key="index" class="message">
        <strong>{{ msg.role }}:</strong> {{ msg.content }}
      </div>
    </div>

    <input
      v-model="userInput"
      type="text"
      placeholder="Ask me anything..."
      @keyup.enter="sendMessage"
    />

    <button class="chat-btn" @click="sendMessage">Send</button>
  </main>
</template>


<script setup>
import { ref } from "vue";

const userInput = ref("");
const messages = ref([{ role: "Gloria", content: "Hello! Ask me anything " }]);

async function sendMessage() {
  if (!userInput.value.trim()) return;

  // Add user message
  messages.value.push({ role: "user", content: userInput.value });

  const question = userInput.value;
  userInput.value = "";

  // Call OpenAI (replace with your API key)
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer YOUR_OPENAI_API_KEY`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }],
      }),
    });

    const data = await res.json();
    const reply = data.choices[0].message.content;

    messages.value.push({ role: "Gloria", content: reply });
  } catch (err) {
    messages.value.push({ role: "Gloria", content: "Error: Could not fetch response " });
  }
}
</script>
