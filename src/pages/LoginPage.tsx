import React, { useState } from 'react';
import {
  IonPage, IonContent, IonButton, IonToast, IonSpinner, IonAlert, IonIcon,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { speedometer, person, lockClosed } from 'ionicons/icons';
import { authLogin, authOlvidar } from '../services/api';
import { saveTokens } from '../services/auth';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const history = useHistory();
  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleLogin = async () => {
    if (!matricula.trim() || !password.trim()) {
      setError('Completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      const data = await authLogin(matricula.trim(), password);
      saveTokens(data.token, data.refreshToken);
      history.replace('/inicio');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Credenciales incorrectas';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (mat: string) => {
    if (!mat.trim()) {
      setError('Ingresa tu matrícula');
      return;
    }

    setLoading(true);
    try {
      const resp = await authOlvidar(mat.trim());
      setSuccess(resp.message || 'Se ha asignado una clave temporal: 123456');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'No se pudo restablecer la clave';
      setError(msg);
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
          <div className="login-header">
            <div className="login-logo-icon">
              <IonIcon icon={speedometer} />
            </div>
            <div className="login-brand">AUTO<span>TRACK</span></div>
            <div className="login-tagline">ITLA VEHICULAR SYSTEM</div>
          </div>

          <div className="login-form-box animate-fade-up">
            <h1 className="login-greet">Bienvenido</h1>
            <p className="login-subtext">Inicia sesión para gestionar tu garaje</p>

            <div className="login-input-group">
              <div className="input-wrapper">
                <IonIcon icon={person} className="input-icon" />
                <input 
                  className="login-native-input" 
                  type="text" 
                  placeholder="Matrícula (Ej. 2023-1234)"
                  value={matricula}
                  onChange={e => setMatricula(e.target.value)}
                />
              </div>
            </div>

            <div className="login-input-group">
              <div className="input-wrapper">
                <IonIcon icon={lockClosed} className="input-icon" />
                <input 
                  className="login-native-input" 
                  type="password" 
                  placeholder="Contraseña"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <IonButton
              className="login-btn-main"
              expand="block"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? <IonSpinner name="crescent" /> : 'INICIAR SESIÓN'}
            </IonButton>

            <div className="login-footer-actions">
              <button className="forgot-btn" onClick={() => setShowAlert(true)}>
                ¿Olvidaste tu contraseña?
              </button>
              
              <div className="register-promo">
                ¿No tienes cuenta? <span onClick={() => history.push('/registro')}>Regístrate</span>
              </div>
            </div>
          </div>
        </div>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Recuperar Acceso"
          message="Ingresa tu matrícula para obtener una clave temporal"
          inputs={[{ name: 'matInput', type: 'text', placeholder: '2021-1234', value: matricula }]}
          buttons={[
            { text: 'Cancelar', role: 'cancel' },
            { text: 'Recuperar', handler: (data) => handleForgotPassword(data.matInput) }
          ]}
        />

        <IonToast isOpen={!!error} message={error} duration={3000} color="danger" onDidDismiss={() => setError('')} />
        <IonToast isOpen={!!success} message={success} duration={5000} color="success" onDidDismiss={() => setSuccess('')} />
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
