import * as services from '../services/global';
import { message } from 'antd';

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

  effects: {
    * deleteGlobalImei({ payload: { id } }, { call }) {
      const { data } = yield call(services.deleteGlobalImei, id);
      parseInt(data.code, 10) === 1 ?
        message.success(data.msg)
        :
        message.error(data.msg);
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
