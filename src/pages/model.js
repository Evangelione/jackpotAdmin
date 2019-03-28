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
    pageSetupDetail: {},
    imeiDetail: {},
    prizeDetail: [],
    probabilityDetail: {},
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
      const pageSetupDetail = yield call(services.fetchPageSetupDetail, id);
      const IMeiDetail = yield call(services.fetchIMeiDetail, id);
      const prizeDetail = yield call(services.fetchprizeDetail, id);
      const probabilityDetail = yield call(services.fetchprobabilityDetail, id);

      parseInt(probabilityDetail.data.code, 10) === 1 ?
        yield put({
          type: 'save',
          payload: {
            pageSetupDetail: pageSetupDetail.data.data,
            imeiDetail: IMeiDetail.data.data,
            prizeDetail: prizeDetail.data.data,
            probabilityDetail: probabilityDetail.data.data,
          },
        })
        :
        message.error(probabilityDetail.msg);
    },
    * upDatePageSetup({ payload: { form } }, { call, put }) {
      const { data } = yield call(services.upDatePageSetup, form);
      parseInt(data.code, 10) === 1 ?
        message.success(data.msg)
        :
        message.error(data.msg);
    },
    * upDatePrizeList({ payload: { json } }, { call, put }) {
      const { data } = yield call(services.upDatePrizeList, json);
      parseInt(data.code, 10) === 1 ?
        message.success(data.msg)
        :
        message.error(data.msg);
    },
    * upDateProbability({ payload: { form } }, { call, put }) {
      const { data } = yield call(services.upDateProbability, form);
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
