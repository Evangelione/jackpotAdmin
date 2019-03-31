import request from '@/common/request';
import { PAGESIZE, api } from '@/common/constant';

export function fetchUserList(page, searchKeyWord) {
  return request(`${api}/admin/user/list?pageNum=${page}&pageSize=${PAGESIZE}&keywords=${searchKeyWord}`, {
    method: 'GET',
    credentials: 'omit',
    headers: {
      token: localStorage.getItem('tokenAdmin'),
    },
  });
}

export function addUser({ name, username, password, auth }) {
  let formData = new FormData();
  formData.append('name', name);
  formData.append('username', username);
  formData.append('password', password);
  formData.append('auth', auth);
  return request(`${api}/admin/user/add`, {
    method: 'POST',
    credentials: 'omit',
    body: formData,
    headers: {
      token: localStorage.getItem('tokenAdmin'),
    },
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
    headers: {
      token: localStorage.getItem('tokenAdmin'),
    },
  });
}
