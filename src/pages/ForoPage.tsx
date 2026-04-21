import React, { useEffect, useState } from 'react';
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonSpinner, IonFab, IonFabButton, IonIcon, IonModal, IonButton, IonToast, IonSegment, IonSegmentButton, IonLabel
} from '@ionic/react';
import { add, chatbubbles, person, send, bulb, carSport } from 'ionicons/icons';
import api, { 
  getForoPublico, getForoDetallePublico, 
  getTemasForo, getForoDetalle, 
  crearTema, responderTema,
  getVehiculos
} from '../services/api';
import { getToken } from '../services/auth';
import './pages.css';

const ForoPage: React.FC = () => {
  const [temas, setTemas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTema, setSelectedTema] = useState<any>(null);
  const [showDetalle, setShowDetalle] = useState(false);
  const [view, setView] = useState<'todos' | 'mis'>('todos');

  const isAuthenticated = !!getToken();

  // Form states
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [userVehicles, setUserVehicles] = useState<any[]>([]);
  const [selectedVid, setSelectedVid] = useState<number | null>(null);
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchTemas = async () => {
    setLoading(true);
    try {
      let data;
      if (view === 'mis' && isAuthenticated) {
        const res = await api.get('/foro/mis-temas');
        data = res.data.data;
      } else {
        data = await getForoPublico();
      }
      setTemas(Array.isArray(data) ? data : data?.items || data?.temas || []);
    } catch { setTemas([]); }
    setLoading(false);
  };

  const loadVehicles = async () => {
    if (!isAuthenticated) return;
    try {
      const v = await getVehiculos();
      const list = Array.isArray(v) ? v : v?.items || v?.vehiculos || [];
      setUserVehicles(list);
      if (list.length > 0) setSelectedVid(list[0].id);
    } catch { }
  };

  useEffect(() => { 
    fetchTemas(); 
    if (isAuthenticated) loadVehicles();
  }, [view, isAuthenticated]);

  const openDetalle = async (id: number) => {
    try {
      const data = await getForoDetallePublico(id);
      setSelectedTema(data);
      setShowDetalle(true);
    } catch { }
  };

  const handleCrear = async () => {
    if (!isAuthenticated) { setError('Debes iniciar sesión para participar'); return; }
    if (userVehicles.length === 0) {
      setError('Debes tener al menos un vehículo registrado para crear un tema.');
      return;
    }
    if (!titulo.trim() || !descripcion.trim() || !selectedVid) { 
      setError('Completa título, descripción y selecciona un vehículo.'); 
      return; 
    }
    setSaving(true);
    try {
      await crearTema({ vehiculo_id: selectedVid, titulo, descripcion });
      setSuccess('Tema publicado ✅');
      setShowModal(false);
      setTitulo(''); setDescripcion('');
      fetchTemas();
    } catch { setError('Error al publicar'); }
    setSaving(false);
  };

  const handleResponder = async () => {
    if (!isAuthenticated) { setError('Debes iniciar sesión para responder'); return; }
    if (!respuesta.trim() || !selectedTema) return;
    setSaving(true);
    try {
      await responderTema({ tema_id: selectedTema.id, contenido: respuesta });
      setRespuesta('');
      const data = await getForoDetallePublico(selectedTema.id);
      setSelectedTema(data);
    } catch { setError('Error al responder'); }
    setSaving(false);
  };

  return (
    <IonPage className="page-dark">
      <IonHeader className="ion-no-border">
        <IonToolbar className="page-toolbar">
          <IonButtons slot="start"><IonBackButton defaultHref="/inicio" text="" /></IonButtons>
          <IonTitle className="page-title-bar">Comunidad</IonTitle>
        </IonToolbar>
        {isAuthenticated && (
          <IonToolbar className="page-toolbar">
            <IonSegment value={view} onIonChange={e => setView(e.detail.value as any)} mode="ios">
              <IonSegmentButton value="todos"><IonLabel>Todos</IonLabel></IonSegmentButton>
              <IonSegmentButton value="mis"><IonLabel>Mis Temas</IonLabel></IonSegmentButton>
            </IonSegment>
          </IonToolbar>
        )}
      </IonHeader>
      <IonContent fullscreen>
        {loading ? (
          <div className="loading-center"><IonSpinner name="crescent" color="primary" /></div>
        ) : temas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><IonIcon icon={chatbubbles} /></div>
            <div className="empty-text">No hay temas {view === 'mis' ? 'tuyos ' : ''}en el foro.</div>
          </div>
        ) : (
          <div style={{ paddingTop: 10 }}>
            {temas.map((t: any) => (
              <div key={t.id} className="card-item animate-fade" onClick={() => openDetalle(t.id)}>
                <div className="card-item-body">
                  <div className="card-item-title">{t.titulo}</div>
                  <div className="card-item-sub">Por {t.propietario || t.autor || 'Usuario'} · {t.fecha}</div>
                  {t.vehiculo_marca && (
                    <div className="card-item-sub" style={{ color: 'var(--color-blue)', fontSize: 10 }}>
                      <IonIcon icon={carSport} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                      {t.vehiculo_marca} {t.vehiculo_modelo}
                    </div>
                  )}
                </div>
                <div className="card-item-badge">{t.respuestas_count || t.total_respuestas || 0} rps</div>
              </div>
            ))}
          </div>
        )}

        {isAuthenticated && (
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton className="fab-add" onClick={() => setShowModal(true)}>
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFab>
        )}

        {/* Modal Crear Tema */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader className="ion-no-border">
            <IonToolbar className="page-toolbar">
              <IonTitle className="page-title-bar">Nuevo <span>Tema</span></IonTitle>
              <IonButtons slot="end"><IonButton onClick={() => setShowModal(false)} color="primary">Cerrar</IonButton></IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="page-dark">
            <div className="form-container">
              <div className="form-field">
                <label className="form-label">Vehículo Asociado *</label>
                <select className="native-select" value={selectedVid || ''} onChange={e => setSelectedVid(parseInt(e.target.value))}>
                  {userVehicles.length === 0 ? (
                    <option disabled>No tienes vehículos registrados</option>
                  ) : (
                    userVehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.marca} {v.modelo} ({v.placa})</option>
                    ))
                  )}
                </select>
                {userVehicles.length === 0 && (
                  <p style={{ color: 'var(--color-danger)', fontSize: 11, marginTop: 8 }}>
                    Debes registrar un vehículo primero.
                  </p>
                )}
              </div>

              <div className="form-field">
                <label className="form-label">Título del Tema</label>
                <input className="native-input" type="text" placeholder="¿Cómo limpiar inyectores?" value={titulo} onChange={e => setTitulo(e.target.value)} />
              </div>
              <div className="form-field">
                <label className="form-label">Descripción</label>
                <textarea className="native-textarea" placeholder="Escribe aquí tu duda o aporte..." value={descripcion} onChange={e => setDescripcion(e.target.value)} />
              </div>
              <IonButton className="login-btn-main" expand="block" onClick={handleCrear} disabled={saving || userVehicles.length === 0} style={{ marginTop: 20 }}>
                {saving ? <IonSpinner name="crescent" /> : 'PUBLICAR EN FORO'}
              </IonButton>
            </div>
          </IonContent>
        </IonModal>

        {/* Modal Detalle Tema */}
        <IonModal isOpen={showDetalle} onDidDismiss={() => setShowDetalle(false)}>
          <IonHeader className="ion-no-border">
            <IonToolbar className="page-toolbar">
              <IonTitle className="page-title-bar">Conversación</IonTitle>
              <IonButtons slot="end"><IonButton onClick={() => setShowDetalle(false)} color="primary">Cerrar</IonButton></IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="page-dark">
            {selectedTema && (
              <div style={{ paddingBottom: 100 }}>
                <div className="detail-body">
                  <div className="detail-title">{selectedTema.titulo}</div>
                  <div className="detail-sub">Publicado por {selectedTema.autor || selectedTema.propietario} el {selectedTema.fecha}</div>
                  <div className="detail-desc" style={{ background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 12 }}>
                    {selectedTema.descripcion || selectedTema.contenido}
                  </div>
                </div>

                <div className="sec-label">Respuestas ({selectedTema.respuestas?.length || 0})</div>
                {(selectedTema.respuestas || []).map((r: any, i: number) => (
                  <div key={i} className="bubble">
                    <div className="bubble-author">{r.autor || r.propietario}</div>
                    <div className="bubble-text">{r.contenido}</div>
                    <div className="bubble-date">{r.fecha}</div>
                  </div>
                ))}
              </div>
            )}
          </IonContent>
          {isAuthenticated && (
            <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                <textarea 
                  className="native-textarea" 
                  style={{ minHeight: 46, height: 46, paddingTop: 12 }} 
                  placeholder="Escribe una respuesta..." 
                  value={respuesta} 
                  onChange={e => setRespuesta(e.target.value)} 
                />
                <IonButton className="login-btn-main" style={{ margin: 0, height: 46, width: 50, '--padding-start': 0, '--padding-end': 0 }} onClick={handleResponder} disabled={saving}>
                  <IonIcon icon={send} />
                </IonButton>
              </div>
            </div>
          )}
        </IonModal>

        <IonToast isOpen={!!error} message={error} duration={3000} color="danger" onDidDismiss={() => setError('')} />
        <IonToast isOpen={!!success} message={success} duration={2000} color="success" onDidDismiss={() => setSuccess('')} />
      </IonContent>
    </IonPage>
  );
};

export default ForoPage;
