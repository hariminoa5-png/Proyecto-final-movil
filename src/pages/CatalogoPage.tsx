import React, { useEffect, useState } from 'react';
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonSpinner, IonModal, IonButton, IonIcon, IonToast
} from '@ionic/react';
import { carSport, list, informationCircle, pricetag } from 'ionicons/icons';
import { getCatalogo, getCatalogoDetalle } from '../services/api';
import './pages.css';

const CatalogoPage: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [detalle, setDetalle] = useState<any>(null);
  const [showDetalle, setShowDetalle] = useState(false);

  const [error, setError] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const d = await getCatalogo();
      setItems(Array.isArray(d) ? d : d?.items || d?.catalogo || []);
    } catch (e: any) { 
      setError(e?.response?.data?.message || 'Error al conectar con el servidor');
      setItems([]); 
    }
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openDetalle = async (id: number) => {
    try {
      const d = await getCatalogoDetalle(id);
      setDetalle(d);
      setShowDetalle(true);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Error al cargar el detalle');
    }
  };

  return (
    <IonPage className="page-dark">
      <IonHeader className="ion-no-border">
        <IonToolbar className="page-toolbar">
          <IonButtons slot="start"><IonBackButton defaultHref="/inicio" text="" /></IonButtons>
          <IonTitle className="page-title-bar">Catálogo <span>2024</span></IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {loading ? (
          <div className="loading-center"><IonSpinner name="crescent" color="primary" /></div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><IonIcon icon={carSport} /></div>
            <div className="empty-text">No hay vehículos en el catálogo en este momento.</div>
          </div>
        ) : (
          <div style={{ paddingTop: 10 }}>
            <div className="sec-label">Modelos disponibles</div>
            {items.map((c: any, i: number) => (
              <div key={c.id || i} className="card-item" onClick={() => openDetalle(c.id)}>
                {(c.imagenUrl || c.imagen || c.foto || c.fotoUrl) ? (
                  <img className="card-item-img" src={c.imagenUrl || c.imagen || c.foto || c.fotoUrl} alt={c.marca} />
                ) : (
                  <div className="card-item-icon"><IonIcon icon={carSport} /></div>
                )}
                <div className="card-item-body">
                  <div className="card-item-title">{c.marca} {c.modelo}</div>
                  <div className="card-item-sub">{c.anio ? `Modelo Año ${c.anio}` : ''}</div>
                  {c.descripcionCorta && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{c.descripcionCorta}</div>}
                </div>
                {c.precio && <div className="card-item-badge">RD${c.precio.toLocaleString()}</div>}
              </div>
            ))}
          </div>
        )}

        <IonModal isOpen={showDetalle} onDidDismiss={() => setShowDetalle(false)}>
          <IonHeader className="ion-no-border">
            <IonToolbar className="page-toolbar">
              <IonTitle className="page-title-bar">Detalles del <span>Modelo</span></IonTitle>
              <IonButtons slot="end"><IonButton onClick={() => setShowDetalle(false)} color="primary">Cerrar</IonButton></IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="page-dark">
            {detalle && (
              <>
                <div className="catalogo-gallery">
                  {Array.isArray(detalle.imagenes) && detalle.imagenes.length > 0 ? (
                    detalle.imagenes.map((img: string, idx: number) => (
                      <img key={idx} className="detail-hero" src={img} alt={`${detalle.marca} ${idx}`} style={{ marginBottom: 10 }} />
                    ))
                  ) : (detalle.imagenUrl || detalle.imagen || detalle.foto || detalle.fotoUrl) ? (
                    <img className="detail-hero" src={detalle.imagenUrl || detalle.imagen || detalle.foto || detalle.fotoUrl} alt={detalle.marca} />
                  ) : (
                    <div className="detail-hero-placeholder"><IonIcon icon={carSport} /></div>
                  )}
                </div>
                <div className="detail-body">
                  <div className="detail-title">{detalle.marca} {detalle.modelo}</div>
                  <div className="detail-sub">
                    {detalle.anio && <span>Año: <strong>{detalle.anio}</strong></span>}
                    {detalle.precio && <span> · Precio: <strong>RD${detalle.precio.toLocaleString()}</strong></span>}
                  </div>
                  <div className="detail-desc" style={{ marginTop: 16 }}>{detalle.descripcion || 'Información técnica no detallada.'}</div>
                </div>
                {detalle.especificaciones && (
                  <div style={{ paddingBottom: 30 }}>
                    <div className="sec-label">Ficha Técnica</div>
                    {Object.entries(detalle.especificaciones).map(([k, v]: any) => (
                      <div key={k} className="info-row">
                        <span className="info-label">{k.replace(/_/g, ' ')}</span>
                        <span className="info-value">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </IonContent>
        </IonModal>

        <IonToast 
          isOpen={!!error} 
          message={error} 
          duration={3000} 
          color="danger" 
          onDidDismiss={() => setError('')} 
          position="bottom"
        />
      </IonContent>
    </IonPage>
  );
};

export default CatalogoPage;
