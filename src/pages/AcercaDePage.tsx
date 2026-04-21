import React from 'react';
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonIcon, IonButton
} from '@ionic/react';
import { person, call, paperPlane, mail, trophy } from 'ionicons/icons';
import './pages.css';

const AcercaDePage: React.FC = () => {
  const equipo = [
    { nombre: 'Emil Echavarria', matricula: '20240174', telf: '2232849034', tg: 'Emil', img: '/imagen (1).jpg' },
    { nombre: 'Harim Inoa Lopez', matricula: '20240190', telf: '8099810129', tg: 'Harim_Inoa', img: '/WhatsApp Image 2026-03-17 at 2.36.20 PM.jpeg' },
    { nombre: 'Crisanny Grullon', matricula: '20240182', telf: '8294410935', tg: 'Crisanny_grullon', img: '/imagen (2).jpg' },
    { nombre: 'Luis Alburquerque', matricula: '20240191', telf: '8492507500', tg: 'Luisss_124', img: '/imagen.jpg' },
    { nombre: 'Jean Sencion', matricula: '202112377', telf: '8293073103', tg: 'JEAN_SENCION', img: '/WhatsApp Image 2026-04-21 at 2.55.18 PM.jpeg' }
  ];

  return (
    <IonPage className="page-dark">
      <IonHeader className="ion-no-border">
        <IonToolbar className="page-toolbar">
          <IonButtons slot="start"><IonBackButton defaultHref="/inicio" text="" /></IonButtons>
          <IonTitle className="page-title-bar">Equipo <span>ITLA</span></IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div style={{ textAlign: 'center', paddingTop: 20, paddingBottom: 10 }}>
          <div className="login-logo-icon" style={{ fontSize: 48, marginBottom: 8 }}>
            <IonIcon icon={trophy} />
          </div>
          <div className="login-brand" style={{ fontSize: 22 }}>AUTO<span>TRACK</span></div>
          <div className="login-tagline" style={{ fontSize: 10 }}>PROYECTO FINAL · GRUPO 7</div>
        </div>

        <div className="sec-label">Desarrolladores</div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, padding: '0 12px', paddingBottom: 40 }}>
          {equipo.map((m, i) => (
            <div key={i} className="card-item animate-fade" style={{ margin: 0, padding: 12, background: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center' }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #1d8cf8, #0050cc)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: '#fff', boxShadow: '0 4px 10px rgba(29, 140, 248, 0.3)', overflow: 'hidden' }}>
                  {m.img ? (
                    <img src={m.img} alt={m.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <IonIcon icon={person} />
                  )}
                </div>
                <div className="card-item-body">
                  <div className="card-item-title" style={{ fontSize: 12, marginBottom: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 700 }}>{m.nombre.split(' ')[0]} {m.nombre.split(' ')[1] || ''}</div>
                  <div className="card-item-sub" style={{ fontSize: 9, fontWeight: 700, color: 'var(--color-blue)', letterSpacing: 0.5 }}>{m.matricula}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <a href={`tel:${m.telf}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.03)', padding: '6px 8px', borderRadius: 8 }}>
                  <IonIcon icon={call} style={{ color: 'var(--color-blue)', fontSize: 12 }} />
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)' }}>{m.telf}</span>
                </a>
                <a href={`https://t.me/${m.tg}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.03)', padding: '6px 8px', borderRadius: 8 }}>
                  <IonIcon icon={paperPlane} style={{ color: '#0088cc', fontSize: 12 }} />
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)' }}>Telegram</span>
                </a>
                <a href={`mailto:${m.matricula}@itla.edu.do`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.03)', padding: '6px 8px', borderRadius: 8 }}>
                  <IonIcon icon={mail} style={{ color: '#ea4335', fontSize: 12 }} />
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis' }}>Correo</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '30px 20px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 20 }}>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: 600 }}>© 2026 INSTITUTO TECNOLÓGICO DE LAS AMÉRICAS</div>
          <div style={{ color: 'var(--color-blue)', fontSize: 11, marginTop: 4 }}>PROF. AMADÍS SUÁREZ GENAO</div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AcercaDePage;
