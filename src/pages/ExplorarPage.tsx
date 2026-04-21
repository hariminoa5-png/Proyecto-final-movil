import React, { useEffect, useState } from 'react';
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonSpinner, IonIcon, IonSearchbar
} from '@ionic/react';
import { car, person, globe } from 'ionicons/icons';
import { getVehiculosPublicos } from '../services/api';
import './pages.css';

const ExplorarPage: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await getVehiculosPublicos();
      setItems(Array.isArray(data) ? data : data?.items || data?.vehiculos || []);
    } catch { setItems([]); }
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const filteredItems = items.filter(item => 
    item.marca?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.modelo?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.propietario?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <IonPage className="page-dark">
      <IonHeader className="ion-no-border">
        <IonToolbar className="page-toolbar">
          <IonButtons slot="start"><IonBackButton defaultHref="/inicio" text="" /></IonButtons>
          <IonTitle className="page-title-bar">Garaje <span>Comunitario</span></IonTitle>
        </IonToolbar>
        <IonToolbar className="page-toolbar">
          <IonSearchbar 
            placeholder="Buscar por marca, modelo o propietario..." 
            value={searchText} 
            onIonInput={e => setSearchText(e.detail.value!)} 
            mode="ios"
            className="custom-search"
          />
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {loading ? (
          <div className="loading-center"><IonSpinner name="crescent" color="primary" /></div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><IonIcon icon={globe} /></div>
            <div className="empty-text">No se encontraron vehículos públicos.</div>
          </div>
        ) : (
          <div style={{ paddingTop: 10, paddingBottom: 40 }}>
            <div className="sec-label">Explora los vehículos registrados en el ITLA</div>
            {filteredItems.map((v: any, i: number) => (
              <div key={v.id || i} className="card-item animate-fade">
                <div className="card-item-img-container">
                  {(v.foto || v.fotoUrl) ? (
                    <img className="card-item-img" src={v.foto || v.fotoUrl} alt={v.marca} />
                  ) : (
                    <div className="card-item-icon"><IonIcon icon={car} /></div>
                  )}
                </div>
                <div className="card-item-body">
                  <div className="card-item-title">{v.marca} {v.modelo}</div>
                  <div className="card-item-sub">Placa: {v.placa || 'N/D'} · Año: {v.anio}</div>
                  <div className="card-item-sub" style={{ display: 'flex', alignItems: 'center', marginTop: 6, color: 'var(--color-blue)', fontSize: 11 }}>
                    <IonIcon icon={person} style={{ marginRight: 6 }} />
                    {v.propietario || 'Usuario ITLA'}
                  </div>
                </div>
                <div className="card-item-badge">{v.cantidad_ruedas || 4} R</div>
              </div>
            ))}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ExplorarPage;
