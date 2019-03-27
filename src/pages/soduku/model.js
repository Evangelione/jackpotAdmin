import * as services from './services';
import { message } from 'antd';

export default {
  namespace: 'soduku',
  state: {
    sodukuList: [],
    sodukuPage: 1,
    sodukuTotal: 0,
  },

  subscriptions: {
    setup({ dispatch, history }) {
    },
  },

  effects: {
    * fetchSodukuList({ payload: { page = 1, category } }, { call, put }) {
      const { data } = yield call(services.fetchSodukuList, page, category);
      parseInt(data.code, 10) === 1 ?
        yield put({
          type: 'save',
          payload: {
            sodukuList: data.data.list,
            sodukuPage: page,
            sodukuTotal: data.data.total,
          },
        })
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
