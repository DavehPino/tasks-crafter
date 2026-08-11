const SESSION_ID_KEY = 'sessionId';

/**
 * Obtiene o crea el sessionId para la sesión actual.
 * El sessionId persiste en localStorage, permitiendo continuidad entre refreshes.
 */
export const getOrCreateSessionId = (): string => {
  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  
  if (!sessionId) {
    // Generar un nuevo sessionId (UUID v4)
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  
  return sessionId;
};

/**
 * Obtiene el sessionId actual sin crear uno nuevo.
 */
export const getSessionId = (): string | null => {
  return localStorage.getItem(SESSION_ID_KEY);
};

/**
 * Limpia el sessionId (logout).
 */
export const clearSessionId = (): void => {
  localStorage.removeItem(SESSION_ID_KEY);
};
