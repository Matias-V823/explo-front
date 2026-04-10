const API_URL = import.meta.env.VITE_API_URL as string;

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export async function loginWithBackend(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error((error as { message?: string }).message ?? 'Credenciales incorrectas');
  }

  return response.json() as Promise<LoginResponse>;
}
