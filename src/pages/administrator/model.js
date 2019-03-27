import * as services from './services';
import { message } from 'antd';

export default {
  namespace: 'administrator',
  state: {
    userList: [],
    userPage: 1,
    userTotal: 0,
    searchKeyWord: '',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
      });
    },
  },

  effects: {
    * fetchUserList({ payload: { page = 1, searchKeyWord = '' } }, { call, put }) {
      const { data } = yield call(services.fetchUserList, page, searchKeyWord);
      parseInt(data.code, 10) === 1 ?
        yield put({
          type: 'save',
          payload: {
            userList: data.data.list,
            userPage: page,
            userTotal: data.data.total,
            searchKeyWord,
          },
        })
        :
        message.error(data.msg);
    },
    * addUser({ payload: { form } }, { call }) {
      const { data } = yield call(services.addUser, form);
      parseInt(data.code, 10) === 1 ?
        message.success(data.msg)
        :
        message.error(data.msg);
    },
    * updateUser({ payload: { form } }, { call }) {
      const { data } = yield call(services.updateUser, form);
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
