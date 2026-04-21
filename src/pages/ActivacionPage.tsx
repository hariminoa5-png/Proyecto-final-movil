import React, { useState } from 'react';
import {
  IonPage, IonContent, IonButton, IonToast, IonSpinner, IonIcon,
} from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';
import { arrowBack, key, lockClosed } from 'ionicons/icons';
import { authActivar } from '../services/api';
import { saveTokens } from '../services/auth';
import './LoginPage.css';

const ActivacionPage: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tokenTemporal = params.get('token') || '';
  const matricula = params.get('matricula') || '';

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleActivate = async () => {
    if (!password.trim()) {
      setError('Establece una contraseña');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (!tokenTemporal) {
      setError('Token temporal no encontrado. Intenta registrarte de nuevo.');
      return;
    }

    setLoading(true);
    try {
      const data = await authActivar(tokenTemporal, password);
      // El prompt dice "recibir tokens definitivos" y "Guardar token y refreshToken"
      saveTokens(data.token, data.refreshToken);
      history.replace('/inicio');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error en la activación. El token podría haber expirado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage className="login-page">
      <IonContent fullscreen className="ion-no-padding">
        <div className="login-bg-image" />
        <div className="login-overlay" />
        
        <div className="login-container">
          <IonButton fill="clear" onClick={() => history.push('/login')} style={{ color: '#fff', alignSelf: 'flex-start', marginBottom: 20 }}>
            <IonIcon icon={arrowBack} slot="start" /> Ir al Login
          </IonButton>

          <div className="login-header">
            <div className="login-brand">ACTIVAR <span>CUENTA</span></div>
            <div className="login-tagline">MATRÍCULA: {matricula}</div>
          </div>

          <div className="login-form-box animate-fade-up">
            <p className="login-subtext" style={{ textAlign: 'center', marginBottom: 24 }}>
              Establece tu contraseña definitiva para completar el acceso.
            </p>

            <div className="login-input-group">
              <div className="input-wrapper">
                <IonIcon icon={lockClosed} className="input-icon" />
                <input 
                  className="login-native-input" 
                  type="password" 
                  placeholder="Nueva Contraseña (mín. 6 caracteres)" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                />
              </div>
            </div>

            <IonButton className="login-btn-main" expand="block" onClick={handleActivate} disabled={loading}>
              {loading ? <IonSpinner name="crescent" /> : 'ACTIVAR Y ENTRAR'}
            </IonButton>
          </div>
        </div>

        <IonToast isOpen={!!error} message={error} duration={3000} color="danger" onDidDismiss={() => setError('')} />
      </IonContent>
    </IonPage>
  );
};

export default ActivacionPage;
