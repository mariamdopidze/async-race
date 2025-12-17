// src/api/engineApi.ts
const BASE_URL = "https://async-race-api-2025.onrender.com";

export const startEngine = async (id: number) => {
  const res = await fetch(`${BASE_URL}/engine?id=${id}&status=started`, { method: "PATCH" });
  if (!res.ok) throw new Error("Failed to start");
  return res.json();
};

export const stopEngine = async (id: number) => {
  await fetch(`${BASE_URL}/engine?id=${id}&status=stopped`, { method: "PATCH" });
};

export const switchToDrive = async (id: number) => {
  const res = await fetch(`${BASE_URL}/engine?id=${id}&status=drive`, { method: "PATCH" });
  if (res.status === 500) return { success: false };
  return { success: true };
};