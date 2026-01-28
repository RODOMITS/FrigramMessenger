import {
  db, collection, addDoc, query,
  where, orderBy, onSnapshot
} from "./firebase.js";

const chatId = new URLSearchParams(location.search).get("id");
const uid = localStorage.getItem("uid");

const messagesEl = document.getElementById("messages");
const form = document.getElementById("sendForm");
const input = document.getElementById("text");

const q = query(
  collection(db, "messages"),
  where("chatId", "==", chatId),
  orderBy("createdAt")
);

onSnapshot(q, snap => {
  messagesEl.innerHTML = "";
  snap.forEach(doc => {
    const m = doc.data();
    const div = document.createElement("div");
    div.className = "msg " + (m.from === uid ? "mine" : "their");
    div.textContent = m.text;
    messagesEl.appendChild(div);
  });
  messagesEl.scrollTop = messagesEl.scrollHeight;
});

form.onsubmit = async e => {
  e.preventDefault();
  if (!input.value.trim()) return;

  await addDoc(collection(db, "messages"), {
    chatId,
    from: uid,
    text: input.value,
    createdAt: Date.now()
  });

  input.value = "";
};

