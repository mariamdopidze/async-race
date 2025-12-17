

const BASE_URL = 'https://async-race-api-mariam.onrender.com';

export type EngineResponse = {
  velocity: number;
  distance: number;
};

export type DriveResponse = {
  success: boolean;
};

export const startEngine = async (id: number): Promise<EngineResponse> => {
  const res = await fetch(`${BASE_URL}/engine?id=${id}&status=started`, {
    method: 'PATCH',
  });

  if (!res.ok) {
    throw new Error(`Failed to start engine for car ${id}`);
  }

  return res.json();
};

export const stopEngine = async (id: number): Promise<void> => {
  await fetch(`${BASE_URL}/engine?id=${id}&status=stopped`, {
    method: 'PATCH',
  });
};

export const switchToDrive = async (id: number): Promise<DriveResponse> => {
  const res = await fetch(`${BASE_URL}/engine?id=${id}&status=drive`, {
    method: 'PATCH',
  });

  
  if (res.status === 500) {
    return { success: false };
  }

  if (!res.ok) {
    throw new Error(`Drive mode failed for car ${id}`);
  }

  return { success: true };
};