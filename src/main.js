import Vue from 'vue';
// Firebase necesita cargarse antes del App.vue
import firebase from 'firebase';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyBLRzzZxdcao08T1gsH5ZaWTpRIGvGC3cQ',
  authDomain: 'platzi-rooms-e41c0.firebaseapp.com',
  databaseURL: 'https://platzi-rooms-e41c0.firebaseio.com',
  projectId: 'platzi-rooms-e41c0',
  storageBucket: 'platzi-rooms-e41c0.appspot.com',
  messagingSenderId: '524662347801',
};
firebase.initializeApp(config);

// Es necesario añadir un observador para los cambios en el estado de inicio de sesion
// Es decir, este observador solo se activa cuando se inicia o se cierra sesion por el usuario actual
firebase.auth().onAuthStateChanged((user) => {
  // Verificamos si el usuario existe (ha iniciado sesion)
  if (user) {
    // Realizamos los procedimeintos para setear el state de la aplicación con los datos propios del usuario logeado
    // this.$store.dispatch('FETCH_AUTH_USER');
    // Recordar que esta funcionalidad esta fuera de Vue, por tanto no podemos acceder a this.$store
    store.dispatch('FETCH_AUTH_USER');
  }
});

new Vue({
  router,
  store,
  beforeCreate() {
    // Verificamos si el usuario se encuentra autenticado para mostrar sus datos en el header y profile de la app
    // Al momento de inicializar la aplicación
    if (store.state.authId) {
      this.$store.dispatch('FETCH_USER', store.state.authId);
    }
  },
  render: h => h(App),
}).$mount('#app');
