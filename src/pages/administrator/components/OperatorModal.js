import React, { Component } from 'react';
import { Modal, Form, Input, Radio, message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
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
        md: { span: 8 },
      },
      wrapperCol: {
        sm: { span: 24 },
        md: { span: 15 },
      },
    };

    return (
      <div onClick={this.showModal} style={{ display: 'inline-block' }}>
        {this.props.children}
        <Modal
          title={formatMessage({ id: 'administrator.list.table.administrator' })}
          visible={visible}
          onOk={this.handleOk}
          okText={formatMessage({ id: 'administrator.list.modal.submit' })}
          onCancel={this.handleCancel}
          cancelText={formatMessage({ id: 'administrator.list.modal.cancel' })}
        >
          <Form {...formItemLayout}>
            <Form.Item
              label={formatMessage({ id: 'administrator.list.table.name' })}
            >
              {getFieldDecorator('name', {
                rules: [{
                  required: true, message: formatMessage({ id: 'administrator.list.modal.name.place' }),
                }],
              })(
                <Input placeholder={formatMessage({ id: 'administrator.list.modal.name.place' })}/>,
              )}
            </Form.Item>
            <Form.Item
              label={formatMessage({ id: 'administrator.list.table.account' })}
            >
              {getFieldDecorator('username', {
                rules: [{
                  required: true, message: formatMessage({ id: 'administrator.list.modal.account.place' }),
                }],
              })(
                <Input placeholder={formatMessage({ id: 'administrator.list.modal.account.place' })}/>,
              )}
            </Form.Item>
            <Form.Item
              label={formatMessage({ id: 'administrator.list.table.password' })}
            >
              {getFieldDecorator('password', {
                rules: [{
                  required: true, message: formatMessage({ id: 'administrator.list.modal.password.place' }),
                }],
              })(
                <Input.Password placeholder={formatMessage({ id: 'administrator.list.modal.password.place' })}/>,
              )}
            </Form.Item>
            <Form.Item
              label={formatMessage({ id: 'administrator.list.table.confirmPassword' })}
            >
              {getFieldDecorator('password2', {
                rules: [{
                  required: true, message: formatMessage({ id: 'administrator.list.modal.confirmPassword.place' }),
                }],
              })(
                <Input.Password placeholder={formatMessage({ id: 'administrator.list.modal.confirmPassword.place' })}/>,
              )}
            </Form.Item>
            <Form.Item
              label={formatMessage({ id: 'administrator.list.table.operatingAuthorization' })}
            >
              {getFieldDecorator('auth', {
                initialValue: '1',
              })(
                <RadioGroup onChange={this.onChange}>
                  <Radio value='1'>{formatMessage({ id: 'administrator.list.table.check' })}</Radio>
                  <Radio value='2'>{formatMessage({ id: 'administrator.list.table.redeem' })}</Radio>
                  <Radio value='3'>{formatMessage({ id: 'administrator.list.table.administrator' })}</Radio>
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
