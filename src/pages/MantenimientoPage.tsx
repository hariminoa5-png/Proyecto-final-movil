import React, { useEffect, useState, useRef } from 'react';
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonSpinner, IonFab, IonFabButton, IonIcon, IonModal, IonButton, IonToast,
} from '@ionic/react';
import { add, build, calendar, card, camera, image, trash } from 'ionicons/icons';
import { getVehiculos, getMantenimientos, crearMantenimiento } from '../services/api';
import { useLocation } from 'react-router-dom';
import './pages.css';

const MantenimientoPage: React.FC = () => {
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const params = new URLSearchParams(location.search);
  const preselectedVid = params.get('vid');

  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [selectedVid, setSelectedVid] = useState<number | null>(preselectedVid ? parseInt(preselectedVid) : null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Form states
  const [tipo, setTipo] = useState('');
  const [costo, setCosto] = useState('');
  const [piezas, setPiezas] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [fotos, setFotos] = useState<File[]>([]);
  const [fotoPreviews, setFotoPreviews] = useState<string[]>([]);
  
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

  useEffect(() => {
    if (!selectedVid) return;
    setLoading(true);
    getMantenimientos(selectedVid).then(d => {
      setItems(Array.isArray(d) ? d : d?.items || d?.mantenimientos || []);
    }).catch(() => setItems([])).finally(() => setLoading(false));
  }, [selectedVid]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (fotos.length + files.length > 5) {
      setError('Máximo 5 fotos permitidas');
      return;
    }
    const newFotos = [...fotos, ...files];
    setFotos(newFotos);
    setFotoPreviews([...fotoPreviews, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeFoto = (index: number) => {
    const newFotos = [...fotos];
    newFotos.splice(index, 1);
    const newPreviews = [...fotoPreviews];
    newPreviews.splice(index, 1);
    setFotos(newFotos);
    setFotoPreviews(newPreviews);
  };

  const handleSave = async () => {
    if (!tipo.trim() || !selectedVid) { setError('Completa el tipo de mantenimiento'); return; }
    setSaving(true);
    try {
      await crearMantenimiento({
        vehiculo_id: selectedVid, 
        tipo: tipo.trim(),
        costo: parseFloat(costo) || 0, 
        piezas: piezas.trim(),
        fecha: fecha,
      }, fotos);
      
      setSuccess('Mantenimiento registrado ✅');
      setShowModal(false);
      resetForm();
      const d = await getMantenimientos(selectedVid);
      setItems(Array.isArray(d) ? d : d?.items || d?.mantenimientos || []);
    } catch (e: any) { setError(e?.response?.data?.message || 'Error al registrar'); }
    setSaving(false);
  };

  const resetForm = () => {
    setTipo(''); setCosto(''); setPiezas(''); setFecha(new Date().toISOString().split('T')[0]);
    setFotos([]); setFotoPreviews([]);
  };

  return (
    <IonPage className="page-dark">
      <IonHeader className="ion-no-border">
        <IonToolbar className="page-toolbar">
          <IonButtons slot="start"><IonBackButton defaultHref="/inicio" text="" /></IonButtons>
          <IonTitle className="page-title-bar">Taller <span>Mantenimiento</span></IonTitle>
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
            <div className="empty-icon"><IonIcon icon={build} /></div>
            <div className="empty-text">No hay mantenimientos registrados.</div>
          </div>
        ) : (
          <div style={{ paddingTop: 10 }}>
            {items.map((m: any, i: number) => (
              <div key={m.id || i} className="card-item">
                <div className="card-item-icon"><IonIcon icon={build} /></div>
                <div className="card-item-body">
                  <div className="card-item-title">{m.tipo}</div>
                  <div className="card-item-sub">{m.piezas || 'Solo servicio'} · {m.fecha}</div>
                </div>
                <div className="card-item-badge">RD${m.costo || 0}</div>
              </div>
            ))}
          </div>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton className="fab-add" onClick={() => setShowModal(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader className="ion-no-border">
            <IonToolbar className="page-toolbar">
              <IonTitle className="page-title-bar">Nuevo <span>Servicio</span></IonTitle>
              <IonButtons slot="end"><IonButton onClick={() => setShowModal(false)} color="primary">Cerrar</IonButton></IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="page-dark">
            <div className="form-container">
              <div className="sec-label" style={{ paddingLeft: 0 }}>Evidencia (máx. 5 fotos)</div>
              <div className="photo-grid">
                {fotoPreviews.map((p, i) => (
                  <div key={i} className="photo-chip" style={{ position: 'relative' }}>
                    <img src={p} alt="p" />
                    <button onClick={() => removeFoto(i)} style={{ position: 'absolute', top: 5, right: 5, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', color: '#fff', padding: 2 }}>
                      <IonIcon icon={trash} />
                    </button>
                  </div>
                ))}
                {fotos.length < 5 && (
                  <div className="photo-chip" onClick={() => fileInputRef.current?.click()} style={{ borderStyle: 'dashed', opacity: 0.5 }}>
                    <IonIcon icon={camera} />
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" multiple onChange={handleFileChange} />

              <div className="form-field">
                <label className="form-label">Tipo de Servicio *</label>
                <input className="native-input" type="text" placeholder="Ej. Cambio de aceite" value={tipo} onChange={e => setTipo(e.target.value)} />
              </div>
              <div className="form-field">
                <label className="form-label">Costo (RD$)</label>
                <input className="native-input" type="number" placeholder="0.00" value={costo} onChange={e => setCosto(e.target.value)} />
              </div>
              <div className="form-field">
                <label className="form-label">Insumos/Piezas</label>
                <input className="native-input" type="text" placeholder="Filtro, Bujías, etc." value={piezas} onChange={e => setPiezas(e.target.value)} />
              </div>
              <div className="form-field">
                <label className="form-label">Fecha</label>
                <input className="native-input" type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
              </div>
              
              <IonButton className="login-btn-main" expand="block" onClick={handleSave} disabled={saving} style={{ marginTop: 24 }}>
                {saving ? <IonSpinner name="crescent" /> : 'REGISTRAR SERVICIO'}
              </IonButton>
            </div>
          </IonContent>
        </IonModal>

        <IonToast isOpen={!!error} message={error} duration={3000} color="danger" onDidDismiss={() => setError('')} />
        <IonToast isOpen={!!success} message={success} duration={2000} color="success" onDidDismiss={() => setSuccess('')} />
      </IonContent>
    </IonPage>
  );
};

export default MantenimientoPage;
