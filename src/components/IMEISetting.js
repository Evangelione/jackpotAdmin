import React, { Component } from 'react';
import { Form, Radio, Button, Upload, Icon, message } from 'antd';
import { api, formItemLayout } from '@/common/constant';
import reqwest from 'reqwest';
import { connect } from 'dva';

const RadioGroup = Radio.Group;

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
      file: this.props.detail.url,
      fileList: [{
        uid: -1,
        name: 'imei设置文件',
        status: 'done',
        url: this.props.detail.url,
      }],
    });
    this.props.form.setFieldsValue({
      recording: this.props.detail.imei,
    });
  }

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
    const { radio } = this.state;
    const props = {
      fileList: [...this.state.fileList],
      onRemove: this.onRemove,
      beforeUpload: this.beforeUpload.bind(null, 'banner'),
    };
    return (
      <Form {...formItemLayout}>
        <Form.Item
          label='IMEI设置'
        >
          {getFieldDecorator('recording', {
            initialValue: this.state.radio,
          })(
            <RadioGroup onChange={this.onChange}>
              <Radio value={0}>全局设置</Radio>
              <Radio value={1}>单独设置</Radio>
            </RadioGroup>,
          )}
        </Form.Item>
        {radio === 0 ?
          null
          :
          <>
            <Form.Item
              label='IMEI导入'
            >
              {getFieldDecorator('import')(
                <Upload {...props}>
                  <Button>
                    <Icon type="upload"/> 导入
                  </Button>
                </Upload>,
              )}
            </Form.Item>

          </>
        }
        <div style={{ textAlign: 'center', marginTop: 50 }}>
          <Button type='primary' htmlType='submit' style={{ marginRight: 10 }} onClick={this.IMeiSubmit}>保存</Button>
        </div>
      </Form>
    );
  }
}

export default ImeiSetting;
