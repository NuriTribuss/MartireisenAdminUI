import { endpoints } from '@/services/api'
import { walkChilds, createTableState ,normalizePagination } from '@/services/helper'

const state = {
  table: createTableState(),
  options: [],
  menuData : {}
}

// getters
const getters = {}

// actions
const actions = {
  // get records
  async get ({ commit }, { parent_id }) {
    
    commit('setLoading', true)
    const res = await this.$axios.get(endpoints['design_menu']+'/'+parent_id+'/category')
    const { data, meta ,parent } = res.data
    commit('updateTableData', data)
    commit('updateMenuData', parent)

    commit('updatePagination', normalizePagination(meta))
    setTimeout(() => {
      commit('setLoading', false)
    }, 250)
  },
  async getOptions ({ commit }, { parent }) {
    
    const res = await this.$axios.get(endpoints['design_menu']+'/'+parent+'/category/1/options')
    const { data } = res.data
    commit('updateOptionsData', data)
   
  },
  //  delete record
  async delete({ commit, dispatch }, { parent,id }) {
    
    if (id.length === 0) {
      this._vm.$message.info(this.app.i18n.t('messages.select'))
    } else {
      for (let i = 0; i < id.length; i++) {
        const { data } =   await this.$axios.delete(endpoints['design_menu']+'/'+parent+'/category/'+id[i]);
        if (data.status) {
          this._vm.$message.success(this.app.i18n.t('messages.delete_ok'))
        } else {
          this._vm.$message.error(data.message)
        }
      }
      dispatch('refresh',{
        parent : parent
      })
    }
  },

  async fetchChild({ commit }, { parent_id, id }) {
    commit('setLoading', true)
    const res = await  this.$axios.get(endpoints['design_menu']+'/'+parent_id+'/category/'+id+'/children');
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
  refresh ({ state, dispatch }, {parent}) {
    dispatch('get', {
      parent_id: parent
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
  updateOptionsData(state,data){
    state.options = data;
  },
  updateMenuData(state,data){
    state.menuData = data;
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
