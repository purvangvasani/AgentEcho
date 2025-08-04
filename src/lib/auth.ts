// This is a mock authentication system.
// In a real application, you would use a secure authentication provider.
'use server';

import type { User } from './types';
import { cookies } from 'next/headers';

const MOCK_USERS: User[] = [
  { id: '1', name: 'Test User', email: 'test@example.com', avatarUrl: 'https://placehold.co/100x100.png' },
];
let MOCK_LOGGED_IN_USER: User | null = null;
const SESSION_COOKIE_NAME = 'linkedagent_session';

// Helper to get user from a "session"
export async function getCurrentUser(): Promise<User | null> {
  // For demonstration purposes, we'll return the first mock user by default.
  // This will bypass the login screen for easier development.
  const user = MOCK_USERS[0];
  if (user) {
    return { ...user };
  }
  
  const session = cookies().get(SESSION_COOKIE_NAME);
  if (session?.value) {
    const userFromCookie = MOCK_USERS.find(u => u.id === session.value);
    return userFromCookie ? {...userFromCookie} : null;
  }
  return null;
}

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  const user = MOCK_USERS.find(u => u.email === email);
  if (user && password) { // In a real app, you'd check a hashed password
    cookies().set(SESSION_COOKIE_NAME, user.id, { httpOnly: true, maxAge: 60 * 60 * 24 });
    return { success: true };
  }
  return { success: false, error: 'Invalid email or password.' };
}

export async function logout(): Promise<{ success: boolean }> {
  cookies().delete(SESSION_COOKIE_NAME);
  return { success: true };
}

export async function signup(data: { name: string, email: string, password: string }): Promise<{ success: boolean; error?: string }> {
  if (MOCK_USERS.some(u => u.email === data.email)) {
    return { success: false, error: 'User with this email already exists.' };
  }
  if (data.password.length < 3) {
      return { success: false, error: 'Password must be at least 3 characters.'}
  }
  const newUser: User = {
    id: String(MOCK_USERS.length + 1),
    name: data.name,
    email: data.email,
    avatarUrl: `https://placehold.co/100x100.png`
  };
  MOCK_USERS.push(newUser);
  return { success: true };
}

export async function updateUser(updatedUser: User): Promise<{ success: boolean; user?: User; error?: string }> {
  const userIndex = MOCK_USERS.findIndex(u => u.id === updatedUser.id);
  if (userIndex !== -1) {
    MOCK_USERS[userIndex] = { ...MOCK_USERS[userIndex], ...updatedUser };
    return { success: true, user: MOCK_USERS[userIndex] };
  }
  return { success: false, error: 'User not found.' };
}

export async function connectLinkedIn(): Promise<{ success: boolean; user?: User, error?: string }> {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return { success: false, error: "User not logged in." };
    }
    const userIndex = MOCK_USERS.findIndex(u => u.id === currentUser.id);

    if (userIndex !== -1) {
      const isConnected = !!MOCK_USERS[userIndex].linkedinAccessToken;
      
      if (isConnected) {
         delete MOCK_USERS[userIndex].linkedinAccessToken;
      } else {
        // In a real app, this would be the result of the OAuth flow
        MOCK_USERS[userIndex].linkedinAccessToken = `mock_access_token_${Date.now()}`;
      }
      return { success: true, user: { ...MOCK_USERS[userIndex] } };
    }
    
    return { success: false, error: 'User not found.' };
}
