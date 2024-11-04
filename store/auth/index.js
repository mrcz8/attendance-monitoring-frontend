export const state = () => ({
    user: null,
    session: null,
    isLoggedIn: false,
})

export const mutations = {
    setUser(state, user) {
        state.user = user
    },
    setSession(state, session) {
        state.session = session
    },
    setIsLoggedIn(state, isLoggedIn) {
        state.isLoggedIn = isLoggedIn
    },
}

export const actions = {
    setUser({ commit }, auth) {
        commit('setUser', auth.user)
        commit('setSession', auth.session)
        commit('setIsLoggedIn', auth.isLoggedIn)
    },
    clearUser({ commit }) {
        commit('setUser', null)
        commit('setSession', null)
        commit('setIsLoggedIn', false)
    },
}