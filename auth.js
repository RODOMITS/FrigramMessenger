import { db } from "./firebase.js";
import { generateKeys } from "./crypto.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function initUser() {
  let id = localStorage.getItem("userId");
  if (id) return id;

  const username = prompt("Введите ник:");
  if (!username) location.reload();

  const publicKey = await generateKeys();
  id = crypto.randomUUID();

  await setDoc(doc(db, "profiles", id), {
    username,
    publicKey
  });

  localStorage.setItem("userId", id);
  return id;
}
