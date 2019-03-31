import React, { Component } from 'react';
import { Table, Button, Pagination, Upload, Icon, message } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import moment from 'moment';
import reqwest from 'reqwest';
import { api } from '@/common/constant';


@connect(({ bigWheel }) => ({
  bigWheel,
}))
class Index extends Component {
  state = {
    fileList: [],
    uploading: false,
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'bigWheel/fetchImei',
      payload: {},
    });
  }

  columns = [{
    title: formatMessage({ id: 'imei.import.list.table.title' }),
    dataIndex: 'filename',
    key: 'filename',
  }, {
    title: formatMessage({ id: 'imei.import.list.table.quantity' }),
    dataIndex: 'num',
    key: 'num',
  }, {
    title: formatMessage({ id: 'imei.import.list.table.time' }),
    dataIndex: 'createtime',
    key: 'createtime',
    render: (text, record) => {
      return moment(text).format('YYYY-MM-DD HH:mm:ss');
    },
  }, {
    title: formatMessage({ id: 'imei.import.list.table.delete' }),
    render: (text, record) => {
      return <Button type='danger' onClick={this.delete.bind(null, record.id)}>
        <FormattedMessage id="imei.import.list.table.delete"/>
      </Button>;
    },
  }];

  delete = (id) => {
    this.props.dispatch({
      type: 'global/deleteGlobalImei',
      payload: {
        id,
      },
    }).then(() => {
      this.props.dispatch({
        type: 'bigWheel/fetchImei',
        payload: {},
      });
    });
  };

  pageChange = (page) => {
    this.props.dispatch({
      type: 'bigWheel/fetchImei',
      payload: {
        page,
      },
    });
  };

  onRemove = () => {
    this.setState({
      fileList: [],
    });
    this.props.form.setFieldsValue({
      file: '',
    });
  };
  beforeUpload = (field, file) => {
    // this.setState({
    //   [field]: [file],
    // });
    this.handleUpload(field, file);
    return false;
  };

  handleUpload = (field, file) => {
    const formData = new FormData();
    formData.append('file', file);

    this.setState({
      uploading: true,
    });


    // You can use any AJAX library you like
    reqwest({
      url: `${api}/admin/imei/import`,
      method: 'post',
      processData: false,
      data: formData,
      success: (resp) => {
        this.setState({
          fileList: [{
            ...this.state[field],
            name: resp.data.name,
            uid: '-`',
            status: 'done',
            url: resp.data.url,
          }],
          uploading: false,
          file: resp.data.url,
        });
        message.success(resp.msg);
      },
      error: () => {
        this.setState({
          uploading: false,
        });
        message.error('upload failed.');
      },
    });
  };

  render() {
    const { imeiList, imeiPage, imeiTotal } = this.props.bigWheel;
    const props = {
      fileList: [...this.state.fileList],
      onRemove: this.onRemove,
      beforeUpload: this.beforeUpload.bind(null, 'fileList'),
    };
    return (
      <div>
        <div style={{ marginBottom: 20 }}>
          {formatMessage({ id: 'imei.import.title' })}：
          <Upload {...props}>
            <Button loading={this.state.uploading}>
              <Icon type="upload"/> {formatMessage({ id: 'imei.import.btn' })}
            </Button>
          </Upload>
        </div>
        <p>{formatMessage({ id: 'imei.import.desc' })}</p>
        <Table dataSource={imeiList} columns={this.columns} rowKey='id' pagination={false}/>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Pagination current={imeiPage} total={imeiTotal} onChange={this.pageChange}/>
        </div>
      </div>
    );
  }
}

export default Index;
