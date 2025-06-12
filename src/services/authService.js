const API = import.meta.env.VITE_API_URL;

export async function register(email, password, nom) {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, nom }),
  });

  if (!res.ok) throw new Error("Erreur d'inscription");
  return await res.json();
}
export async function login(email, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include", // important pour HttpOnly cookie
  });

  if (!res.ok) throw new Error("Email ou mot de passe incorrect");
  return await res.json();
}
/*export async function login(email, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Email ou mot de passe incorrect");
  const data = await res.json();
  localStorage.setItem("token", data.token); // stocke le token pour plus tard
  return data.user;
}*/

export async function getProfil() {
  const res = await fetch(`${API}/auth/profil`, {
    method: "GET",
    credentials: "include", // pour envoyer le cookie HttpOnly
  });

  if (!res.ok) throw new Error("Non autorisé");
  return await res.json();
}
/*export async function getProfil() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/auth/profil`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Non autorisé");
  return await res.json();
}*/

export async function logout() {
  await fetch(`${API}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}
