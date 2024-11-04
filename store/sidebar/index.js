
export const state = () => ({
    isSidebarOpen: false,
    selected: '',
    page: ''
})

export const mutations = {
    toggleSidebar(state) {
        state.isSidebarOpen = !state.isSidebarOpen
    },
    setSelected(state, value) {
        state.selected = value
    },
    setPage(state, value) {
        state.page = value
    }
}

export const actions = {
    toggleSidebar({ commit }) {
        commit('toggleSidebar')
    },
    setSelected({ commit }, value) {
        commit('setSelected', value)
    },
    setPage({ commit }, value) {
        commit('setPage', value)
    }
}

export const getters = {
    isSidebarOpen(state) {
        return state.isSidebarOpen
    },
    selected(state) {
        return state.selected
    },
    page(state) {
        return state.page
    }
}
