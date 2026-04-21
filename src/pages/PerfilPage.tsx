import React, { useEffect, useState, useRef } from 'react';
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonSpinner, IonIcon, IonButton, IonToast
} from '@ionic/react';
import { person, logOut, mail, card, camera, power } from 'ionicons/icons';
import { getPerfil, subirFotoPerfil } from '../services/api';
import { clearTokens } from '../services/auth';
import { useHistory } from 'react-router-dom';
import './pages.css';

const PerfilPage: React.FC = () => {
  const history = useHistory();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [perfil, setPerfil] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadPerfil = async () => {
    try {
      const data = await getPerfil();
      setPerfil(data);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { loadPerfil(); }, []);

  const handleLogout = () => {
    clearTokens();
    history.replace('/login');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await subirFotoPerfil(file);
      setSuccess('Foto de perfil actualizada ✅');
      loadPerfil();
    } catch {
      setError('Error al subir la foto');
    }
    setUploading(false);
  };

  return (
    <IonPage className="page-dark">
      <IonHeader className="ion-no-border">
        <IonToolbar className="page-toolbar">
          <IonButtons slot="start"><IonBackButton defaultHref="/inicio" text="" /></IonButtons>
          <IonTitle className="page-title-bar">Mi <span>Perfil</span></IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {loading ? (
          <div className="loading-center"><IonSpinner name="crescent" color="primary" /></div>
        ) : perfil ? (
          <div className="animate-fade">
            <div className="profile-header">
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <div className="profile-avatar-placeholder" style={{ 
                  width: 120, height: 120, 
                  background: perfil.fotoUrl ? `url(${perfil.fotoUrl}) center/cover` : 'rgba(255,255,255,0.05)',
                  border: '2px solid var(--color-blue)'
                }}>
                  {!perfil.fotoUrl && <IonIcon icon={person} style={{ fontSize: 60 }} />}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  style={{ 
                    position: 'absolute', bottom: 0, right: 0, 
                    background: 'var(--color-blue)', borderRadius: '50%', 
                    width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: 'none', color: '#fff'
                  }}
                >
                  {uploading ? <IonSpinner name="dots" /> : <IonIcon icon={camera} />}
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  accept="image/*" 
                  onChange={handleFileChange} 
                />
              </div>
              <div className="profile-name" style={{ marginTop: 16 }}>{perfil.nombre} {perfil.apellido}</div>
              <div className="profile-mat">ITLA · {perfil.matricula}</div>
            </div>

            <div className="sec-label">Información de Cuenta</div>
            <div className="info-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <IonIcon icon={mail} style={{ color: 'var(--color-blue)' }} />
                <span className="info-label">Email</span>
              </div>
              <span className="info-value">{perfil.correo || perfil.email}</span>
            </div>
            <div className="info-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <IonIcon icon={card} style={{ color: 'var(--color-blue)' }} />
                <span className="info-label">Matrícula</span>
              </div>
              <span className="info-value">{perfil.matricula}</span>
            </div>

            <div style={{ padding: '40px 20px' }}>
              <IonButton expand="block" color="danger" fill="outline" onClick={handleLogout} style={{ height: 56, '--border-radius': '16px', fontWeight: 600 }}>
                <IonIcon icon={power} slot="start" />
                CERRAR SESIÓN
              </IonButton>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon"><IonIcon icon={person} /></div>
            <div className="empty-text">No se pudo cargar la información del perfil.</div>
            <IonButton fill="clear" onClick={() => history.replace('/login')}>Iniciar Sesión</IonButton>
          </div>
        )}
        <IonToast isOpen={!!error} message={error} duration={3000} color="danger" onDidDismiss={() => setError('')} />
        <IonToast isOpen={!!success} message={success} duration={3000} color="success" onDidDismiss={() => setSuccess('')} />
      </IonContent>
    </IonPage>
  );
};

export default PerfilPage;
