import React, { useEffect, useState } from 'react';
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonSpinner, IonModal, IonButton, IonIcon,
} from '@ionic/react';
import { newspaper, calendar, time } from 'ionicons/icons';
import { getNoticias, getNoticiaDetalle } from '../services/api';
import './pages.css';

const NoticiasPage: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [detalle, setDetalle] = useState<any>(null);
  const [showDetalle, setShowDetalle] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const d = await getNoticias();
        setItems(Array.isArray(d) ? d : d?.items || d?.noticias || []);
      } catch { setItems([]); }
      setLoading(false);
    })();
  }, []);

  const openDetalle = async (id: number) => {
    try {
      const d = await getNoticiaDetalle(id);
      setDetalle(d);
      setShowDetalle(true);
    } catch { }
  };

  return (
    <IonPage className="page-dark">
      <IonHeader className="ion-no-border">
        <IonToolbar className="page-toolbar">
          <IonButtons slot="start"><IonBackButton defaultHref="/inicio" text="" /></IonButtons>
          <IonTitle className="page-title-bar">Noticias</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {loading ? (
          <div className="loading-center"><IonSpinner name="crescent" color="primary" /></div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><IonIcon icon={newspaper} /></div>
            <div className="empty-text">No hay noticias disponibles aún.</div>
          </div>
        ) : (
          <div style={{ paddingTop: 10 }}>
            {items.map((n: any, i: number) => (
              <div key={n.id || i} className="card-item" onClick={() => openDetalle(n.id)}>
                {(n.imagenUrl || n.foto) ? (
                  <img className="card-item-img" src={n.imagenUrl || n.foto} alt={n.titulo} />
                ) : (
                  <div className="card-item-icon"><IonIcon icon={newspaper} /></div>
                )}
                <div className="card-item-body">
                  <div className="card-item-title">{n.titulo}</div>
                  <div className="card-item-sub">{n.fecha}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <IonModal isOpen={showDetalle} onDidDismiss={() => setShowDetalle(false)}>
          <IonHeader className="ion-no-border">
            <IonToolbar className="page-toolbar">
              <IonTitle className="page-title-bar">Noticia</IonTitle>
              <IonButtons slot="end"><IonButton onClick={() => setShowDetalle(false)} color="primary">Cerrar</IonButton></IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="page-dark">
            {detalle && (
              <>
                {(detalle.imagenUrl || detalle.foto) && <img className="news-detail-img" src={detalle.imagenUrl || detalle.foto} alt={detalle.titulo} />}
                <div className="news-detail-body">
                  <div className="news-detail-title">{detalle.titulo}</div>
                  <div className="news-detail-date">
                    <IonIcon icon={calendar} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                    {detalle.fecha}
                  </div>
                  <div className="news-detail-content" dangerouslySetInnerHTML={{ __html: detalle.contenido || '' }} />
                </div>
              </>
            )}
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default NoticiasPage;
