import axios from 'axios';
import { getToken } from './auth';

const BASE_URL = 'https://taller-itla.ia3x.com/api';

const encodeDatax = (data: Record<string, unknown>): string =>
  `datax=${encodeURIComponent(JSON.stringify(data))}`;

const FORM_HEADERS = {
  'Content-Type': 'application/x-www-form-urlencoded',
};

const api = axios.create({
  baseURL: BASE_URL,
  headers: FORM_HEADERS,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper matching the official Swagger React/Fetch example pattern
const postDatax = async (endpoint: string, datos: Record<string, unknown>): Promise<any> => {
  const formData = new URLSearchParams();
  formData.append('datax', JSON.stringify(datos));
  const { data } = await api.post(endpoint, formData.toString());
  return data;
};

// ─── AUTH ────────────────────────────────────────────────────────────────────

export interface LoginResponse {
  token: string;
  refreshToken: string;
  nombre?: string;
  foto?: string;
}

export interface RegistroResponse {
  token: string;
  message?: string;
}

export interface ActivarResponse {
  token: string;
  refreshToken: string;
}

export const authLogin = async (
  matricula: string,
  contrasena: string
): Promise<LoginResponse> => {
  const { data } = await api.post('/auth/login', encodeDatax({ matricula, contrasena }));
  return data.data;
};

export const authRegistro = async (
  matricula: string
): Promise<{ token: string }> => {
  const { data } = await api.post(
    '/auth/registro',
    encodeDatax({ matricula })
  );
  return data.data;
};

export const authActivar = async (
  token: string,
  contrasena: string
): Promise<ActivarResponse> => {
  const { data } = await api.post(
    '/auth/activar',
    encodeDatax({ token, contrasena })
  );
  return data.data;
};

export const authOlvidar = async (matricula: string): Promise<any> => {
  const { data } = await api.post('/auth/olvidar', encodeDatax({ matricula }));
  return data;
};

export const authRefresh = async (refreshToken: string): Promise<ActivarResponse> => {
  const { data } = await api.post('/auth/refresh', encodeDatax({ refreshToken }));
  return data.data;
};

// ─── PERFIL ─────────────────────────────────────────────────────────────────

export const getPerfil = async (): Promise<any> => {
  const { data } = await api.get('/perfil');
  return data.data;
};

export const subirFotoPerfil = async (foto: File): Promise<any> => {
  const formData = new FormData();
  formData.append('foto', foto);
  const { data } = await api.post('/perfil/foto', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// ─── VEHÍCULOS ──────────────────────────────────────────────────────────────

export const getVehiculosPublicos = async (): Promise<any> => {
  const { data } = await api.get('/publico/vehiculos');
  return data.data;
};

export const getVehiculos = async (params?: any): Promise<any> => {
  const { data } = await api.get('/vehiculos', { params });
  return data.data;
};

export const crearVehiculo = async (
  datos: Record<string, unknown>,
  foto?: File
): Promise<any> => {
  const formData = new FormData();
  formData.append('datax', JSON.stringify(datos));
  if (foto) formData.append('foto', foto);
  const { data } = await api.post('/vehiculos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const getVehiculoDetalle = async (id: number): Promise<any> => {
  const { data } = await api.get('/vehiculos/detalle', { params: { id } });
  return data.data;
};

// ─── MANTENIMIENTOS ─────────────────────────────────────────────────────────

export const getMantenimientos = async (vehiculoId: number): Promise<any> => {
  const { data } = await api.get('/mantenimientos', { params: { vehiculo_id: vehiculoId } });
  return data.data;
};

export const crearMantenimiento = async (
  datos: Record<string, unknown>,
  fotos?: File[]
): Promise<any> => {
  const formData = new FormData();
  formData.append('datax', JSON.stringify(datos));
  if (fotos) fotos.forEach((f) => formData.append('fotos[]', f));
  const { data } = await api.post('/mantenimientos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// ─── COMBUSTIBLE / ACEITE ───────────────────────────────────────────────────

export const getCombustibles = async (vehiculoId: number): Promise<any> => {
  const { data } = await api.get('/combustibles', { params: { vehiculo_id: vehiculoId } });
  return data.data;
};

export const crearCombustible = async (datos: Record<string, unknown>): Promise<any> => {
  return postDatax('/combustibles', datos);
};

// ─── GOMAS ──────────────────────────────────────────────────────────────────

export const getGomas = async (vehiculoId: number): Promise<any> => {
  const { data } = await api.get('/gomas', { params: { vehiculo_id: vehiculoId } });
  return data.data;
};

export const actualizarGoma = async (datos: { goma_id: number, estado: string }): Promise<any> => {
  return postDatax('/gomas/actualizar', datos);
};

export const registrarPinchazo = async (datos: { goma_id: number, descripcion: string }): Promise<any> => {
  return postDatax('/gomas/pinchazos', datos);
};

// ─── GASTOS ─────────────────────────────────────────────────────────────────

export const getCategoriasGastos = async (): Promise<any> => {
  const { data } = await api.get('/gastos/categorias');
  return data.data;
};

export const getGastos = async (vehiculoId: number): Promise<any> => {
  const { data } = await api.get('/gastos', { params: { vehiculo_id: vehiculoId } });
  return data.data;
};

export const crearGasto = async (datos: Record<string, unknown>): Promise<any> => {
  return postDatax('/gastos', datos);
};

// ─── INGRESOS ───────────────────────────────────────────────────────────────

export const getIngresos = async (vehiculoId: number): Promise<any> => {
  const { data } = await api.get('/ingresos', { params: { vehiculo_id: vehiculoId } });
  return data.data;
};

export const crearIngreso = async (datos: Record<string, unknown>): Promise<any> => {
  return postDatax('/ingresos', datos);
};

// ─── FORO ───────────────────────────────────────────────────────────────────

export const getForoPublico = async (): Promise<any> => {
  const { data } = await api.get('/publico/foro');
  return data.data;
};

export const getForoDetallePublico = async (id: number): Promise<any> => {
  const { data } = await api.get('/publico/foro/detalle', { params: { id } });
  return data.data;
};

export const getTemasForo = async (): Promise<any> => {
  const { data } = await api.get('/foro/temas');
  return data.data;
};

export const getForo = getTemasForo;

export const crearTemaForo = async (datos: Record<string, unknown>): Promise<any> => {
  return postDatax('/foro/crear', datos);
};

export const crearTema = crearTemaForo;

export const getRespuestasForo = async (temaId: number): Promise<any> => {
  const { data } = await api.get('/foro/detalle', { params: { id: temaId } });
  return data.data?.respuestas || [];
};

export const getForoDetalle = async (id: number): Promise<any> => {
  // El API no tiene un /foro/detalle, usamos las respuestas y buscamos el tema en la lista si es necesario
  // Pero para que funcione el flujo, devolvemos un objeto que simule el detalle
  const temas = await getTemasForo();
  const tema = (Array.isArray(temas) ? temas : temas.items || []).find((t: any) => t.id === id);
  const respuestas = await getRespuestasForo(id);
  return { ...tema, respuestas };
};

export const crearRespuestaForo = async (datos: Record<string, unknown>): Promise<any> => {
  return postDatax('/foro/responder', datos);
};

export const responderTema = crearRespuestaForo;

// ─── NOTICIAS ───────────────────────────────────────────────────────────────

export const getNoticias = async (page = 1): Promise<any> => {
  const { data } = await api.get('/noticias', { params: { page } });
  return data.data;
};

export const getNoticiaDetalle = async (id: number): Promise<any> => {
  const { data } = await api.get('/noticias/detalle', { params: { id } });
  return data.data;
};

// ─── VIDEOS ─────────────────────────────────────────────────────────────────

export const getVideos = async (): Promise<any> => {
  const { data } = await api.get('/videos');
  return data.data;
};

// ─── CATÁLOGO ───────────────────────────────────────────────────────────────

export const getCatalogo = async (filtros?: { marca?: string; anio?: number }): Promise<any> => {
  const { data } = await api.get('/catalogo', { params: filtros });
  return data.data;
};

export const getCatalogoDetalle = async (id: number): Promise<any> => {
  const { data } = await api.get('/catalogo/detalle', { params: { id } });
  return data.data;
};

export default api;
