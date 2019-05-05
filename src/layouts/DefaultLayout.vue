<template>
  <div class="default-layout">
    <header-partial></header-partial>
    <section class="section__hero py-6 bg-black bg-cover bg-center">
      <div class="container mx-auto">
        <div class="section__form bg-white p-4 w-1/2 shadow-md">
          <h1 class="mb-2 text-4xl font-light text-grey-darkest">Find homes on Platzi Rooms</h1>
          <h2 class="mb-6 text-base text-grey-dark font-normal">
            Discover entire homes and private rooms perfect for any trip.
          </h2>
          <form class="form__search">
            <div class="mb-4">
              <label class="input__label" for="where">Where</label>
              <div class="form__field relative">
                <i class="input-icon material-icons absolute text-grey-darker">search</i>
                <input
                  class="input__search"
                  id="where"
                  type="text"
                  placeholder="Mexico City, Mexico">
              </div>
            </div>
            <button
              class="px-2 py-4 bg-yellow-dark font-semibold w-full rounded text-yellow-darker">
              Search</button>
          </form>
        </div>
      </div>
    </section>
    <main class="main">
      <slot></slot>
    </main>
    <footer-partial></footer-partial>

    <!-- MOdals -->
    <!-- El modal emite un evento close-modal para indicarle a su padre que debe cerrarlo, y para mostrarlo accedemos a un getter del store mediante una propiedad computada para obtener su valor -->
    <modal :show="modals.login" @close-modal="closeModal">
      <h2 class="text-gray-darkest font-semibold text-center nb-6">Welcome to Platzi Rooms</h2>
      <form @submit.prevent="loginHandlerSubmit">
        <div class="mb-4">
          <label class="input__label">Email</label>
          <div class="form-field relative">
            <input v-model="formLogin.email" type="text" placeholder="chicadelcerro@correo.com" class="input__field">
          </div>
        </div>
        <div class="mb-4">
          <label class="input__label">Password</label>
          <div class="form-field relative">
            <input v-model="formLogin.password" type="password" placeholder="*****" class="input__field">
          </div>
        </div>
        <div class="mb-4">
          <toggle-input v-model="formLogin.rememberMe"></toggle-input>
          Remember Me
        </div>
        <div class="mb-4">
          <button class="btn btn primary mr-3 w-full">Login</button>
        </div>
      </form>
    </modal>
    <!-- Modal para el registro de usuarios -->
    <modal :show="modals.register" @close-modal="closeModalRegister">
      <form class="form" @submit.prevent="registerHandlerSubmit">
        <div class="mb-4">
          <label class="input__label" for="email">Email</label>
          <div class="form__field relative">
            <input
              class="input__field"
              id="email"
              v-model="formRegister.email"
              type="email"
              placeholder="bruce.wayne@imnotbatman.org">
          </div>
        </div>
        <div class="mb-4">
          <label class="input__label" for="email">Name</label>
          <div class="form__field relative">
            <input
              class="input__field"
              id="name"
              v-model="formRegister.name"
              type="text"
              placeholder="Bruce Wayne">
          </div>
        </div>
        <div class="mb-4">
          <label class="input__label" for="password">Password</label>
          <div class="form__field relative">
            <input
              class="input__field"
              id="password"
              v-model="formRegister.password"
              type="password"
              placeholder="Create a Password">
          </div>
        </div>
        <div class="mb-4">
          <button class="btn w-full">Create account</button>
        </div>
      </form>
    </modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import HeaderPartial from '@/partials/HeaderPartial.vue';
import FooterPartial from '@/partials/FooterPartial.vue';

import Modal from '@/components/Modal.vue';
import ToggleInput from '@/components/ToggleInput.vue';

export default {
  name: 'DefaultLayout',
  components: {
    HeaderPartial,
    FooterPartial,
    Modal,
    ToggleInput,
  },
  data() {
    return {
      formLogin: {
        email: '',
        password: '',
        rememberMe: false,
      },
      formRegister: {
        email: '',
        name: '',
        password: '',
      },
    };
  },
  computed: {
    // Tener acceso de lectura al objeto modals del state via getters del store
    // La finalidad es saber que modal esta abierto o cerrado
    ...mapGetters(['modals']),
  },
  methods: {
    closeModal() {
      // Despachamos una acción para mandar a cerrar el modal
      this.$store.dispatch('TOGGLE_MODAL_STATE', {
        name: 'login',
        value: false,
      });
    },
    closeModalRegister() {
      // Despachamos una accion para cerrar el modal register
      this.$store.dispatch('TOGGLE_MODAL_STATE', {
        name: 'register',
        value: false,
      });
    },
    registerHandlerSubmit() {
      // Despachar la accion que permite registrar autenticar y registrar un usuario
      // Esta acción retorna una promesa, la cual podemos usar para saber en que momento se debe
      // cerrar el modal de registro
      this.$store.dispatch('CREATE_USER', this.formRegister).then(() => {
        this.closeModalRegister();
      });
    },
    loginHandlerSubmit() {
      // Al indicar que el usuario se quiere logear, despachamos la acción que se encarga de verificar
      // a través de firebase auth si los datos son correctos.
      // Esta acción devuelve una promesa, la cual podemos emplear para cerrar el modal de login
      this.$store.dispatch('SIGN_IN', {
        email: this.formLogin.email,
        password: this.formLogin.password,
      }).then(() => {
        // Cerrar el modal de login
        this.closeModal();
      });
    },
  },
};
</script>

<style>
  .section__hero {
    min-height: 450px;
    background-image: url("https://images.unsplash.com/photo-1504202302068-15fc2055f7f9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1330&q=80");
  }

  .form__field .input-icon {
    top: 7px;
    left: 9px;
  }

  .form__field > .input__search {
    @apply pl-10;
  }

  @media(max-width: 576px) {
    .section__hero {
      min-height: 250px;
    }

    .section__form {
      @apply w-full;
    }
  }
</style>
