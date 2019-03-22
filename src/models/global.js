export default {
  namespace: 'global',
  state: {
    currentLink: '/',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        dispatch({
          type: 'save',
          payload: {
            currentLink: pathname,
          },
        });
      });
    },
  },

  effects: {},

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
