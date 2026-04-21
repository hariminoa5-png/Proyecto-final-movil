import React, { useEffect, useState } from 'react';
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonSpinner, IonIcon,
} from '@ionic/react';
import { playCircle, logoYoutube } from 'ionicons/icons';
import { getVideos } from '../services/api';
import './pages.css';

const VideosPage: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const d = await getVideos();
        setItems(Array.isArray(d) ? d : d?.items || d?.videos || []);
      } catch { setItems([]); }
      setLoading(false);
    })();
  }, []);

  const getYoutubeThumb = (url: string) => {
    try {
      const id = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
      return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
    } catch { return ''; }
  };

  return (
    <IonPage className="page-dark">
      <IonHeader className="ion-no-border">
        <IonToolbar className="page-toolbar">
          <IonButtons slot="start"><IonBackButton defaultHref="/inicio" text="" /></IonButtons>
          <IonTitle className="page-title-bar">Videos <span>Relacionados</span></IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {loading ? (
          <div className="loading-center"><IonSpinner name="crescent" color="primary" /></div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><IonIcon icon={playCircle} /></div>
            <div className="empty-text">No hay videos disponibles.</div>
          </div>
        ) : (
          <div style={{ paddingTop: 10 }}>
            <div className="sec-label">Tutoriales y contenido</div>
            {items.map((v: any, i: number) => (
              <div key={v.id || i} className="video-card" onClick={() => window.open(v.url || v.link, '_blank')}>
                <div style={{ position: 'relative' }}>
                  <img className="video-thumb" src={v.thumbnail || getYoutubeThumb(v.url || v.link)} alt={v.titulo} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
                    <IonIcon icon={playCircle} style={{ fontSize: 60, color: '#fff', opacity: 0.9 }} />
                  </div>
                </div>
                <div className="video-info">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ color: 'var(--color-blue)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>{v.categoria}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <IonIcon icon={logoYoutube} style={{ color: '#ff0000', fontSize: 14 }} />
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>YouTube</span>
                    </div>
                  </div>
                  <div className="video-title">{v.titulo}</div>
                  <div style={{ marginTop: 4, color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: '1.4' }}>{v.descripcion}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default VideosPage;
