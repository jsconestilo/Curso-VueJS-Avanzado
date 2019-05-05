import Vue from 'vue';
import Vuex from 'vuex';
// import dataSource from './data.json';
import firebase from 'firebase';
import countObjectProperties from './utils';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // user: null,
    // Estos 3 objetos son los que llenamos a través de la consulta a firebase
    users: {},
    services: {},
    rooms: {},
    modals: {
      login: false,
      register: false,
    },
    // Mapeamos el objeto almacenado en DataSource para que su contenido forme parte del estado global de la aplicacion
    // De esta forma importamos información externa al state de la app
    // ...dataSource,
    // authId: '38St7Q8Zi2N1SPa5ahzssq9kbyp1',
    authId: null,
  },
  mutations: {
    SET_MODAL_STATE(state, payload) {
      // Se puede acceder a los atributos de un objeto mediante sintaxis de array
      // apuntamos al modal (path) y cambiamos su valor (value)
      state.modals[payload.name] = payload.value;
    },
    SET_ROOM(state, payload) {
      // Objetos y arreglos no se modifican de forma reactiva en VueJS
      // Para ello es necesario indicar que los datos que a continuación se agregarán
      // deben supervisarse.
      // Dentro del objeto de rooms, se añade un path y su correspondiente valor
      // jdjshdjsh454: { todo el contenido de room }
      Vue.set(state.rooms, payload.roomId, payload.room);
    },
    APPEND_ROOM_TO_USER(state, payload) {
      // Agregar la relacion de usuario - room
      // Buscar al usuario con el id y acceder a su objeto rooms
      // Agregamos un path con nombre roomId y su valor es ese mismo romId
      Vue.set(state.users[payload.userId].rooms, payload.roomId, payload.roomId);
    },
    // Guardar los valors consultados en firebase en la app
    SET_ITEM(state, { item, id, resource }) {
      // Generar un nuevo elemento, porque no podemos modificar los parametros que se estan recibiendo or la función
      const newItem = item;
      // Crear un nuevo path en el objeto con el id (timestamp) generado por firebase
      newItem['.key'] = id;
      // Seteamos reactivamente en alguno de los objetos del state (Esta mutación es generica para setear)
      // el id y como valor el objeto con los datos del nuevo item
      // p.e. state.rooms, 45s4d5s4d, ObjectRoom
      // Recordar que los objetos y arreglos no se setean reactivamente en Vue
      Vue.set(state[resource], id, newItem);
    },
    // Mutamos el state asignando el id del usuario actualmente autenticado
    SET_AUTHID(state, id) {
      state.authId = id;
    },
  },
  actions: {
    TOGGLE_MODAL_STATE(context, payload) {
      context.commit('SET_MODAL_STATE', payload);
    },
    // Esta es otra forma de acceder, si queremos tener acceso al state desde el action
    CREATE_ROOM({ state, commit }, payload) {
      // Generar un key para la nueva room a guardar
      // const roomId = `room${Math.random()}`;
      const roomId = firebase.database().ref('rooms').push().key;
      // Crear una referencia del objeto pasado como carga util para completarlo con información de identificacion
      const room = payload;
      // room['.key'] = roomId;
      // Simular que el dueño de esta room es el usuario autenticado
      room.userId = state.authId;
      // console.log(room.userId);
      // Generar información adicional al registro de la room
      // Número de segundos desde el 01 Ene 1970 (aseguramos que la división sea redondeada hacia abajo sin decimales)
      room.publishedAt = Math.floor(Date.now() / 1000);
      room.meta = { likes: 0 };

      // Hay que salvar información en dos partes.
      // En la rama rooms y en la rama users (relación)
      const updates = {};
      // La consulta es ir al path rooms.id_generado_firebase = ObjectoRoom
      updates[`rooms/${roomId}`] = room;
      // La consulta es ir a users.id_user.rooms.id_room_firebase = id_room_firebase
      updates[`users/${room.userId}/rooms/${roomId}`] = roomId;
      // Ahora ejecutamos las queries
      firebase.database().ref().update(updates).then(() => {
        // Confirmar que queremos mutar el state agregando el nuevo objeto room
        // En este caso le paso un objeto con la room y el id generado
        // Pudo haber sido solo el room, ya que el otro valor se encuentra dentro de este
        // context.commit('SET_ROOM', { room, roomId});
        commit('SET_ROOM', { room, roomId });
        // Ahora relacionamos el id de la sala con el id del usuario que la creo
        commit('APPEND_ROOM_TO_USER', {
          roomId,
          userId: room.userId,
        });
        // Resolver y retornar una promesa
        // El objetivo es que se use desde el componente que despacha esta acción
        // para notificarle en que momento se ha resuelto la operación de registro
        // y el componente pueda hacer algo en cuestión, tal como redireccionar o colocar campo
        // de formulario vacios
        return Promise.resolve(state.rooms[roomId]);
      });
    },
    // Hacer un fetch (consulta ajax) a firebase database para obtener y cargar los datos en la aplicación
    FETCH_ROOMS({ state, commit }, limit) {
      // Firebase tarda un cierto rato en retornar la infro, por tanto usamos una promesa
      return new Promise((resolve) => {
        // Accedemos al nodo rooms (tabla) de la base de datos
        let instance = firebase.database().ref('rooms');
        if (limit) {
          // Si el limite esta definido, le indicamos a la instancia que solo retorne el número de elementos establecidos en el limite
          instance = instance.limitToFirst(limit);
        }
        // Realizar la consulta lanzando el evento value, el cual solo se va a escuchar una vez (once) y no va a estar atento a cambios en esos datos
        // La consulta recibe una instantanea (todos los datos del nodo seleccionao)
        instance.once('value', (snapshot) => {
          // Almacenar los datos (resultado) de la consulta (objeto)
          const rooms = snapshot.val();
          console.log(rooms);
          // Obtener un arreglo de las propiedades del objeto de respuesta
          // { 'ke1': {}, 'key2': {}, 'key3': {} }
          // ['key1', 'key2', 'key3']
          // e iterar por cada una de ellas (el timestamp generado por firebase)
          Object.keys(rooms).forEach((roomId) => {
            console.log(roomId);
            // Almacenar el objeto room, identificado por el timestamp en cuestion
            const room = rooms[roomId];
            // Realizar el commit, enviando la carga util a mutar
            // El recurso, el id (timestamp), el objeto room
            commit('SET_ITEM', {
              resource: 'rooms',
              id: roomId,
              item: room,
            });
            // Resolver la promesa retornando los objetos
            resolve(Object.values(state.rooms));
          });
        });
      });
    },
    // Destructuring...
    // Accedemos a datos especificos del parametro
    // Si nos envian un object, solo accedemos a sus path state y commit
    FETCH_USER({ state, commit }, id) {
      // Este fetch es para la consulta de usuarios
      // Retornamos una promesa
      return new Promise((resolve) => {
        // Invocamos el servicio de Database en la referencia users
        // En este caso la consulta es filtrada por el hijo de la rama users, que tenga el id especificado como parametro
        // Enlazamos la consulta al evento value solo una vez
        // Esta nos retorna una instantanea con el objeto que coincide con el critero de busqueda
        // Lanzamos una confformación al store, enviado el recurso, el id y el objeto user
        firebase.database().ref('users').child(id).once('value', (snapshot) => {
          // Con esto lo que se trata de hacer es que los datos del usuario sean enviados al objeto users del state
          // para que sean consumidos por la app
          commit('SET_ITEM', {
            resource: 'users',
            id: snapshot.key,
            item: snapshot.val(),
          });
        });
        // Resolver a promesa retornando el objeto user en el state que tengaa el id solicitado
        resolve(state.users[id]);
      });
    },
    // Esta acción recibe un objeto como payload, del cual me interesa solamente el email, name y password (Destructuring)
    CREATE_USER({ state, commit }, { email, name, password }) {
      // Invocar al servicio de autenticacion de firebase
      // Del servicio de autenticación usamos el proveedor de email y password, pasando dicha información
      // El proveedor retonra una promesa con la cuenta de usuario registrada
      firebase.auth().createUserWithEmailAndPassword(email, password).then((account) => {
        // Accedo al id del usuario autenticado
        const id = account.user.uid;
        // Genero los segundos redondeados a partir del 01 ene 1970
        const registeredAt = Math.floor(Date.now() / 1000);
        // Genero el objeto de usuario a registrar en el servicio de la base de datos
        const newUser = { email, name, registeredAt };
        // Importante
        // Firebase Authenticate solo registra email y password
        // Es importante salvar esta información en el servicio de base de datos tambien
        // ...
        // Para ello, accedo al servicio de base de datos, en la rama users, hijo id (que es el id del usuario autenticado)
        // y seteo (sobre-escribo) la info con el nuevo usuario.
        // En este caso queda ksd4455sd45: {...}
        firebase.database().ref('users').child(id).set(newUser)
          .then(() => {
            // El metodo set tambien devuelve una promesa, con ello estamos seguros que esta info ya fue almacenada
            // y podemos setearla a nuestro STORE
            commit('SET_ITEM', {
              resource: 'users',
              id,
              item: newUser,
            });
            // Resolvemos la promesa y la devolvemos, para informar al despachador de esta acción
            // que las operaciones finalizaron correctamente, y en consecuencia pueda hacer
            // algo al respecto, como notificar al usuario o cerrar el modal de registro
            return Promise.resolve(state.users[id]);
          });
      });
    },
    // Hacer una consulta Ajax del usuario actualmente logeado (Autenticados)
    // Las acciones reciben el contexto, pero al ser un objeto, internamente tiene el commit, state, dispatch
    FETCH_AUTH_USER(context) {
      // Obtener el uid, del usuario que ha iniciado sesión actualmente (o null)
      const userId = firebase.auth().currentUser.uid;
      // Despachamos la acción de buscar usuario, esta devuelve una promesa
      return context.dispatch('FETCH_USER', userId)
        .then(() => {
          // La promesa devuelta la utilizamos para mutar el state indicando que usuario ha inicado sesion (authId)
          context.commit('SET_AUTHID', userId);
        });
    },
    // Acción para logear usuario con su correo y contraseña
    SIGN_IN(context, { email, password }) {
      // Iniciar sesion de forma asincrona utilizando email y password (los datos empleados durante el registro)
      // Este metodo nativo de firebase auth, devuelve una promesa con las credenciales del usuario logeado
      return firebase.auth().signInWithEmailAndPassword(email, password);
    },
    // Accion para cerrar sesion
    LOG_OUT(context) {
      // Cerrar la sesión del usuario actual, este método devuelve una promesa nula
      firebase.auth().signOut()
        .then(() => {
          // Cuando el usuario a cerrado sesión es importante en el state colocar en null el atributo AuthId
          // ya que con el sabemos si alguien o no esta logeado
          context.commit('SET_AUTHID', null);
        });
    },
  },
  getters: {
    // Los getter son importantes para que distintas partes de la aplicacion (componentes)
    // tengan acceso al estado de la aplicación.
    modals(state) {
      return state.modals;
    },
    authUser(state) {
      // return state.users[state.authId];
      // En este caso verificamos si el usuario esta autenticado (ayudandonos del path authId), de ser correcto buscamos su id dentro del objeto de users
      // de lo contrario enviamos null y por tanto en la UI se muestra info de usuario invitado
      return (state.authId) ? state.users[state.authId] : null;
    },
    rooms: state => state.rooms,
    // Este es un getter dinámico, ya que por defecto los getters no aceptan parametros
    // mas que el state y otros getters. (pero yo necesito enviar parametros)
    // por tanto, uso los High order funcition que son funciones que retornan otra función
    // con esa funcion retornada yo puedo enviare los parametros que necesito y poder satisfacer el requerimoento
    userRoomsCount(state) {
      // retorno una función que recibe un parametro, este parametro contiene el valor que necesito enviar
      return function (id) {
        // los getters retornan valores, en este caso retorno el valor devuelto por otra función
        // que se encarga de decirme cuantas rooms toene registrada el usuario pasado como parametro
        // que en este caso es un objeto
        return countObjectProperties(state.users[id].rooms);
      };
    },
  },
});
