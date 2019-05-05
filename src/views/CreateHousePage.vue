<template>
  <page-layout>
    <section class="py-4 bg-teal-dark">
      <div class="container mx-auto">
        <form class="form">
          <div class="form__field relative">
            <i class="input-icon material-icons absolute text-grey-darker">search</i>
            <input
              class="input__search"
              id="where"
              type="text"
              placeholder="Mexico City, Mexico">
          </div>
        </form>
      </div>
    </section>
    <section class="section__create py-6">
      <div class="container mx-auto">
        <h1 class="text-3xl">Publish a new room</h1>
        <form @submit.prevent="save">
          <div class="mb-4">
            <label class="input__label">Title</label>
            <input v-model="publication.title" type="text" class="input__field" placeholder="Alejando">
          </div>
          <div class="mb-4">
            <label class="input__label">Description</label>
            <textarea v-model="publication.description" class="input__field" rows="10" placeholder="Descripcion"></textarea>
          </div>
          <div class="mb-4">
            <label class="input__label">Featured Image</label>
            <input v-model="publication.featuredImage" type="text" class="input__field" placeholder="Imagen https://unsplash.com">
          </div>
          <div class="mb-4 text-right">
            <button class="w-full bg-yellow-dark text-yellow-darker font-semibold py-3 px-6 rounded">Publish</button>
          </div>
        </form>
      </div>
    </section>
  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout.vue';

export default {
  name: 'CreateHousePage',
  components: { PageLayout },
  data() {
    return {
      publication: {
        title: '',
        description: '',
        featuredImage: '',
      },
    };
  },
  methods: {
    save() {
      // Guardar en constantes cada uno de los valores almacendos en los path
      // const title = this,publication.title
      const { title, description, featuredImage } = this.publication;
      // Crear una sala o room para posteriormente guardarlo en el store
      const room = {
        // title: title
        title,
        description,
        featured_image: featuredImage,
        publishedAt: Date.now(),
      };
      // Despachamos la acción que permite guardar este objeto room en el store
      // y forme parte del estado global de la app.
      // Esta acción retorna una promesa, la cual podemos usar para saber en que momento queda guardada
      // la información y poder redireccinar o hacer otra cosa
      this.$store.dispatch('CREATE_ROOM', room).then(() => {
        // Una vez salvado el registro, redireccionamos a la ruta del componente SearchPage
        this.$router.push({ name: 'SearchPage' });
      });
    },
  },
};
</script>
