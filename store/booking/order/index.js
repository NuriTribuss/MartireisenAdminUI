import {endpoints} from '@/services/api'
import {createTableState, normalizePagination} from '@/services/helper'

const state = {
  table: createTableState(),
};

// getters
const getters = {};

// actions
const actions = {
  // get records
  async get({commit}, {page}) {

      commit('setLoading', true);
      const res = await this.$axios.get(endpoints['booking_order'], {
        params: {
          page: page.current,
          limit: page.pageSize
        }
      });
      const {data, meta} = res.data;
      commit('updateTableData', data);
      commit('updatePagination', normalizePagination(meta));
      setTimeout(() => {
        commit('setLoading', false)
      }, 250)
  },
  async getFilteredData({commit}, {searchData, page}) {

    commit('setLoading', true);
    const res = await this.$axios.get(endpoints['booking_order'], {
      params: {
        page: page.current,
        limit: page.pageSize,
        "source" : searchData.source,
        "code" : searchData.code,
        "email" : searchData.email,
        "name" : searchData.name,
        "created_at[min]": searchData.created_min,
        "created_at[max]": searchData.created_max,
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
  refresh({state, dispatch}) {
    dispatch('get', {
      page: state.table.pagination.current,
      limit: state.table.pagination.pageSize,
    })
  }
};

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
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
