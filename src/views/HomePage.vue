<template>
  <default-layout>
    <section class="container mx-auto py-6">
      <h1 class="text-3xl font-light text-grey-darkest mb-3">Recommended</h1>
      <div class="section">
        <!-- En esta sección se invoca el componete de slider, y segun la documentación cada div hijo representa un elmeento hijo del slider. De ahi el uso de slot en el componente-->
        <tiny-slider>
          <div class="slider-item">1</div>
          <div class="slider-item">2</div>
          <div class="slider-item">3</div>
          <div class="slider-item">4</div>
        </tiny-slider>
      </div>
    </section>

    <section class="container mx-auto py-6">
      <h1 class="text-3xl font-light text-grey-darkest mb-3">Explore</h1>
      <div class="section__explore grid-container mb-8">
        <div class="house__card mb-3" v-for="room in rooms" :key="room['.key']">
          <div class="house__thumbnail relative overflow-hidden">
            <img class="house__image absolute w-full" width="250" :src="room.featured_image">
          </div>
          <div class="house__content bg-white p-3 border rounded">
            <div class="house__type font-semibold text-xs uppercase text-teal-dark mb-1">
              {{ room.type }}
            </div>
            <div class="house__title font-bold mb-2">{{ room.title }}</div>
            <div class="house__price text-xs">
              <span class="font-bold">${{ room.price }} MXN</span> per night
            </div>
          </div>
        </div>
      </div>
      <div class="text-center">
        <!--a
          class="py-3 px-12 bg-yellow-dark no-underline text-yellow-darker text-lg rounded"
          href="#">Show all</a-->
        <router-link
          :to="{ name: 'SearchPage' }"
          class="py-3 px-12 bg-yellow-dark no-underline text-yellow-darker text-lg rounded">
          Show all
        </router-link>
      </div>
    </section>
  </default-layout>
</template>

<script>
// Importamos los getters con información del state para consumirlos en este componente, ya dependerá del mismo si desea despachar una acción para mutarlo
import { mapGetters } from 'vuex';

import DefaultLayout from '@/layouts/DefaultLayout.vue';

import TinySlider from '@/components/TinySlider.vue';

export default {
  name: 'HomePage',
  components: {
    DefaultLayout,
    TinySlider,
  },
  beforeCreate() {
    // Antes de que se cree el componene hago un fetch a las rooms
    // Pero en este caso lo limito a 12 resultados,
    // ya que el objetivo es que el usuario haga click en mostrar todo
    this.$store.dispatch('FETCH_ROOMS', 12);
  },
  computed: {
    // Mapeamos solamente la propiedad rooms del getter del store y lo declaramos como una propiedad computada
    // De esta forma tengo acceso de lectura al estado concreto de la app
    ...mapGetters(['rooms']),
  },
};
</script>

<style lang="css" scoped>
  .section__explore {
    grid-template-columns: repeat(4, 1fr);
  }

  .house__card > .house__thumbnail {
    height: 170px;
  }

  .house__thumbnail > .house__image {
    width: 100%;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%);
  }

  @media(max-width: 992px) {
    .house__card > .house__thumbnail {
      height: 150px;
    }
    .section__explore {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media(max-width: 576px) {
    .section__explore {
      grid-template-columns: repeat(1, 1fr);
    }

    .house__card > .house__thumbnail {
      height: 120px;
    }
  }
</style>
