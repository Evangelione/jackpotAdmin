import React, { Component } from 'react';
import { Modal, Form, Input, Radio, message } from 'antd';
import { connect } from 'dva';

const RadioGroup = Radio.Group;

@connect(({ administrator }) => ({
  administrator,
}))
@Form.create()
class OperatorModal extends Component {
  state = {
    visible: false,
  };

  showModal = () => {
    if (this.state.visible) return false;
    const { modify } = this.props;
    modify && (
      this.props.form.setFieldsValue({
        name: modify.name,
        username: modify.username,
        auth: modify.auth,
      })
    );
    this.setState({
      visible: true,
    });
  };

  handleOk = (e) => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values.password !== values.password2) {
          message.error('2次密码输入不一致');
          return false;
        }
        let method = 'addUser';
        if (this.props.modify.id) {
          method = 'updateUser';
          values.id = this.props.modify.id;
        }
        this.props.dispatch({
          type: `administrator/${method}`,
          payload: {
            form: values,
          },
        }).then(() => {
          this.props.dispatch({
            type: 'administrator/fetchUserList',
            payload: {},
          });
          this.handleCancel();
        });
      }
    });
  };

  handleCancel = (e) => {
    this.props.form.resetFields();
    this.setState({
      visible: false,
    });
  };

  render() {
    const { visible } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        sm: { span: 24 },
        md: { span: 5 },
      },
      wrapperCol: {
        sm: { span: 24 },
        md: { span: 12 },
      },
    };

    return (
      <div onClick={this.showModal} style={{ display: 'inline-block' }}>
        {this.props.children}
        <Modal
          title={`管理员`}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form {...formItemLayout}>
            <Form.Item
              label='姓名'
            >
              {getFieldDecorator('name', {
                rules: [{
                  required: true, message: '请输入姓名!',
                }],
              })(
                <Input placeholder='请输入姓名'/>,
              )}
            </Form.Item>
            <Form.Item
              label='账号'
            >
              {getFieldDecorator('username', {
                rules: [{
                  required: true, message: '请输入账号!',
                }],
              })(
                <Input placeholder='请输入账号'/>,
              )}
            </Form.Item>
            <Form.Item
              label='密码'
            >
              {getFieldDecorator('password', {
                rules: [{
                  required: true, message: '请输入密码!',
                }],
              })(
                <Input.Password placeholder='请输入密码'/>,
              )}
            </Form.Item>
            <Form.Item
              label='确认密码'
            >
              {getFieldDecorator('password2', {
                rules: [{
                  required: true, message: '请确认密码!',
                }],
              })(
                <Input.Password placeholder='请确认密码'/>,
              )}
            </Form.Item>
            <Form.Item
              label='权限'
            >
              {getFieldDecorator('auth', {
                initialValue: '1',
              })(
                <RadioGroup onChange={this.onChange}>
                  <Radio value='1'>查看</Radio>
                  <Radio value='2'>兑奖</Radio>
                  <Radio value='3'>管理员</Radio>
                </RadioGroup>,
              )}
            </Form.Item>
          </Form>
        </Modal>
      </div>

    );
  }
}

export default OperatorModal;
