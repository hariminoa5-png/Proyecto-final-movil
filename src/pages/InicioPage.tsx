import React, { useEffect, useState } from 'react';
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonButtons,
  IonButton, IonTabBar, IonTabButton, IonIcon, IonLabel,
} from '@ionic/react';
import { 
  home, newspaper, car, chatbubbles, person, 
  build, water, playCircle, cash, trendingUp, disc, carSport, bulb, shieldCheckmark, trophy, globe
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './InicioPage.css';

const SLIDES = [
  {
    tag: 'Consejo del día',
    title: 'Revisa el aceite de tu motor regularmente',
    sub: 'Prolonga la vida útil de tu vehículo',
    img: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80',
  },
  {
    tag: 'Seguridad',
    title: 'Mantén tus neumáticos con la presión correcta',
    sub: 'Mejora el rendimiento y tu seguridad',
    img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
  },
  {
    tag: 'Finanzas',
    title: 'Registra todos tus gastos vehiculares',
    sub: 'Controla tu presupuesto automotriz',
    img: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
  },
];

const MOTIVES = [
  '"Un vehículo bien mantenido no es un gasto, es una inversión en tu seguridad."',
  '"El mantenimiento preventivo hoy evita reparaciones costosas mañana."',
  '"Conoce tu vehículo: entiende sus sonidos, sus necesidades, su ritmo."',
];

const QUICK_ITEMS = [
  { icon: car, label: 'Vehículos', path: '/vehiculos' },
  { icon: build, label: 'Taller', path: '/mantenimiento' },
  { icon: water, label: 'Combustible', path: '/combustible' },
  { icon: newspaper, label: 'Noticias', path: '/noticias' },
  { icon: playCircle, label: 'Videos', path: '/videos' },
  { icon: chatbubbles, label: 'Foro', path: '/foro' },
  { icon: carSport, label: 'Catálogo', path: '/catalogo' },
  { icon: globe, label: 'Garaje ITLA', path: '/explorar' },
  { icon: cash, label: 'Gastos', path: '/gastos' },
  { icon: trendingUp, label: 'Ingresos', path: '/ingresos' },
  { icon: disc, label: 'Gomas', path: '/gomas' },
  { icon: trophy, label: 'Acerca De', path: '/acerca-de' },
];

const InicioPage: React.FC = () => {
  const history = useHistory();
  const [motiveIndex, setMotiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMotiveIndex((i) => (i + 1) % MOTIVES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <IonPage className="inicio-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="inicio-toolbar">
          <div slot="start" style={{ paddingLeft: 20 }}>
            <span className="toolbar-logo">AUTO<span>TRACK</span></span>
          </div>
          <IonButtons slot="end" style={{ paddingRight: 8 }}>
            <IonButton className="avatar-btn" onClick={() => history.push('/perfil')}>
              <div className="avatar-circle">
                <IonIcon icon={person} />
              </div>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding-bottom">
        <div className="dashboard-content">
          {/* SLIDER */}
          <div className="slider-section animate-fade-up">
            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              loop
              className="dashboard-swiper"
            >
              {SLIDES.map((slide, i) => (
                <SwiperSlide key={i}>
                  <div className="slide-card">
                    <img className="slide-img" src={slide.img} alt={slide.title} />
                    <div className="slide-gradient" />
                    <div className="slide-text-box">
                      <div className="slide-badge">{slide.tag}</div>
                      <div className="slide-main-title">{slide.title}</div>
                      <div className="slide-subtitle">{slide.sub}</div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* MOTIVATIONAL */}
          <div className="dashboard-motive animate-fade-up">
            <div className="motive-icon-box">
              <IonIcon icon={bulb} className="motive-icon-svg" />
            </div>
            <div className="motive-text-content">{MOTIVES[motiveIndex]}</div>
          </div>

          {/* QUICK DASHBOARD */}
          <div className="dash-section-header">Centro de Control</div>
          <div className="dash-grid">
            {QUICK_ITEMS.map((item, idx) => (
              <div
                key={item.path}
                className="dash-tile animate-fade-up"
                style={{ animationDelay: `${idx * 0.05}s` }}
                onClick={() => history.push(item.path)}
              >
                <div className="dash-tile-icon">
                  <IonIcon icon={item.icon} />
                </div>
                <div className="dash-tile-label">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </IonContent>

      <IonTabBar slot="bottom" className="custom-tab-bar">
        <IonTabButton tab="inicio" selected>
          <IonIcon icon={home} />
          <IonLabel>Inicio</IonLabel>
        </IonTabButton>
        <IonTabButton tab="vehiculos" onClick={() => history.push('/vehiculos')}>
          <IonIcon icon={car} />
          <IonLabel>Garaje</IonLabel>
        </IonTabButton>
        <IonTabButton tab="noticias" onClick={() => history.push('/noticias')}>
          <IonIcon icon={newspaper} />
          <IonLabel>Noticias</IonLabel>
        </IonTabButton>
        <IonTabButton tab="foro" onClick={() => history.push('/foro')}>
          <IonIcon icon={chatbubbles} />
          <IonLabel>Comunidad</IonLabel>
        </IonTabButton>
        <IonTabButton tab="perfil" onClick={() => history.push('/perfil')}>
          <IonIcon icon={person} />
          <IonLabel>Perfil</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonPage>
  );
};

export default InicioPage;
