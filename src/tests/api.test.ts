import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { authLogin, authRegistro, authActivar } from '../services/api';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('authLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('llama al endpoint correcto con datax form-encoded', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { token: 'tok123', refreshToken: 'ref456' },
    });

    const result = await authLogin('2023-1234', 'mipass');

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://taller-itla.ia3x.com/api/auth/login',
      expect.stringContaining('datax='),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    expect(result.token).toBe('tok123');
    expect(result.refreshToken).toBe('ref456');
  });

  it('propaga el error si la API falla', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Network Error'));
    await expect(authLogin('2023-1234', 'bad')).rejects.toThrow('Network Error');
  });
});

describe('authRegistro', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('envía la matrícula y recibe token temporal', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { token: 'temp_tok' },
    });

    const result = await authRegistro('2023-5678');

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://taller-itla.ia3x.com/api/auth/registro',
      expect.stringContaining('datax='),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    expect(result.token).toBe('temp_tok');
  });
});

describe('authActivar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('envía token y password, recibe tokens definitivos', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { token: 'final_tok', refreshToken: 'final_ref' },
    });

    const result = await authActivar('temp_tok', 'nueva123');

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://taller-itla.ia3x.com/api/auth/activar',
      expect.stringContaining('datax='),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    expect(result.token).toBe('final_tok');
  });
});
