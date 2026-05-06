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

export interface RegisterPayload {
  firstName: string;
  paternalLastName: string;
  maternalLastName: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  requires2fa: boolean;
  access_token?: string;
  refresh_token?: string;
}

export async function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error((error as { message?: string }).message ?? 'Error al crear la cuenta');
  }

  return response.json() as Promise<RegisterResponse>;
}

export interface VerifyTwoFactorPayload {
  email: string;
  code: string;
}

export async function verifyTwoFactorCode(payload: VerifyTwoFactorPayload): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/verify-2fa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error((error as { message?: string }).message ?? 'Código inválido o expirado');
  }

  return response.json() as Promise<LoginResponse>;
}

export async function resendTwoFactorCode(email: string): Promise<void> {
  const response = await fetch(`${API_URL}/auth/resend-2fa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error((error as { message?: string }).message ?? 'Error al reenviar el código');
  }
}
