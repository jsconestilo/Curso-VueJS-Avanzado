import Vue from 'vue';
import Router from 'vue-router';
import HomePage from './views/HomePage.vue';
import SearchPage from './views/SearchPage.vue';
import NotFoundPage from './views/NotFoundPage.vue';
import CreateHousePage from './views/CreateHousePage.vue';

// User Pages
import ProfilePage from './views/user/ProfilePage.vue';
import HousesPages from './views/user/HousesPage.vue';

// Requiero del store para saber si el usuario esta autenticado o no
// en la propiedad stare authId
import store from './store';

Vue.use(Router);

// export default new Router({
const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage,
    },
    {
      path: '/search',
      name: 'SearchPage',
      component: SearchPage,
    },
    {
      path: '/user',
      redirect: { name: 'ProfilePage' },
    },
    {
      path: '/user/profile',
      name: 'ProfilePage',
      component: ProfilePage,
      // Le indicamos al router que esta ruta require autenticación
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/user/houses',
      name: 'HousesPages',
      component: HousesPages,
      meta: {
        requiresAuth: true,
      },
    },
    {
      // El redireccionamiento, si coloca /house se le redirecciona a la ruta con nombre ProfilePage
      path: '/house',
      redirect: { name: 'ProfilePage' },
    },
    {
      path: '/house/new',
      name: 'CreateHousePage',
      component: CreateHousePage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '*',
      name: 'NotFoundPage',
      component: NotFoundPage,
    },
  ],
});

// Reglas de validación para proteger rutas
// Navigation guards
// Cuando se navega podemos engancharnos a hooks como
// router.beforeEach, router.afterEach
// En este caso le indicamos al router antes de cada navegación a una ruta
// a, desde, siguiente
router.beforeEach((to, from, next) => {
  // Verificar si ese destino solicitado tiene alguna meta reestricción
  const restriccion = to.matched.some(route => route.meta.requiresAuth);

  if (restriccion) {
    // Verificar en el store el path que nos permite saber si hay autenticacion
    if (store.state.authId) {
      next();
    } else {
      // Negamos el acceso mandandolo al home
      next({ name: 'HomePage' });
    }
  } else {
    // Si no hay restriccipn lo dejamos pasar al destino
    next();
  }
});

// Exportamos la funcionalidad del router.
export default router;
