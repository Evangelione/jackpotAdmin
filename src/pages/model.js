import * as services from './services';
import { message } from 'antd';
import router from 'umi/router';

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
    prizeList: [],
    phoneModalList: [],
    activityUrl: '',
    redeemKey: '',
    IMEIList: [],
    IMEIPage: 0,
    IMEITotal: 1,
    activityOption: [],
    modalOption: [],
    areaOption: [],
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
            activityUrl: data.data.activityUrl,
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
    * fetchActivityData({ payload: { page = 1, id, imei = '', phone = '', name = '', prize = '' } }, { call, put }) {
      const { data } = yield call(services.fetchActivityData, page, id, imei, phone, name, prize);
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
    * fetchImei({ payload: { page = 1, id = '', goodName = '', area = '', start = '', end = '' } }, { call, put }) {
      const { data } = yield call(services.fetchImei, page, id, goodName, area, start, end);
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
    * upDateProbability({ payload: { json } }, { call, put }) {
      const { data } = yield call(services.upDateProbability, json);
      parseInt(data.code, 10) === 1 ?
        message.success(data.msg)
        :
        message.error(data.msg);
    },
    * upDateProbabilityNormal({ payload: { id, count } }, { call, put }) {
      const { data } = yield call(services.upDateProbabilityNormal, id, count);
      parseInt(data.code, 10) === 1 ?
        message.success(data.msg)
        :
        message.error(data.msg);
    },

    * upDateIMei({ payload: { id, type, file } }, { call }) {
      const { data } = yield call(services.upDateIMei, id, type, file);
      parseInt(data.code, 10) === 1 ?
        message.success(data.msg)
        :
        message.error(data.msg);
    },
    * fetchPrizeList({ payload: { id } }, { call, put }) {
      const { data } = yield call(services.fetchPrizeList, id);
      parseInt(data.code, 10) === 1 ?
        yield put({
          type: 'save',
          payload: {
            prizeList: data.data,
          },
        })
        :
        message.error(data.msg);
    },
    * fetchPhoneModal({ payload }, { call, put }) {
      const { data } = yield call(services.fetchPhoneModal);
      parseInt(data.code, 10) === 1 ?
        yield put({
          type: 'save',
          payload: {
            phoneModalList: data.data,
          },
        })
        :
        message.error(data.msg);
    },
    * deleteDanger({ payload: { id } }, { call, put }) {
      const { data } = yield call(services.deleteDanger, id);
      parseInt(data.code, 10) === 1 ?
        message.success(data.msg)
        :
        message.error(data.msg);
    },
    * deleteActivityData({ payload: { id } }, { call, put }) {
      const { data } = yield call(services.deleteActivityData, id);
      parseInt(data.code, 10) === 1 ?
        message.success(data.msg)
        :
        message.error(data.msg);
    },
    * loginAdmin({ payload: { username, password } }, { call, put }) {
      const { data } = yield call(services.loginAdmin, username, password);
      if (parseInt(data.code, 10) === 1) {
        localStorage.setItem('tokenAdmin', data.data.token);
        localStorage.setItem('authAdmin', data.data.user.auth);
        router.push({
          pathname: '/',
        });
        message.success(data.msg);
      } else {
        message.error(data.msg);
      }
    },
    * lotteryRedeem({ payload: { id, phone, code, redeemKey } }, { call, put }) {
      const { data } = yield call(services.lotteryRedeem, id, phone, code, redeemKey);
      parseInt(data.code, 10) === 1 ?
        message.success(data.msg)
        :
        message.error(data.msg);
    },
    * getCode({ payload: { phone, type } }, { call, put }) {
      const { data } = yield call(services.getCode, phone, type);
      if (parseInt(data.code, 10) === 1) {
        if (type === 'redeem') {
          yield put({
            type: 'save',
            payload: {
              redeemKey: data.data.key,
            },
          });
        } else {
          message.error(data.msg);
        }
      } else {
        message.error(data.msg);
      }
    },
    * cancelRedeem({ payload: { id } }, { call }) {
      const { data } = yield call(services.cancelRedeem, id);
      parseInt(data.code, 10) === 1 ?
        message.success(data.msg)
        :
        message.error(data.msg);
    },
    * fetchIMEIList({ payload: { page = 1, id } }, { call, put }) {
      const { data } = yield call(services.fetchIMEIList, page, id);
      parseInt(data.code, 10) === 1 ?
        yield put({
          type: 'save',
          payload: {
            IMEIList: data.data.list,
            IMEIPage: page,
            IMEITotal: data.data.total,
          },
        })
        :
        message.error(data.msg);
    },
    * fetchGlobalOption({ payload }, { call, put }) {
      const data1 = yield call(services.fetchActivitySelect);
      const data2 = yield call(services.fetchModalSelect);
      parseInt(data1.data.code, 10) === 1 ?
        yield put({
          type: 'save',
          payload: {
            activityOption: data1.data.data,
            modalOption: data2.data.data,
          },
        })
        :
        message.error(data1.data.msg);
    },
    * fetchAreaSelect({ payload: { id } }, { call, put }) {
      const { data } = yield call(services.fetchAreaSelect, id);
      parseInt(data.code, 10) === 1 ?
        yield put({
          type: 'save',
          payload: {
            areaOption: data.data,
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
