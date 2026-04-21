import { describe, it, expect, beforeEach } from 'vitest';
import { saveTokens, getToken, getRefreshToken, clearTokens, isAuthenticated } from '../services/auth';

beforeEach(() => localStorage.clear());

describe('saveTokens', () => {
  it('guarda token y refreshToken en localStorage', () => {
    saveTokens('tok', 'ref');
    expect(localStorage.getItem('autotrack_token')).toBe('tok');
    expect(localStorage.getItem('autotrack_refresh')).toBe('ref');
  });
});

describe('getToken', () => {
  it('retorna null si no hay token', () => {
    expect(getToken()).toBeNull();
  });
  it('retorna el token guardado', () => {
    localStorage.setItem('autotrack_token', 'abc');
    expect(getToken()).toBe('abc');
  });
});

describe('clearTokens', () => {
  it('elimina ambos tokens', () => {
    saveTokens('t', 'r');
    clearTokens();
    expect(getToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
  });
});

describe('isAuthenticated', () => {
  it('retorna false si no hay token', () => {
    expect(isAuthenticated()).toBe(false);
  });
  it('retorna true si hay token', () => {
    localStorage.setItem('autotrack_token', 'xyz');
    expect(isAuthenticated()).toBe(true);
  });
});
