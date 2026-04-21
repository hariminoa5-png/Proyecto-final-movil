import React, { useEffect, useState } from 'react';
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonSpinner, IonIcon, IonModal, IonButton, IonToast,
} from '@ionic/react';
import { disc, alertCircle, construct, checkmarkCircle } from 'ionicons/icons';
import { getVehiculos, getGomas, registrarPinchazo, actualizarGoma } from '../services/api';
import { useLocation } from 'react-router-dom';
import './pages.css';

const GOMAS_POS = ['Delantera Izquierda', 'Delantera Derecha', 'Trasera Izquierda', 'Trasera Derecha'];
const ESTADOS = ['buena', 'regular', 'mala', 'reemplazada'];

const GomasPage: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const preselectedVid = params.get('vid');

  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [selectedVid, setSelectedVid] = useState<number | null>(preselectedVid ? parseInt(preselectedVid) : null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [showModal, setShowModal] = useState(false);
  const [selectedGoma, setSelectedGoma] = useState<any>(null);
  const [newEstado, setNewEstado] = useState('');
  const [pinchazoDesc, setPinchazoDesc] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const v = await getVehiculos();
        const list = Array.isArray(v) ? v : v?.items || v?.vehiculos || [];
        setVehiculos(list);
        if (!selectedVid && list.length > 0) setSelectedVid(list[0].id);
      } catch { }
      setLoading(false);
    })();
  }, []);

  const loadGomas = async (vid: number) => {
    setLoading(true);
    try {
      const d = await getGomas(vid);
      setItems(Array.isArray(d) ? d : d?.items || d?.gomas || []);
    } catch { setItems([]); }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedVid) loadGomas(selectedVid);
  }, [selectedVid]);

  const handleUpdateEstado = async () => {
    if (!selectedGoma || !newEstado) return;
    setSaving(true);
    try {
      await actualizarGoma({ goma_id: selectedGoma.id, estado: newEstado });
      setSuccess('Estado actualizado ✅');
      setShowModal(false);
      loadGomas(selectedVid!);
    } catch { setError('Error al actualizar estado'); }
    setSaving(false);
  };

  const handleReportPinchazo = async () => {
    if (!selectedGoma || !pinchazoDesc.trim()) return;
    setSaving(true);
    try {
      await registrarPinchazo({ goma_id: selectedGoma.id, descripcion: pinchazoDesc });
      setSuccess('Pinchazo reportado ✅');
      setShowModal(false);
      loadGomas(selectedVid!);
    } catch { setError('Error al reportar pinchazo'); }
    setSaving(false);
  };

  return (
    <IonPage className="page-dark">
      <IonHeader className="ion-no-border">
        <IonToolbar className="page-toolbar">
          <IonButtons slot="start"><IonBackButton defaultHref="/inicio" text="" /></IonButtons>
          <IonTitle className="page-title-bar">Neumáticos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="vehicle-selector">
          {vehiculos.map(v => (
            <div key={v.id} className={`v-chip ${selectedVid === v.id ? 'active' : ''}`} onClick={() => setSelectedVid(v.id)}>
              {v.marca} {v.modelo}
            </div>
          ))}
        </div>

        {loading ? (
          <div className="loading-center"><IonSpinner name="crescent" color="primary" /></div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><IonIcon icon={disc} /></div>
            <div className="empty-text">No hay información de neumáticos.</div>
          </div>
        ) : (
          <div style={{ paddingTop: 10 }}>
            <div className="sec-label">Selecciona una goma para gestionar</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 20px' }}>
              {items.map((g: any, i: number) => (
                <div key={g.id || i} className="card-item" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '20px 10px' }} onClick={() => {
                  setSelectedGoma(g);
                  setNewEstado(g.estado || 'buena');
                  setPinchazoDesc('');
                  setShowModal(true);
                }}>
                  <div className={`goma-wheel large ${g.estado?.toLowerCase() || 'buena'}`}>
                    <IonIcon icon={disc} />
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <div className="card-item-title" style={{ fontSize: 13 }}>{g.posicion || GOMAS_POS[i]}</div>
                    <div className="card-item-sub" style={{ fontSize: 11 }}>{g.estado || 'En buen estado'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} breakpoints={[0, 0.5, 0.8]} initialBreakpoint={0.8}>
          <IonHeader className="ion-no-border">
            <IonToolbar className="page-toolbar">
              <IonTitle className="page-title-bar">Gestión de <span>Neumático</span></IonTitle>
              <IonButtons slot="end"><IonButton onClick={() => setShowModal(false)} color="primary">Cerrar</IonButton></IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="page-dark">
            {selectedGoma && (
              <div className="form-container">
                <div className="sec-label" style={{ paddingLeft: 0 }}>Actualizar Estado</div>
                <div className="form-field">
                  <select className="native-select" value={newEstado} onChange={e => setNewEstado(e.target.value)}>
                    {ESTADOS.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                  </select>
                </div>
                <IonButton className="login-btn-main" expand="block" onClick={handleUpdateEstado} disabled={saving}>
                  {saving ? <IonSpinner name="crescent" /> : 'ACTUALIZAR ESTADO'}
                </IonButton>

                <div className="divider" style={{ margin: '30px 0' }}><hr/><span>o</span><hr/></div>

                <div className="sec-label" style={{ paddingLeft: 0 }}>Reportar Pinchazo</div>
                <div className="form-field">
                  <textarea className="native-textarea" placeholder="Describe el problema..." value={pinchazoDesc} onChange={e => setPinchazoDesc(e.target.value)} />
                </div>
                <IonButton className="btn-secondary" fill="outline" expand="block" onClick={handleReportPinchazo} disabled={saving} style={{ '--border-radius': '12px' }}>
                  {saving ? <IonSpinner name="crescent" /> : 'REGISTRAR PINCHAZO'}
                </IonButton>
              </div>
            )}
          </IonContent>
        </IonModal>

        <IonToast isOpen={!!error} message={error} duration={3000} color="danger" onDidDismiss={() => setError('')} />
        <IonToast isOpen={!!success} message={success} duration={2000} color="success" onDidDismiss={() => setSuccess('')} />
      </IonContent>
    </IonPage>
  );
};

export default GomasPage;
