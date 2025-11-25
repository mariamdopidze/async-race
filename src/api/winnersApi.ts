
const BASE_URL = 'http://127.0.0.1:3000';

export interface Winner {
  id: number;
  wins: number;
  time: number; 
}

export interface WinnerWithCar {
  id: number;
  wins: number;
  time: number;
  car: { id: number; name: string; color: string };
}

export const getWinners = async (
  page = 1,
  limit = 10,
  sort: 'id' | 'wins' | 'time' = 'id',
  order: 'ASC' | 'DESC' = 'ASC'
): Promise<{ data: WinnerWithCar[]; total: number }> => {
  const res = await fetch(
    `${BASE_URL}/winners?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}&_embed=car`
  );
  const total = Number(res.headers.get('X-Total-Count')) || 0;
  const data = await res.json();
  return { data, total };
};

export const getWinner = async (id: number): Promise<Winner | null> => {
  const res = await fetch(`${BASE_URL}/winners/${id}`);
  if (res.status === 404) return null;
  return res.json();
};

export const createWinner = async (winner: { id: number; wins: number; time: number }) => {
  await fetch(`${BASE_URL}/winners`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(winner),
  });
};

export const updateWinner = async (id: number, wins: number, time: number) => {
  await fetch(`${BASE_URL}/winners/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wins, time }),
  });
};

export const deleteWinner = async (id: number) => {
  await fetch(`${BASE_URL}/winners/${id}`, { method: 'DELETE' });
};