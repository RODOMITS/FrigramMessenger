import {
  db, collection, addDoc, query,
  where, onSnapshot
} from "./firebase.js";

let uid = localStorage.getItem("uid");
if (!uid) {
  uid = crypto.randomUUID();
  localStorage.setItem("uid", uid);
}

document.getElementById("uid").textContent = uid;

const chatList = document.getElementById("chatList");
const btn = document.getElementById("newChatBtn");

btn.onclick = async () => {
  const target = document.getElementById("targetId").value.trim();
  if (!target || target === uid) return alert("Неверный ID");

  const chatId = [uid, target].sort().join("_");

  await addDoc(collection(db, "chats"), {
    id: chatId,
    users: [uid, target],
    createdAt: Date.now()
  });
};

const q = query(
  collection(db, "chats"),
  where("users", "array-contains", uid)
);

onSnapshot(q, snap => {
  chatList.innerHTML = "";
  snap.forEach(doc => {
    const chat = doc.data();
    const div = document.createElement("div");
    div.className = "chat-item";
    div.textContent = chat.users.find(u => u !== uid);
    div.onclick = () => {
      location.href = `chat.html?id=${chat.id}`;
    };
    chatList.appendChild(div);
  });
});
