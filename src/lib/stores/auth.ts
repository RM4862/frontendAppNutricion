import { writable, derived } from 'svelte/store';

export type Role = 'NUTRIOLOGO' | 'PACIENTE' | 'unknown';

export type User = {
  email: string;
  name: string;
  first_name: string;
  last_name: string;
  role: Role;
  token: string; // JWT del login
};

const STORAGE_KEY = 'nutriapp_user';

// ------------------------
// Leer usuario guardado
// ------------------------
function readStoredUser(): User | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

const initialUser = typeof window !== 'undefined' ? readStoredUser() : null;

// ------------------------
// Store principal
// ------------------------
export const user = writable<User | null>(initialUser);

export const isAuthenticated = derived(user, ($u) => $u !== null);

export const userRole = derived(user, ($u) => $u?.role ?? 'unknown');

// ------------------------
// Funciones públicas
// ------------------------
export function login(data: User) {
  user.set(data);
  try {
    if (typeof localStorage !== 'undefined')
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export function logout() {
  user.set(null);
  try {
    if (typeof localStorage !== 'undefined')
      localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export default { user, isAuthenticated, userRole, login, logout };