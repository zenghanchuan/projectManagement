import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
 state: {
  message: '我是阿格斯之盾',
  url:'http://39.100.0.35:8100',
//   url:'http://192.168.101.33:8100',
  token:'',
  username:'',
 },
 mutations: {
  MESSAGE_INFO (state,view) {
  state.message = view;
 },
  settoken(state, payload){
      if(payload.hasOwnProperty('token')){
          state.token = payload.token
      }
  },
  setusername(state, payload){
    if(payload.hasOwnProperty('username')){
        state.username = payload.username
    }
},
 }
})
export default store