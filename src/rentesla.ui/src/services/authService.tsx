export interface RegisterRequest { email: string; password: string; reservationCode?: string; }
export interface LoginRequest { email: string; password: string; }

export async function register(req: RegisterRequest): Promise<void> {
    const resp = await fetch('/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req)
    });
    if (!resp.ok) {
        const error = await resp.json();
        throw new Error(error?.[0]?.description || 'Registration failed');
    }
}

export async function login(req: LoginRequest): Promise<void> {
    const resp = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req)
    });
    if (!resp.ok) throw new Error('Invalid credentials');
}