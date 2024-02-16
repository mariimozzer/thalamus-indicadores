import { createStore } from 'vuex';

export default createStore({
  state: {
    userName: '',  
    userPermissions: [], 
  },
  getters: {
    getUserPermissions: (state) => state.userPermissions,
    getUserName: (state) => state.userName
  },
  mutations: {
    setUserPermissions: (state, permissions) => {
      state.userPermissions = permissions;
    },

    setUser: (state, { userName, userPermissions }) => {
      state.userName = userName;
      state.userPermissions = userPermissions;
    },
  },
  actions: {
    updateUserPermissions({ commit }, permissions) {
      commit('setUserPermissions', permissions);
    },

    updateUser({ commit }, { userName, userPermissions }) {
      commit('setUser', { userName, userPermissions });
    },
  },
  modules: {
 
  },
});
