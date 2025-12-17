// src/api/winnersApi.ts
const BASE_URL = "https://async-race-api-2025.onrender.com";

export const getWinners = async (page = 1, limit = 10, sort = "wins", order = "DESC") => {
  const res = await fetch(`${BASE_URL}/winners?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}&_embed=car`);
  const total = Number(res.headers.get("X-Total-Count")) || 0;
  const data = await res.json();
  return { data, total };
};

export const saveWinner = async (id: number, time: number) => {
  const res = await fetch(`${BASE_URL}/winners/${id}`);
  if (res.ok) {
    const winner = await res.json();
    const newWins = winner.wins + 1;
    const bestTime = Math.min(winner.time, time);
    await fetch(`${BASE_URL}/winners/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wins: newWins, time: bestTime }),
    });
  } else {
    await fetch(`${BASE_URL}/winners`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, wins: 1, time }),
    });
  }
};