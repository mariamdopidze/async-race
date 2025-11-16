const BASE_URL = 'http://127.0.0.1:3000';

export interface Car {
  id: number;
  name: string;
  color: string;
}

export const getCars = async (page = 1, limit = 7) => {
  const response = await fetch(`${BASE_URL}/garage?_page=${page}&_limit=${limit}`);
  return {
    data: await response.json(),
    total: Number(response.headers.get('X-Total-Count')),
  };
};

export const createCar = async (name: string, color: string) => {
  const response = await fetch(`${BASE_URL}/garage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color }),
  });
  return response.json();
};

export const updateCar = async (id: number, name: string, color: string) => {
  const response = await fetch(`${BASE_URL}/garage/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color }),
  });
  return response.json();
};

export const deleteCar = async (id: number) => {
  await fetch(`${BASE_URL}/garage/${id}`, {
    method: 'DELETE',
  });
};
