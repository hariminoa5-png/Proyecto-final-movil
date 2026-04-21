import React, { useEffect, useState } from 'react';
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonSpinner, IonIcon,
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { 
  build, water, disc, cash, trendingUp, 
  carSport, shieldCheckmark, speedometer 
} from 'ionicons/icons';
import { getVehiculoDetalle } from '../services/api';
import './pages.css';

const VehiculoDetallePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [vehiculo, setVehiculo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getVehiculoDetalle(parseInt(id));
        setVehiculo(data);
      } catch { }
      setLoading(false);
    })();
  }, [id]);

  if (loading) return (
    <IonPage className="page-dark">
      <IonHeader className="ion-no-border"><IonToolbar className="page-toolbar"><IonButtons slot="start"><IonBackButton defaultHref="/vehiculos" text="" /></IonButtons><IonTitle className="page-title-bar">Cargando...</IonTitle></IonToolbar></IonHeader>
      <IonContent><div className="loading-center"><IonSpinner name="crescent" color="primary" /></div></IonContent>
    </IonPage>
  );

  if (!vehiculo) return (
    <IonPage className="page-dark">
      <IonHeader className="ion-no-border"><IonToolbar className="page-toolbar"><IonButtons slot="start"><IonBackButton defaultHref="/vehiculos" text="" /></IonButtons><IonTitle className="page-title-bar">Error</IonTitle></IonToolbar></IonHeader>
      <IonContent><div className="empty-state"><div className="empty-icon">❌</div><div className="empty-text">No se encontró el vehículo.</div></div></IonContent>
    </IonPage>
  );

  const v = vehiculo;
  const resumen = v.resumen || v.resumenFinanciero || {};

  return (
    <IonPage className="page-dark">
      <IonHeader className="ion-no-border">
        <IonToolbar className="page-toolbar">
          <IonButtons slot="start"><IonBackButton defaultHref="/vehiculos" text="" /></IonButtons>
          <IonTitle className="page-title-bar">{v.marca} <span>{v.modelo}</span></IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {(v.foto || v.fotoUrl) ? (
          <img className="detail-hero" src={v.foto || v.fotoUrl} alt={v.marca} />
        ) : (
          <div className="detail-hero-placeholder">
            <IonIcon icon={carSport} />
          </div>
        )}

        <div className="detail-body">
          <div className="detail-title">{v.marca} {v.modelo}</div>
          <div className="detail-sub">
            <div style={{ marginBottom: 4 }}>Placa: <strong>{v.placa}</strong> · Año: <strong>{v.anio}</strong></div>
            {v.chasis && <div>Chasis: <strong>{v.chasis}</strong></div>}
            <div style={{ marginTop: 4 }}>Configuración: {v.cantidad_ruedas || v.ruedas || 4} ruedas</div>
          </div>
        </div>

        <div className="sec-label">Resumen Financiero</div>
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--color-danger)' }}>RD${resumen.totalGastos || resumen.gastos || 0}</div>
            <div className="stat-label">Gastos</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--color-success)' }}>RD${resumen.totalIngresos || resumen.ingresos || 0}</div>
            <div className="stat-label">Ingresos</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: (resumen.balance || 0) >= 0 ? 'var(--color-blue)' : 'var(--color-danger)' }}>
              RD${resumen.balance || 0}
            </div>
            <div className="stat-label">Balance</div>
          </div>
        </div>

        <div className="stats-row" style={{ marginTop: 0 }}>
          <div className="stat-card">
            <div className="stat-value">{resumen.totalMantenimientos || resumen.mantenimientos || 0}</div>
            <div className="stat-label">Mantenimientos</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">RD${resumen.totalCombustible || resumen.combustible || 0}</div>
            <div className="stat-label">Combustible</div>
          </div>
        </div>

        <div className="sec-label">Gestión de Vehículo</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 20px 40px' }}>
          {[
            { icon: build, label: 'Taller', path: `/mantenimiento?vid=${id}`, color: '#1d8cf8' },
            { icon: water, label: 'Combustible', path: `/combustible?vid=${id}`, color: '#f39c12' },
            { icon: disc, label: 'Neumáticos', path: `/gomas?vid=${id}`, color: '#9b59b6' },
            { icon: cash, label: 'Registrar Gasto', path: `/gastos?vid=${id}`, color: '#e74c3c' },
            { icon: trendingUp, label: 'Registrar Ingreso', path: `/ingresos?vid=${id}`, color: '#27ae60' },
          ].map(item => (
            <div key={item.path} className="card-item" style={{ margin: 0, padding: '24px 16px', flexDirection: 'column', textAlign: 'center' }} onClick={() => history.push(item.path)}>
              <IonIcon icon={item.icon} style={{ fontSize: 32, marginBottom: 12, color: item.color }} />
              <div className="card-item-title" style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default VehiculoDetallePage;
