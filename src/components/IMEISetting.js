import React, { Component } from 'react';
import { Form, Radio, Button, Upload, Icon, message, Table, Pagination, Modal } from 'antd';
import { api, formItemLayout } from '@/common/constant';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import reqwest from 'reqwest';
import { connect } from 'dva';
import moment from 'moment';

const confirm = Modal.confirm;
const RadioGroup = Radio.Group;

@connect(({ bigWheel, loading }) => ({
  bigWheel,
  loading: loading.models.bigWheel,
}))
@Form.create()
class ImeiSetting extends Component {
  state = {
    radio: 0,
    fileList: [],
    file: '',
  };

  componentDidMount() {
    console.log(this.props.detail);
    this.setState({
      radio: this.props.detail.multiPhone,
    });
    this.props.form.setFieldsValue({
      recording: this.props.detail.multiPhone,
    });
    this.props.dispatch({
      type: 'bigWheel/fetchIMEIList',
      payload: {
        id: this.props.id,
      },
    });
  }

  pageChange = (page) => {
    this.props.dispatch({
      type: 'bigWheel/fetchIMEIList',
      payload: {
        page,
      },
    });
  };

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
    confirm({
      title: formatMessage({ id: 'modal.delete.title' }),
      content: formatMessage({ id: 'modal.delete.confirm' }),
      onOk: () => {
        this.props.dispatch({
          type: 'global/deleteGlobalImei',
          payload: {
            id,
          },
        }).then(() => {
          this.props.dispatch({
            type: 'bigWheel/fetchIMEIList',
            payload: {
              id: this.props.id,
            },
          });
        });
      },
    });
  };

  onChange = (e) => {
    this.setState({
      radio: e.target.value,
    });
  };

  IMeiSubmit = () => {
    this.props.dispatch({
      type: 'bigWheel/upDateIMei',
      payload: {
        id: this.props.id,
        type: this.state.radio,
        file: this.state.radio === 0 ? '' : this.state.file,
      },
    }).then(() => {
      this.props.dispatch({
        type: 'bigWheel/fetchIMEIList',
        payload: {
          id: this.props.id,
        },
      });
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
      url: `${api}/api/upload`,
      method: 'post',
      processData: false,
      data: formData,
      success: (resp) => {
        this.setState({
          fileList: [{
            ...this.state[field],
            name: resp.data.name,
            uid: resp.data.id,
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
    const { getFieldDecorator } = this.props.form;
    const { IMEIList, IMEIPage, IMEITotal } = this.props.bigWheel;
    const props = {
      fileList: [...this.state.fileList],
      onRemove: this.onRemove,
      beforeUpload: this.beforeUpload.bind(null, 'banner'),
    };
    return (
      <Form {...formItemLayout}>
        <Form.Item
          label={formatMessage({ id: 'imei.import.1vN' })}
        >
          {getFieldDecorator('recording', {
            initialValue: this.state.radio,
          })(
            <RadioGroup onChange={this.onChange}>
              <Radio value={true}>{formatMessage({ id: 'imei.import.1v1.single' })}</Radio>
              <Radio value={false}>{formatMessage({ id: 'imei.import.1vN.multiple' })}</Radio>
            </RadioGroup>,
          )}

        </Form.Item>
        <Form.Item
          label={formatMessage({ id: 'imei.import.title' })}
        >
          {getFieldDecorator('import')(
            <Upload {...props}>
              <Button loading={this.props.loading}>
                <Icon type="upload"/> {formatMessage({ id: 'imei.import.btn' })}
              </Button>
            </Upload>,
          )}
        </Form.Item>
        <Table dataSource={IMEIList} columns={this.columns} rowKey='id'/>
        <div style={{ textAlign: 'center', marginTop: 30 }}>
          <Pagination current={IMEIPage} total={IMEITotal} onChange={this.pageChange}/>
        </div>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Button type='primary' htmlType='submit' loading={this.props.loading} style={{ marginRight: 10 }}
                  onClick={this.IMeiSubmit}>
            {formatMessage({ id: 'imei.import.save' })}
          </Button>
        </div>
      </Form>
    );
  }
}

export default ImeiSetting;
