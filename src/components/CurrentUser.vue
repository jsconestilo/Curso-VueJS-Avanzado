<template>
  <div class="current-user">
    <!-- Mediante los scoped slot paso data al componente padre, y permito que este se encargue de indicar el lugar donde y como deben aparecer los datos.
    En este caso le paso el objeto user autenticado -->
    <slot :user="user"></slot>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'CurrentUser',
  computed: {
    ...mapGetters({ user: 'authUser' }),
  },
};
</script>
