import React, { Component } from 'react';
import { Form, Radio, Button, Upload, Icon, message, Table } from 'antd';
import { api, formItemLayout } from '@/common/constant';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import reqwest from 'reqwest';
import { connect } from 'dva';
import moment from '@/pages/ImeiSetting';

const RadioGroup = Radio.Group;
const dataSource = [{
  key: '1',
  name: '胡彦斌',
  age: 32,
  address: '西湖区湖底公园1号',
}, {
  key: '2',
  name: '胡彦祖',
  age: 42,
  address: '西湖区湖底公园1号',
}];

@connect(({ bigWheel }) => ({
  bigWheel,
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
      radio: this.props.detail.imei,
    });
    this.props.form.setFieldsValue({
      recording: this.props.detail.imei,
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
      return text && moment(text).format('YYYY-MM-DD HH:mm:ss');
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

  onChange = (e) => {
    this.setState({
      radio: e.target.value,
    });
  };

  IMeiSubmit = () => {
    debugger;
    this.props.dispatch({
      type: 'bigWheel/upDateIMei',
      payload: {
        id: this.props.id,
        type: this.state.radio,
        file: this.state.radio === 0 ? '' : this.state.file,
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
              <Radio value={0}>1v1</Radio>
              <Radio value={1}>1vN</Radio>
            </RadioGroup>,
          )}
        </Form.Item>
        <Form.Item
          label={formatMessage({ id: 'imei.import.title' })}
        >
          {getFieldDecorator('import')(
            <Upload {...props}>
              <Button>
                <Icon type="upload"/> {formatMessage({ id: 'imei.import.btn' })}
              </Button>
            </Upload>,
          )}
        </Form.Item>
        <Table dataSource={dataSource} columns={this.columns}/>
        <div style={{ textAlign: 'center', marginTop: 50 }}>
          <Button type='primary' htmlType='submit' style={{ marginRight: 10 }} onClick={this.IMeiSubmit}>
            {formatMessage({ id: 'imei.import.save' })}
          </Button>
        </div>
      </Form>
    );
  }
}

export default ImeiSetting;
