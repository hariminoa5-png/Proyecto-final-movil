import React, { useEffect, useState } from 'react';
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonSpinner, IonFab, IonFabButton, IonIcon, IonModal, IonButton, IonToast,
} from '@ionic/react';
import { add, trendingUp, wallet } from 'ionicons/icons';
import { getVehiculos, getIngresos, crearIngreso } from '../services/api';
import { useLocation } from 'react-router-dom';
import './pages.css';

const IngresosPage: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const preselectedVid = params.get('vid');

  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [selectedVid, setSelectedVid] = useState<number | null>(preselectedVid ? parseInt(preselectedVid) : null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [monto, setMonto] = useState('');
  const [concepto, setConcepto] = useState('');
  
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
    getIngresos(selectedVid).then(d => {
      setItems(Array.isArray(d) ? d : d?.items || d?.ingresos || []);
    }).catch(() => setItems([]));
  }, [selectedVid]);

  const handleSave = async () => {
    if (!monto.trim() || !selectedVid || !concepto.trim()) { 
      setError('Completa el monto y el concepto'); 
      return; 
    }
    setSaving(true);
    try {
      await crearIngreso({
        vehiculo_id: selectedVid,
        monto: parseFloat(monto) || 0,
        concepto: concepto.trim(),
        fecha: new Date().toISOString().split('T')[0],
      });
      setSuccess('Ingreso registrado ✅');
      setShowModal(false);
      setMonto(''); setConcepto('');
      const d = await getIngresos(selectedVid);
      setItems(Array.isArray(d) ? d : d?.items || d?.ingresos || []);
    } catch (e: any) { setError(e?.response?.data?.message || 'Error al registrar'); }
    setSaving(false);
  };

  return (
    <IonPage className="page-dark">
      <IonHeader className="ion-no-border">
        <IonToolbar className="page-toolbar">
          <IonButtons slot="start"><IonBackButton defaultHref="/inicio" text="" /></IonButtons>
          <IonTitle className="page-title-bar">Ingresos</IonTitle>
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
            <div className="empty-icon"><IonIcon icon={wallet} /></div>
            <div className="empty-text">No hay ingresos registrados para este vehículo.</div>
          </div>
        ) : (
          <div style={{ paddingTop: 10, paddingBottom: 40 }}>
            {items.map((m: any, i: number) => (
              <div key={m.id || i} className="card-item animate-fade">
                <div className="card-item-icon"><IonIcon icon={trendingUp} /></div>
                <div className="card-item-body">
                  <div className="card-item-title">{m.concepto}</div>
                  <div className="card-item-sub">{m.fecha}</div>
                </div>
                <div className="card-item-badge success" style={{ color: '#00f2c3', background: 'rgba(0, 242, 195, 0.1)' }}>+RD${m.monto}</div>
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
              <IonTitle className="page-title-bar">Nuevo <span>Ingreso</span></IonTitle>
              <IonButtons slot="end"><IonButton onClick={() => setShowModal(false)} color="primary">Cerrar</IonButton></IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="page-dark">
            <div className="form-container">
              <div className="form-field">
                <label className="form-label">Concepto de Ingreso</label>
                <input className="native-input" type="text" placeholder="Ej. Taxi, Alquiler, Venta..." value={concepto} onChange={e => setConcepto(e.target.value)} />
              </div>
              <div className="form-field">
                <label className="form-label">Monto Recibido (RD$)</label>
                <input className="native-input" type="number" placeholder="Ej. 5000" value={monto} onChange={e => setMonto(e.target.value)} />
              </div>
              <IonButton className="login-btn-main" expand="block" onClick={handleSave} disabled={saving} style={{ marginTop: 24 }}>
                {saving ? <IonSpinner name="crescent" /> : 'REGISTRAR INGRESO'}
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

export default IngresosPage;
