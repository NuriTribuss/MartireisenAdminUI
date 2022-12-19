import { endpoints } from '@/services/api'
import { createFormState, createTableState ,normalizePagination } from '@/services/helper'

const state = {
  table: createTableState(),
  translate : {
    data : []
  }
}

// getters
const getters = {}

// actions
const actions = {
  // get records
  async get ({ commit }, { page }) {

    commit('setLoading', true)
    const res = await this.$axios.get(endpoints['localization_language'],{
      params : {
        page: page.current,
        limit: page.pageSize
      }
    })
    const { data, meta } = res.data
    commit('updateTableData', data)
    commit('updatePagination', normalizePagination(meta))
    setTimeout(() => {
      commit('setLoading', false)
    }, 250)
  },

  async getTranslate ({ commit }, { language }) {
    const res = await this.$axios.get(endpoints['localization_language']+'/'+language+'/translate')
    const { data, meta } = res.data
    commit('updateTranslateData', data)
    return data
  },

  async updateTranslate ({ commit }, { language ,translate}) {
    const res = await this.$axios.put(endpoints['localization_language']+'/'+language+'/translate',translate)
  //  commit('updateTranslateData', data)
  },

  //  delete record
  async delete({ commit, dispatch }, { id }) {

    if (id.length === 0) {
      this._vm.$message.info(this.app.i18n.t('messages.select'))
    } else {
      for (let i = 0; i < id.length; i++) {
        const { data } =   await this.$axios.delete(endpoints['localization_language']+'/'+id[i]);
        if (data.status) {
          this._vm.$message.success(this.app.i18n.t('messages.delete_ok'))
        } else {
          this._vm.$message.error(data.message)
        }
      }
      dispatch('refresh')
    }
  },

  // refresh records
  refresh ({ state, dispatch }) {
    dispatch('get', {
      page: state.table.pagination.current,
      limit: state.table.pagination.pageSize,
    })
  }
}

// mutations
const mutations = {

  setItem(state,data){
    const  { index,subindex,value } = data;
    console.log(state.translate.data[index].data)
    console.log(subindex)
    state.translate.data[index].data[subindex].value = value;
  },
  setLoading(state, val) {
    state.table.loading = val
  },
  updatePagination(state, pagination) {
    state.table.pagination = pagination
  },
  updateTableData(state, data) {
    state.table.data = data.map(rec => {
      if (rec.has_children > 0) {
        rec.children = []
      }
      return rec
    })
  },
  updateTranslateData(state, data) {
    state.translate.data = data;
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
