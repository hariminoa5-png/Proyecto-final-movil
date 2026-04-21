import React, { useEffect, useState, useRef } from 'react';
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonSpinner, IonFab, IonFabButton, IonIcon, IonModal, IonButton, IonToast,
} from '@ionic/react';
import { add, car, calendar, card, barcode, settings, camera } from 'ionicons/icons';
import { getVehiculos, crearVehiculo } from '../services/api';
import { useHistory } from 'react-router-dom';
import './pages.css';

const VehiculosPage: React.FC = () => {
  const history = useHistory();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [anio, setAnio] = useState('');
  const [placa, setPlaca] = useState('');
  const [chasis, setChasis] = useState('');
  const [ruedas, setRuedas] = useState('4');
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string>('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await getVehiculos();
      setItems(Array.isArray(data) ? data : data?.items || data?.vehiculos || []);
    } catch { setItems([]); }
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFoto(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!marca.trim() || !modelo.trim() || !chasis.trim()) {
      setError('Marca, Modelo y Chasis son obligatorios');
      return;
    }
    setSaving(true);
    try {
      await crearVehiculo({
        marca: marca.trim(),
        modelo: modelo.trim(),
        anio: parseInt(anio),
        placa: placa.trim(),
        chasis: chasis.trim(),
        cantidadRuedas: parseInt(ruedas)
      }, foto || undefined);
      
      setSuccess('Vehículo registrado ✅');
      setShowModal(false);
      resetForm();
      fetchItems();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al guardar');
    }
    setSaving(false);
  };

  const resetForm = () => {
    setMarca(''); setModelo(''); setAnio(''); setPlaca(''); setChasis(''); setRuedas('4');
    setFoto(null); setFotoPreview('');
  };

  return (
    <IonPage className="page-dark">
      <IonHeader className="ion-no-border">
        <IonToolbar className="page-toolbar">
          <IonButtons slot="start"><IonBackButton defaultHref="/inicio" text="" /></IonButtons>
          <IonTitle className="page-title-bar">Mi <span>Garaje</span></IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {loading ? (
          <div className="loading-center"><IonSpinner name="crescent" color="primary" /></div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><IonIcon icon={car} /></div>
            <div className="empty-text">No tienes vehículos registrados.<br/>Toca + para añadir el primero.</div>
          </div>
        ) : (
          <div style={{ paddingTop: 10 }}>
            {items.map((v: any, i: number) => (
              <div key={v.id || i} className="card-item animate-fade" onClick={() => history.push(`/vehiculos/${v.id}`)}>
                <div className="card-item-img-container">
                  {(v.foto || v.fotoUrl || v.foto_url) ? (
                    <img className="card-item-img" src={v.foto || v.fotoUrl || v.foto_url} alt={v.marca} />
                  ) : (
                    <div className="card-item-icon"><IonIcon icon={car} /></div>
                  )}
                </div>
                <div className="card-item-body">
                  <div className="card-item-title">{v.marca} {v.modelo}</div>
                  <div className="card-item-sub">{v.placa || 'Sin Placa'} · {v.anio}</div>
                </div>
                <div className="card-item-badge">{v.cantidadRuedas || v.cantidad_ruedas || 4} R</div>
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
              <IonTitle className="page-title-bar">Nuevo <span>Vehículo</span></IonTitle>
              <IonButtons slot="end"><IonButton onClick={() => setShowModal(false)} color="primary">Cerrar</IonButton></IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="page-dark">
            <div className="form-container">
              
              <div className="photo-upload-zone" onClick={() => fileInputRef.current?.click()}>
                {fotoPreview ? (
                  <img src={fotoPreview} alt="Preview" className="photo-preview" />
                ) : (
                  <div className="photo-placeholder">
                    <IonIcon icon={camera} />
                    <span>Añadir Foto</span>
                  </div>
                )}
                <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
              </div>

              {[
                { label: 'Marca *', value: marca, setter: setMarca, placeholder: 'Ej. Toyota' },
                { label: 'Modelo *', value: modelo, setter: setModelo, placeholder: 'Ej. Corolla' },
                { label: 'Año', value: anio, setter: setAnio, placeholder: 'Ej. 2024', type: 'number' },
                { label: 'Chasis *', value: chasis, setter: setChasis, placeholder: 'Ej. JH... (Requerido)' },
                { label: 'Placa', value: placa, setter: setPlaca, placeholder: 'Ej. A123456' },
                { label: 'Cant. Ruedas', value: ruedas, setter: setRuedas, placeholder: '4', type: 'number' },
              ].map((f, i) => (
                <div className="form-field" key={i}>
                  <label className="form-label">{f.label}</label>
                  <input 
                    className="native-input" 
                    type={f.type || 'text'} 
                    placeholder={f.placeholder} 
                    value={f.value} 
                    onChange={e => f.setter(e.target.value)} 
                  />
                </div>
              ))}

              <IonButton className="login-btn-main" expand="block" onClick={handleSave} disabled={saving} style={{ marginTop: 24 }}>
                {saving ? <IonSpinner name="crescent" /> : 'GUARDAR VEHÍCULO'}
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

export default VehiculosPage;
