import React, { useEffect, useState } from 'react';
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonSpinner, IonFab, IonFabButton, IonIcon, IonModal, IonButton, IonToast,
} from '@ionic/react';
import { add, cash } from 'ionicons/icons';
import { getVehiculos, getGastos, crearGasto, getCategoriasGastos } from '../services/api';
import { useLocation } from 'react-router-dom';
import './pages.css';

const GastosPage: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const preselectedVid = params.get('vid');

  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [selectedVid, setSelectedVid] = useState<number | null>(preselectedVid ? parseInt(preselectedVid) : null);
  const [items, setItems] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [monto, setMonto] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [descripcion, setDescripcion] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const v = await getVehiculos();
      const vList = Array.isArray(v) ? v : v?.items || v?.vehiculos || [];
      setVehiculos(vList);
      if (!selectedVid && vList.length > 0) setSelectedVid(vList[0].id);

      const c = await getCategoriasGastos();
      const cList = Array.isArray(c) ? c : c?.items || c?.categorias || [];
      setCategorias(cList);
      if (cList.length > 0) setSelectedCategoryId(cList[0].id.toString());
    } catch { }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (!selectedVid) return;
    getGastos(selectedVid).then(d => {
      setItems(Array.isArray(d) ? d : d?.items || d?.gastos || []);
    }).catch(() => setItems([])).finally(() => setLoading(false));
  }, [selectedVid]);

  const handleSave = async () => {
    if (!monto.trim() || !selectedVid || !selectedCategoryId) { 
      setError('Completa el monto y la categoría'); 
      return; 
    }
    setSaving(true);
    try {
      const catObj = categorias.find(c => c.id.toString() === selectedCategoryId);
      await crearGasto({
        vehiculo_id: selectedVid, 
        categoriaId: parseInt(selectedCategoryId),
        monto: parseFloat(monto) || 0,
        descripcion: descripcion.trim() || catObj?.nombre || 'Gasto',
        fecha: new Date().toISOString().split('T')[0],
      });
      setSuccess('Gasto registrado ✅');
      setShowModal(false);
      setMonto(''); setDescripcion('');
      const d = await getGastos(selectedVid);
      setItems(Array.isArray(d) ? d : d?.items || d?.gastos || []);
    } catch (e: any) { 
      setError(e?.response?.data?.message || 'Error al registrar'); 
    }
    setSaving(false);
  };

  return (
    <IonPage className="page-dark">
      <IonHeader className="ion-no-border">
        <IonToolbar className="page-toolbar">
          <IonButtons slot="start"><IonBackButton defaultHref="/inicio" text="" /></IonButtons>
          <IonTitle className="page-title-bar">Gastos</IonTitle>
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
            <div className="empty-icon"><IonIcon icon={cash} /></div>
            <div className="empty-text">No hay gastos registrados para este vehículo.</div>
          </div>
        ) : (
          <div style={{ paddingTop: 10, paddingBottom: 40 }}>
            {items.map((m: any, i: number) => (
              <div key={m.id || i} className="card-item animate-fade">
                <div className="card-item-icon"><IonIcon icon={cash} /></div>
                <div className="card-item-body">
                  <div className="card-item-title">{m.categoria || m.categoria_nombre || 'Gasto'}</div>
                  <div className="card-item-sub">{m.descripcion} · {m.fecha}</div>
                </div>
                <div className="card-item-badge danger" style={{ color: '#ff3e3e', background: 'rgba(255, 62, 62, 0.1)' }}>-RD${m.monto}</div>
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
              <IonTitle className="page-title-bar">Nuevo <span>Gasto</span></IonTitle>
              <IonButtons slot="end"><IonButton onClick={() => setShowModal(false)} color="primary">Cerrar</IonButton></IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="page-dark">
            <div className="form-container">
              <div className="form-field">
                <label className="form-label">Categoría</label>
                <select className="native-select" value={selectedCategoryId} onChange={e => setSelectedCategoryId(e.target.value)}>
                  {categorias.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Monto (RD$)</label>
                <input className="native-input" type="number" placeholder="Ej. 1500" value={monto} onChange={e => setMonto(e.target.value)} />
              </div>
              <div className="form-field">
                <label className="form-label">Descripción</label>
                <input className="native-input" type="text" placeholder="Ej. Pago marbete" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
              </div>
              <IonButton className="login-btn-main" expand="block" onClick={handleSave} disabled={saving} style={{ marginTop: 24 }}>
                {saving ? <IonSpinner name="crescent" /> : 'REGISTRAR GASTO'}
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

export default GastosPage;
