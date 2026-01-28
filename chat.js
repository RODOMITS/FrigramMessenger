import { db } from "./firebase.js";
import { encrypt, decrypt } from "./crypto.js";
import {
  collection, addDoc, query, where, getDocs, orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const userId = localStorage.getItem("userId");
const chatId = new URLSearchParams(location.search).get("chat");

const messagesDiv = document.getElementById("messages");
const input = document.getElementById("msg");

async function loadMessages() {
  messagesDiv.innerHTML = "";

  const q = query(
    collection(db, "messages"),
    where("chatId", "==", chatId),
    orderBy("createdAt")
  );

  const snap = await getDocs(q);

  for (const docu of snap.docs) {
    const data = docu.data();
    const text = await decrypt(data.ciphertext);

    const div = document.createElement("div");
    div.textContent = text;
    messagesDiv.appendChild(div);
  }
}

document.getElementById("send").onclick = async () => {
  const text = input.value;
  input.value = "";

  const chatSnap = await getDocs(
    query(collection(db, "chats"), where("__name__", "==", chatId))
  );
  const chat = chatSnap.docs[0].data();

  const otherId = chat.userA === userId ? chat.userB : chat.userA;

  const otherSnap = await getDocs(
    query(collection(db, "profiles"), where("__name__", "==", otherId))
  );
  const other = otherSnap.docs[0].data();

  const cipher = await encrypt(text, other.publicKey);

  await addDoc(collection(db, "messages"), {
    chatId,
    sender: userId,
    ciphertext: cipher,
    createdAt: Date.now()
  });

  loadMessages();
};

loadMessages();
