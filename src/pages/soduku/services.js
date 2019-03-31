import request from '@/common/request';
import { PAGESIZE, api } from '@/common/constant';

export function fetchSodukuList(page, category) {
  return request(`${api}/admin/activity/list?pageNum=${page}&pageSize=${PAGESIZE}&category=${category}`, {
    method: 'GET',
    credentials: 'omit',
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
