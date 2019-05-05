<template>
  <div class="slider-wrapper">
    <!-- Este componente acepta elementos html, que son los hijos del slider -->
    <slot></slot>
  </div>
</template>

<script>
// Añadir la librería a través de Webpack (ver documentacion)
import { tns } from 'tiny-slider/src/tiny-slider';
// La librería tiene su css, el cual se encuentra dentro del paquete descargado a travpes de npm o url
import 'tiny-slider/dist/tiny-slider.css';

export default {
  name: 'TinySlider',
  data() {
    return {
      // Cuando se coloca $ antes de un modelo, le indicamos que no la observe y no será reactiva.
      // Esta sera una variable para hacer referencia al slider
      $slider: null,
    };
  },
  mounted() {
    // Cuando el componente se monte, indicamos que el slider se inicialice
    this.init();
  },
  beforeDestroy() {
    this.beforeDestroy();
  },
  methods: {
    init() {
      // Este es el objeto de configuración minimo para que trabaje la libreria
      const settings = {
        // container: '.slider-wrapper'
        container: this.$el, // accedemos al elemento padre de este componente
        mode: 'gallery',
      };
      // Iniciamos el slider segun la documentación oficial
      this.$slider = tns(settings);
    },
    beforeDestroy() {
      if (this.$slider) {
        // Por buenas practicas.
        // En la documentación indica que destroy destruye el elemento antes de cerrar la ventana o abandona la página y hacer un mejor uso de memoria (esto es valido tambien en el virtual dom)
        this.$slider.destroy();
      }
    },
  },
};
</script>
