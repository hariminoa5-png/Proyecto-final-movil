import React, { useState } from 'react';
import {
  IonPage, IonContent, IonButton, IonToast, IonSpinner, IonIcon,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBack, person, card } from 'ionicons/icons';
import { authRegistro } from '../services/api';
import './LoginPage.css';

const RegistroPage: React.FC = () => {
  const history = useHistory();
  const [matricula, setMatricula] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!matricula.trim()) {
      setError('Ingresa tu matrícula');
      return;
    }
    setLoading(true);
    try {
      const data = await authRegistro(matricula.trim());
      // Guardamos el token temporal en la URL para la activación
      history.push(`/activacion?token=${data.token}&matricula=${matricula}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error en el registro. Verifica tu matrícula.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage className="login-page">
      <IonContent fullscreen className="ion-no-padding">
        <div className="login-bg-image" />
        <div className="login-overlay" />
        
        <div className="login-container" style={{ justifyContent: 'center' }}>
          <IonButton fill="clear" onClick={() => history.goBack()} style={{ color: '#fff', alignSelf: 'flex-start', marginBottom: 40 }}>
            <IonIcon icon={arrowBack} slot="start" /> Atrás
          </IonButton>

          <div className="login-header" style={{ marginBottom: 40 }}>
            <div className="login-brand">PROYECTO <span>ITLA</span></div>
            <div className="login-tagline">INGRESA TU MATRÍCULA PARA EMPEZAR</div>
          </div>

          <div className="login-form-box animate-fade-up">
            <h2 className="login-greet" style={{ fontSize: 20, marginBottom: 12 }}>Registro de Usuario</h2>
            <p className="login-subtext">Se te enviará un token temporal para activar tu cuenta.</p>

            <div className="login-input-group">
              <div className="input-wrapper">
                <IonIcon icon={card} className="input-icon" />
                <input 
                  className="login-native-input" 
                  type="text" 
                  placeholder="Matrícula (Ej. 2024-0000)" 
                  value={matricula} 
                  onChange={e => setMatricula(e.target.value)} 
                />
              </div>
            </div>

            <IonButton className="login-btn-main" expand="block" onClick={handleRegister} disabled={loading}>
              {loading ? <IonSpinner name="crescent" /> : 'OBTENER TOKEN'}
            </IonButton>
          </div>
        </div>

        <IonToast isOpen={!!error} message={error} duration={3000} color="danger" onDidDismiss={() => setError('')} />
      </IonContent>
    </IonPage>
  );
};

export default RegistroPage;
