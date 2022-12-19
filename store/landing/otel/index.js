import { endpoints } from '@/services/api'
import { createFormState, createTableState ,normalizePagination } from '@/services/helper'

function createDefaultForm(type = 'edit', fields = {}) {
  return createFormState({
    language: '',
    name: '',
    content: '',
    url: '',
    active: 1,
    // sortNumber: 1,
    ...fields,
  }, type)
}

const state = {
  table: createTableState(),
  form: createDefaultForm(),
  data: {}
}

// getters
const getters = {

}

// actions
const actions = {
  // get records
  async get ({ commit }, { page }) {

    commit('setLoading', true)
    const res = await this.$axios.get(endpoints['landing_otel'],{
      params : {
        page: page.current,
        limit: page.pageSize,
      }
    })
    const { data, meta } = res.data
    commit('updateTableData', data)
    commit('updatePagination', normalizePagination(meta))
    setTimeout(() => {
      commit('setLoading', false)
    }, 250)
  },

  async getById ({ commit }, { id }) {

    const res = await this.$axios.get(endpoints['landing_otel']+'/'+id)
    const { data, meta } = res.data
    console.log(data)
    commit('updateData', data)

  },
  //  delete record
  async delete({ commit, dispatch }, { id }) {

    if (id.length === 0) {
      this._vm.$message.info(this.app.i18n.t('messages.select'))
    } else {
      for (let i = 0; i < id.length; i++) {
        const { data } =   await this.$axios.delete(endpoints['landing_otel']+'/'+id[i]);
        if (data.status) {
          this._vm.$message.success(this.app.i18n.t('messages.delete_ok'))
        } else {
          this._vm.$message.error(data.message)
        }
      }
      dispatch('refresh')
    }
  },
  async getFilteredData({commit}, {searchData, page}) {

    commit('setLoading', true);
    const res = await this.$axios.get(endpoints['landing_otel'], {
      params: {
        page: page.current,
        limit: page.pageSize,
        "url" : searchData.url,
        "name" : searchData.name,
        "language" : searchData.language
      }
    });
    const {data, meta} = res.data;
    commit('updateTableData', data);
    commit('updatePagination', normalizePagination(meta));
    setTimeout(() => {
      commit('setLoading', false)
    }, 250)
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
  updateData(state,data){
    state.data = data;
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
