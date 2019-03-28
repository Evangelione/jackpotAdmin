import request from '@/common/request';
import { PAGESIZE, api } from '@/common/constant';

export function fetchBigWheelList(page, category) {
  return request(`${api}/admin/activity/list?pageNum=${page}&pageSize=${PAGESIZE}&category=${category}`, {
    method: 'GET',
    credentials: 'omit',
  });
}

export function addActivity(category) {
  let formData = new FormData();
  formData.append('category', category);
  return request(`${api}/admin/activity/add`, {
    method: 'POST',
    credentials: 'omit',
    body: formData,
  });
}

export function updateUser({ name, username, password, auth, id }) {
  let formData = new FormData();
  formData.append('name', name);
  formData.append('username', username);
  formData.append('password', password);
  formData.append('auth', auth);
  formData.append('id', id);
  return request(`${api}/admin/user/update`, {
    method: 'POST',
    credentials: 'omit',
    body: formData,
  });
}


export function fetchActivityData(page, category) {
  return request(`${api}/admin/activity/user?pageNum=${page}&pageSize=${PAGESIZE}&category=${category}`, {
    method: 'GET',
    credentials: 'omit',
  });
}

export function fetchImei(page, category) {
  return request(`${api}/admin/activity/user?pageNum=${page}&pageSize=${PAGESIZE}&category=${category}`, {
    method: 'GET',
    credentials: 'omit',
  });
}

export function fetchPageSetupDetail(id) {
  return request(`${api}/admin/activity?activityId=${id}`, {
    method: 'GET',
    credentials: 'omit',
  });
}

export function fetchIMeiDetail(id) {
  return request(`${api}/admin/activity/imei/detail?activityId=${id}`, {
    method: 'GET',
    credentials: 'omit',
  });
}

export function fetchprizeDetail(id) {
  return request(`${api}/admin/activity/prize/detail?activityId=${id}`, {
    method: 'GET',
    credentials: 'omit',
  });
}

export function fetchprobabilityDetail(id) {
  return request(`${api}/admin/activity/setup/detail?activityId=${id}`, {
    method: 'GET',
    credentials: 'omit',
  });
}

export function upDatePageSetup(form) {
  let formData = new FormData();
  Object.keys(form).forEach((key, i) => {
    formData.append(key, form[key]);
  });
  return request(`${api}/admin/activity/update`, {
    method: 'POST',
    credentials: 'omit',
    body: formData,
  });
}

export function upDatePrizeList(json) {
  return request(`${api}/admin/activity/prize`, {
    method: 'POST',
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(json),
  });
}
export function upDateProbability(form) {
  let formData = new FormData();
  Object.keys(form).forEach((key, i) => {
    formData.append(key, form[key]);
  });
  return request(`${api}/admin/activity/setup`, {
    method: 'POST',
    credentials: 'omit',
    body: formData,
  });
}
