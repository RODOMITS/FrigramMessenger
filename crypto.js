export function ab2b64(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

export function b642ab(b64) {
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
}

export async function generateKeys() {
  const pair = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1,0,1]),
      hash: "SHA-256"
    },
    true,
    ["encrypt", "decrypt"]
  );

  const publicKey = await crypto.subtle.exportKey("spki", pair.publicKey);
  const privateKey = await crypto.subtle.exportKey("pkcs8", pair.privateKey);

  localStorage.setItem("privateKey", ab2b64(privateKey));
  return ab2b64(publicKey);
}

export async function encrypt(text, publicKey) {
  const key = await crypto.subtle.importKey(
    "spki",
    b642ab(publicKey),
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["encrypt"]
  );

  const encrypted = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    key,
    new TextEncoder().encode(text)
  );

  return ab2b64(encrypted);
}

export async function decrypt(ciphertext) {
  const key = await crypto.subtle.importKey(
    "pkcs8",
    b642ab(localStorage.getItem("privateKey")),
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["decrypt"]
  );

  const decrypted = await crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    key,
    b642ab(ciphertext)
  );

  return new TextDecoder().decode(decrypted);
}
