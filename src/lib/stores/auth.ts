import { writable, derived } from 'svelte/store';

type Role = 'nutriologo' | 'paciente' | 'unknown';

type User = {
  email: string;
  name?: string;
  role?: Role;
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

function getRoleFromEmail(email?: string): Role {
  if (!email) return 'unknown';
  const lower = email.toLowerCase();
  if (lower.endsWith('@nut.com')) return 'nutriologo';
  if (lower.endsWith('@pac.com')) return 'paciente';
  return 'unknown';
}

const initial = typeof window !== 'undefined' ? readStoredUser() : null;
if (initial && !initial.role) {
  initial.role = getRoleFromEmail(initial.email);
}

export const user = writable<User | null>(initial);

export const isAuthenticated = derived(user, ($u) => !!$u);

export function login(u: User) {
  // Ensure role is present
  const withRole: User = { ...u, role: u.role ?? getRoleFromEmail(u.email) };
  user.set(withRole);
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(withRole));
  } catch (e) {
    // ignore storage errors
  }
}

export { getRoleFromEmail };

export function logout() {
  user.set(null);
  try {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // ignore
  }
}

export default { user, isAuthenticated, login, logout };
