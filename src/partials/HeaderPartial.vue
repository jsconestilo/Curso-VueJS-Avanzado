<template>
  <header class="bg-white py-5 shadow">
    <div class="container mx-auto">
      <div class="flex items-center justify-between flex-wrap">
        <div class="flex items-center flex-no-shrink mr-6">
          <!--a
            class="text-black hover:text-grey-darkest no-underline font-semibold text-lg"
            href="#">Platzi Rooms</a-->
          <router-link
            :to="{ name: 'HomePage' }"
            class="text-black hover:text-grey-darkest no-underline font-semibold text-lg">Platzi Rooms</router-link>
        </div>
        <div class="flex items-center w-auto">
          <!-- Para recuperar la data del slot, se declara como valor el nombre de un objeto, y es en este objeto donde se inyectan los valores, pj. myobj.valor.
          Sin embargo, haciendo uso de destructuring, indico que path de dicho objeto quiero recuperar, en este caso el path user. -->
          <current-user v-slot="{ user }">
            <!-- Ahora puedo usar dicha data dentro del cuerpo personalizado del slot para indicar como quiero que se muestre dicha información -->
            <div class="items__controls">
              <div class="flex" v-if="user">
                <!--button class="mr-2 flex items-center">
                  <i class="material-icons">add</i>
                </button-->
                <router-link
                  :to="{ name: 'CreateHousePage' }"
                  tag="button"
                  class="mr-2 flex items-center">
                  <i class="material-icons">add</i>
                </router-link>
                <button class="mr-4 flex items-center">
                  <i class="material-icons">notifications</i>
                </button>
                <div class="flex items-center">
                  <img class="w-8 h-8 rounded-full mr-2" :src="user.avatar" alt="Avatar of Javier Diaz">
                  <div class="text-sm">
                    <p class="text-black leading-none">{{ user.name }}</p>
                    <p class="text-grey-dark">Online</p>
                  </div>
                </div>
                <button class="flex item-center ml-4" @click.prevent="logOut">
                  <i class="material-icons">exit_to_app</i>
                </button>
              </div>
              <div v-else>
                <button class="btn__outline btn__outline--teal rounded mr-2" @click.prevent="getLogin">Login</button>
                <button
                  class="bg-yellow-dark text-yellow-darker font-semibold py-2 px-4 rounded" @click.prevent="signUp">
                  Register</button>
              </div>
            </div>
          </current-user>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import CurrentUser from '@/components/CurrentUser.vue';
// import { mapGetters } from 'vuex';

export default {
  name: 'HeaderPartial',
  components: { CurrentUser },
  /* data() {
    return {
      isAuthenticated: true,
    };
  }, */
  methods: {
    getLogin() {
      // En este caso despachamos una acción, pasando el payload para indicar que modal se debe de mostrar
      this.$store.dispatch('TOGGLE_MODAL_STATE', {
        name: 'login',
        value: true,
      });
    },
    signUp() {
      // Despachamos una acción que permita mostrar el modal register
      this.$store.dispatch('TOGGLE_MODAL_STATE', {
        name: 'register',
        value: true,
      });
    },
    logOut() {
      // Despachamos la acción para cerrar sesión del usuario actual
      this.$store.dispatch('LOG_OUT');
    },
  },
  /* computed: {
     Mapeamos el objeto y asignamos en el path user, la función authUser
     ...mapGetters({ user: 'authUser' }),
   }, */
};
</script>
