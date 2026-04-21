import React from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegistroPage from './pages/RegistroPage';
import ActivacionPage from './pages/ActivacionPage';
import InicioPage from './pages/InicioPage';
import VehiculosPage from './pages/VehiculosPage';
import VehiculoDetallePage from './pages/VehiculoDetallePage';
import MantenimientoPage from './pages/MantenimientoPage';
import CombustiblePage from './pages/CombustiblePage';
import GomasPage from './pages/GomasPage';
import GastosPage from './pages/GastosPage';
import IngresosPage from './pages/IngresosPage';
import ForoPage from './pages/ForoPage';
import NoticiasPage from './pages/NoticiasPage';
import VideosPage from './pages/VideosPage';
import CatalogoPage from './pages/CatalogoPage';
import PerfilPage from './pages/PerfilPage';
import AcercaDePage from './pages/AcercaDePage';
import ExplorarPage from './pages/ExplorarPage';
import PrivateRoute from './components/PrivateRoute';

/* Core CSS */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        {/* Auth (public) */}
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/registro" component={RegistroPage} />
        <Route exact path="/activacion" component={ActivacionPage} />

        {/* Public Modules (No Login Required according to Module 1-7) */}
        <Route exact path="/inicio" component={InicioPage} />
        <Route exact path="/noticias" component={NoticiasPage} />
        <Route exact path="/videos" component={VideosPage} />
        <Route exact path="/catalogo" component={CatalogoPage} />
        <Route exact path="/foro" component={ForoPage} />
        <Route exact path="/acerca-de" component={AcercaDePage} />
        <Route exact path="/explorar" component={ExplorarPage} />

        {/* Private Modules (Login Required according to Module 10-14) */}
        <PrivateRoute exact path="/vehiculos" component={VehiculosPage} />
        <PrivateRoute exact path="/vehiculos/:id" component={VehiculoDetallePage} />
        <PrivateRoute exact path="/mantenimiento" component={MantenimientoPage} />
        <PrivateRoute exact path="/combustible" component={CombustiblePage} />
        <PrivateRoute exact path="/gomas" component={GomasPage} />
        <PrivateRoute exact path="/gastos" component={GastosPage} />
        <PrivateRoute exact path="/ingresos" component={IngresosPage} />
        <PrivateRoute exact path="/perfil" component={PerfilPage} />

        <Redirect exact from="/" to="/inicio" />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
