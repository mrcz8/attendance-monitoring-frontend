export const state = () => ({
    q: '',
    page: 1,
  })

  export const mutations = {
    setQuery(state, query) {
        state.q = query
    },
    setPage(state, page) {
      state.page = page
    },
  }