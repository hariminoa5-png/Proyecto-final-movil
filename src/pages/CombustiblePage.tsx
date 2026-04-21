import React, { useEffect, useState } from 'react';
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonSpinner, IonFab, IonFabButton, IonIcon, IonModal, IonButton, IonToast,
} from '@ionic/react';
import { add, water, calendar, wallet } from 'ionicons/icons';
import { getVehiculos, getCombustibles, crearCombustible } from '../services/api';
import { useLocation } from 'react-router-dom';
import './pages.css';

const CombustiblePage: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const preselectedVid = params.get('vid');

  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [selectedVid, setSelectedVid] = useState<number | null>(preselectedVid ? parseInt(preselectedVid) : null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [tipo, setTipo] = useState('combustible');
  const [cantidad, setCantidad] = useState('');
  const [unidad, setUnidad] = useState('Galones');
  const [monto, setMonto] = useState('');
  
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
    getCombustibles(selectedVid).then(d => {
      setItems(Array.isArray(d) ? d : d?.items || d?.combustibles || []);
    }).catch(() => setItems([])).finally(() => setLoading(false));
  }, [selectedVid]);

  const handleSave = async () => {
    if (!monto.trim() || !selectedVid) { setError('Ingresa el monto'); return; }
    setSaving(true);
    try {
      await crearCombustible({
        vehiculo_id: selectedVid, tipo: tipo,
        cantidad: parseFloat(cantidad) || 0, unidad: unidad,
        monto: parseFloat(monto) || 0,
        fecha: new Date().toISOString().split('T')[0],
      });
      setSuccess('Registro completado ✅');
      setShowModal(false);
      setCantidad(''); setMonto('');
      const d = await getCombustibles(selectedVid);
      setItems(Array.isArray(d) ? d : d?.items || d?.combustibles || []);
    } catch (e: any) { setError(e?.response?.data?.message || 'Error al registrar'); }
    setSaving(false);
  };

  return (
    <IonPage className="page-dark">
      <IonHeader className="ion-no-border">
        <IonToolbar className="page-toolbar">
          <IonButtons slot="start"><IonBackButton defaultHref="/inicio" text="" /></IonButtons>
          <IonTitle className="page-title-bar">Combustibles</IonTitle>
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
            <div className="empty-icon"><IonIcon icon={water} /></div>
            <div className="empty-text">No hay registros de combustible.<br/>Toca + para añadir una recarga.</div>
          </div>
        ) : (
          <div style={{ paddingTop: 10 }}>
            {items.map((m: any, i: number) => (
              <div key={m.id || i} className="card-item">
                <div className="card-item-icon"><IonIcon icon={water} /></div>
                <div className="card-item-body">
                  <div className="card-item-title">{m.tipo_combustible}</div>
                  <div className="card-item-sub">{m.cantidad} {m.unidad_medida} · {m.fecha}</div>
                </div>
                <div className="card-item-badge">RD${m.monto}</div>
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
              <IonTitle className="page-title-bar">Nueva <span>Recarga</span></IonTitle>
              <IonButtons slot="end"><IonButton onClick={() => setShowModal(false)} color="primary">Cerrar</IonButton></IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="page-dark">
            <div className="form-container">
              <div className="form-field">
                <label className="form-label">Tipo de Combustible</label>
                <select className="native-select" value={tipo} onChange={e => setTipo(e.target.value)}>
                  <option value="combustible">Combustible</option><option value="aceite">Aceite</option>
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Cantidad</label>
                <input className="native-input" type="number" placeholder="Ej. 10.5" value={cantidad} onChange={e => setCantidad(e.target.value)} />
              </div>
              <div className="form-field">
                <label className="form-label">Unidad de Medida</label>
                <select className="native-select" value={unidad} onChange={e => setUnidad(e.target.value)}>
                  <option>Galones</option><option>Litros</option><option>m³</option><option>kWh</option>
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Monto (RD$)</label>
                <input className="native-input" type="number" placeholder="Ej. 3000" value={monto} onChange={e => setMonto(e.target.value)} />
              </div>
              <IonButton className="btn-primary" expand="block" onClick={handleSave} disabled={saving} style={{ marginTop: 24, height: 56, '--border-radius': '16px' }}>
                {saving ? <IonSpinner name="crescent" /> : 'REGISTRAR RECARGA'}
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

export default CombustiblePage;
