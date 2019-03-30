import request from '@/common/request';
import { api } from '@/common/constant';

export function deleteGlobalImei(id) {
  let formData = new FormData();
  formData.append('id', id);
  return request(`${api}/admin/imei/delete`, {
    method: 'POST',
    credentials: 'omit',
    body: formData,
  });
}
