let isSessionAuthenticated = false;

export async function checkAuthStatus(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/status', {
      credentials: 'include'
    });
    const data = await response.json();
    isSessionAuthenticated = data.authenticated;
    return isSessionAuthenticated;
  } catch (error) {
    console.error('Failed to check auth status:', error);
    isSessionAuthenticated = false;
    return false;
  }
}

export function isAuthenticated(): boolean {
  return isSessionAuthenticated;
}

export function setAuthenticated(authenticated: boolean): void {
  isSessionAuthenticated = authenticated;
}

export function getAuthToken(): string | null {
  return isSessionAuthenticated ? 'session_authenticated' : null;
}

export function clearAuth(): void {
  isSessionAuthenticated = false;
}
