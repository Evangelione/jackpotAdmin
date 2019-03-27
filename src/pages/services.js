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

export function fetchActivityDetail(id) {
  return request(`${api}/admin/activity?id=${id}`, {
    method: 'GET',
    credentials: 'omit',
  });
}
