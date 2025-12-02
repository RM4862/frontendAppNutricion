import { writable, derived } from 'svelte/store';

type Role = 'nutriologo' | 'paciente' | 'unknown';

export type User = {
  email: string;
  name?: string;
  role?: Role;
  token?: string;
};

const STORAGE_KEY = 'nutriapp_user';

function readStoredUser(): User | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as User : null;
  } catch (e) {
    return null;
  }
}

const initial = typeof window !== 'undefined' ? readStoredUser() : null;

export const user = writable<User | null>(initial);

export const isAuthenticated = derived(user, ($u) => !!$u);

export function login(u: User) {
  // El rol debe venir del backend en el objeto User
  user.set(u);
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  } catch (e) {
    // ignore storage errors
  }
}

export function logout() {
  user.set(null);
  try {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // ignore
  }
}

export default { user, isAuthenticated, login, logout };
