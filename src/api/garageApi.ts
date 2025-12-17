// src/api/garageApi.ts
const BASE_URL = "https://async-race-api-2025.onrender.com";

export interface Car {
  id: number;
  name: string;
  color: string;
}

export const getCars = async (page = 1, limit = 7) => {
  const res = await fetch(`${BASE_URL}/garage?_page=${page}&_limit=${limit}`);
  const total = Number(res.headers.get("X-Total-Count")) || 0;
  const data = await res.json();
  return { data, total };
};

export const createCar = async (name: string, color: string) => {
  await fetch(`${BASE_URL}/garage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, color }),
  });
};

export const updateCar = async (id: number, name: string, color: string) => {
  await fetch(`${BASE_URL}/garage/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, color }),
  });
};

export const deleteCar = async (id: number) => {
  await fetch(`${BASE_URL}/garage/${id}`, { method: "DELETE" });
};