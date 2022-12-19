import { endpoints } from '@/services/api'
import { walkChilds, createTableState ,normalizePagination } from '@/services/helper'

const state = {
  table: createTableState(),
}

// getters
const getters = {}

// actions
const actions = {
  // get records
  async get ({ commit }, { page }) {

    commit('setLoading', true)
    const res = await this.$axios.get(endpoints['content_post_category'],{
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
  //  delete record
  async delete({ commit, dispatch }, { id }) {

    if (id.length === 0) {
      this._vm.$message.info(this.app.i18n.t('messages.select'))
    } else {
      for (let i = 0; i < id.length; i++) {
        const { data } =   await this.$axios.delete(endpoints['content_post_category']+'/'+id[i]);
        if (data.status) {
          this._vm.$message.success(this.app.i18n.t('messages.delete_ok'))
        } else {
          this._vm.$message.error(data.message)
        }
      }
      dispatch('refresh')
    }
  },

  async fetchChild({ commit }, { id }) {
    commit('setLoading', true)
    const res = await  this.$axios.get(endpoints['content_post_category']+'/'+id+'/children');
    const { data, parent } = res.data
    console.log(data)
    commit('updateTableChildrenData', {
      data,
      parent,
    })
    // commit('updatePagination', normalizePagination(meta))
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
  updateTableChildrenData(state, { data, parent }) {
    state.table.data = walkChilds(state.table.data, {
      id: parent.id,
      children: data.map(item => {
        return {
          ...item,
          ...(item.has_children ? { children: [] } : {}),
        }
      }),
    })
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
