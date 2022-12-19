import { endpoints } from '@/services/api'

const state = {
  table: {
    data : []
  },
  setting : {
    data : []
  }
}

// getters
const getters = {}

// actions
const actions = {
  // get records
  async get ({ commit }, { id }) {
    
    commit('setLoading', true)
    const res = await this.$axios.get(endpoints['setting']+'/'+id)
    const { data, meta } = res.data
    commit('updateTableData', data)
    setTimeout(() => {
      commit('setLoading', false)
    }, 250)
  },
  async getSetting ({ commit }, {  }) {
    
    const res = await this.$axios.get(endpoints['setting_category'])
    const { data, meta } = res.data
    commit('updateSettingData', data)
  },

  async update ({ commit} , d) {
    const res = await this.$axios.put(endpoints['setting']+'/'+id)

    console.log(d);
    console.log('_test');
  }
}

// mutations
const mutations = {
  setLoading(state, val) {
    state.table.loading = val
  },
  updateTableData(state, data) {
    state.table.data = data.map(rec => {
      return rec
    })
  } ,

  updateSettingData(state, data) {
    state.setting.data = data.map(rec => {
      return rec
    })
  } 
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
