// Los objetos no tienen una propiedad length para saber su longitud
// por tanto, es mejor acceder a sus path padres (Object.keys) y
// el resultado es un arreglo con dichos path,
// en este sentido ya podemos usar length
const countObjectProperties = function (obj) {
  if (typeof obj === 'object') {
    return Object.keys(obj).length;
  }
  return 0;
};

export default countObjectProperties;
