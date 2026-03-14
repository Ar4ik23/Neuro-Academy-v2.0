const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const adminApiClient = {
  get: async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Admin API error: ${response.statusText}`);
    }

    return response.json();
  },

  post: async <T>(endpoint: string, data: any, options?: RequestInit): Promise<T> => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Admin API error: ${response.statusText}`);
    }

    return response.json();
  },
};
