import React, { Component } from 'react';
import { Button, Divider, Form, Icon, Input, message, Switch, Upload } from 'antd';
import { api, formItemLayout } from '@/common/constant';
import reqwest from 'reqwest';

const { TextArea } = Input;

const strConfig = {
  rules: [{ required: true, message: '必填项!' }],
};

const objConfig = {
  rules: [{ required: true, message: '必填项!' }],
};
// {
//   uid: '-1',
//     name: 'xxx.png',
//   status: 'done',
//   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
//   thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
// }
@Form.create()
class SingleItem extends Component {
  state = {
    fileList: [],
    uploading: false,
  };

  componentDidMount() {
    const { item } = this.props;
    if (item) {
      this.setState({
        fileList: [{
          uid: '-1',
          name: 'xxx.png',
          status: 'done',
          url: item.image,
          thumbUrl: item.image,
        }],
      });
      this.props.form.setFieldsValue({
        title: item.title,
        name: item.name,
        probability: item.probability,
        amount: item.amount,
        dayAmount: item.dayAmount,
        frequency: item.frequency,
        image: item.image,
        description: item.description,
        verify: item.verify,
        id: item.id,
      });
    }
  }

  getFields = () => {
    let result = null;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.activityId = this.props.id;
        result = values;
      }
    });
    return result;
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
          [field]: [{
            ...this.state[field],
            uid: resp.data.id,
            status: 'done',
            url: resp.data.url,
            thumbUrl: resp.data.url,
          }],
          uploading: false,
        }, () => {
          this.props.form.setFieldsValue({
            image: resp.data.url,
          });
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

  onRemove = (filed, file) => {
    this.setState({
      [filed]: [],
    });
    this.props.form.setFieldsValue({
      image: '',
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const props = {
      listType: 'picture',
      fileList: [...this.state.fileList],
      onRemove: this.onRemove.bind(null, 'fileList'),
      beforeUpload: this.beforeUpload.bind(null, 'fileList'),
    };
    return (
      <Form {...formItemLayout}>
        <Divider orientation="left">{this.props.index + 1}号奖品</Divider>
        <Form.Item
          label='奖项名称'
        >
          {getFieldDecorator('title', {
            ...strConfig,
          })(
            <Input/>,
          )}
        </Form.Item>
        <Form.Item
          label='奖品名称'
        >
          {getFieldDecorator('name', {
            ...strConfig,
          })(
            <Input/>,
          )}
        </Form.Item>
        <Form.Item
          label='中奖概率'
        >
          {getFieldDecorator('probability', {
            ...strConfig,
          })(
            <Input addonAfter='%'/>,
          )}
        </Form.Item>
        <Form.Item
          label='奖品数量'
        >
          {getFieldDecorator('amount', {
            ...strConfig,
          })(
            <Input/>,
          )}
        </Form.Item>
        <Form.Item
          label='每日数量'
        >
          {getFieldDecorator('dayAmount', {
            ...strConfig,
          })(
            <Input/>,
          )}
        </Form.Item>
        <Form.Item
          label='可中次数'
        >
          {getFieldDecorator('frequency', {
            ...strConfig,
          })(
            <Input/>,
          )}
        </Form.Item>
        <Form.Item
          label='奖品图片'
        >
          {getFieldDecorator('image', {
            ...objConfig,
          })(
            <Upload {...props}>
              <Button loading={this.state.uploading}>
                <Icon type="upload"/> 上传奖品图片
              </Button>
            </Upload>,
          )}
        </Form.Item>
        <Form.Item
          label='中奖提示语'
        >
          {getFieldDecorator('description', {
            ...strConfig,
          })(
            <TextArea placeholder="Autosize height with minimum and maximum number of lines"
                      autosize={{ minRows: 4 }}/>,
          )}
        </Form.Item>
        <Form.Item
          label='短信验证'
        >
          {getFieldDecorator('verify', { valuePropName: 'checked', initialValue: false })(
            <Switch/>,
          )}
        </Form.Item>
        <Form.Item
          label='id'
          style={{ display: 'none' }}
        >
          {getFieldDecorator('id')(
            <Input disabled={true}/>,
          )}
        </Form.Item>
      </Form>
    );
  }
}

export default SingleItem;
