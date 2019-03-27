import * as services from './services';
import { message } from 'antd';

export default {
  namespace: 'bigWheel',
  state: {
    bigWheelList: [],
    bigWheelPage: 1,
    bigWheelTotal: 0,
    activityDataList: [],
    activityDataPage: 1,
    activityDataTotal: 0,
    imeiList: [],
    imeiPage: 0,
    imeiTotal: 1,
    activityDetail: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
    },
  },

  effects: {
    * fetchBigWheelList({ payload: { page = 1, category } }, { call, put }) {
      const { data } = yield call(services.fetchBigWheelList, page, category);
      parseInt(data.code, 10) === 1 ?
        yield put({
          type: 'save',
          payload: {
            bigWheelList: data.data.list,
            bigWheelPage: page,
            bigWheelTotal: data.data.total,
          },
        })
        :
        message.error(data.msg);
    },
    * addActivity({ payload: { category } }, { call }) {
      const { data } = yield call(services.addActivity, category);
      parseInt(data.code, 10) === 1 ?
        message.success(data.msg)
        :
        message.error(data.msg);
    },
    * fetchActivityData({ payload: { page = 1, category } }, { call, put }) {
      const { data } = yield call(services.fetchActivityData, page, category);
      parseInt(data.code, 10) === 1 ?
        yield put({
          type: 'save',
          payload: {
            activityDataList: data.data.list,
            activityDataPage: page,
            activityDataTotal: data.data.total,
          },
        })
        :
        message.error(data.msg);
    },
    * fetchImei({ payload: { page = 1, category } }, { call, put }) {
      const { data } = yield call(services.fetchImei, page, category);
      parseInt(data.code, 10) === 1 ?
        yield put({
          type: 'save',
          payload: {
            imeiList: data.data.list,
            imeiPage: page,
            imeiTotal: data.data.total,
          },
        })
        :
        message.error(data.msg);
    },
    * fetchActivityDetail({ payload: { id } }, { call, put }) {
      const { data } = yield call(services.fetchActivityDetail, id);

      parseInt(data.code, 10) === 1 ?
        yield put({
          type: 'save',
          payload: {
            activityDetail: data.data.list,
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
