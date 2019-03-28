import React, { Component } from 'react';
import { Checkbox, Divider, Form, Input, Select } from 'antd';
import { formItemLayout } from '@/common/constant';

const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

const strConfig = {
  rules: [{  required: true, message: 'Please select time!' }],
};

@Form.create()
class SingleModel extends Component {
  getFields = () => {
    let result = null;
    this.props.form.validateFieldsAndScroll((err, values) => {
      result = values;
      if (!err) {
        // values.activityId = this.props.id;
      }
    });
    return result;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const tailFormItemLayout = {
      labelCol: {
        sm: { span: 24 },
        md: { span: 4 },
      },
      wrapperCol: {
        sm: { span: 24 },
        md: { span: 8 },
      },
    };
    return (
      <Form {...formItemLayout}>
        <Form.Item
          label={`机型${this.props.i + 1}`}
        >
          {getFieldDecorator(`name`, {
            ...strConfig,
            initialValue: 'x27',
          })(
            <Select placeholder="Please select a country">
              <Option value="x27">x27</Option>
              <Option value="2">2</Option>
              <Option value="3">3</Option>
              <Option value="4">4</Option>
              <Option value="5">5</Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item
          label='可抽奖次数'
        >
          {getFieldDecorator(`luckyTimes`, {
            ...strConfig,
          })(
            <Input/>,
          )}
        </Form.Item>
        <Form.Item
          label='可中奖项'
        >
          {getFieldDecorator(`prizeWinner`, {
            ...strConfig,
            value: ['Apple'],
          })(
            <CheckboxGroup options={[
              { label: 'Apple', value: 'Apple' },
              { label: 'Pear', value: 'Pear' },
              { label: 'Orange', value: 'Orange' },
            ]}/>,
          )}
        </Form.Item>
        <Form.Item
          label='中奖概率'
        >
          <Form.Item
            label='一等奖'
            {...tailFormItemLayout}
          >
            {getFieldDecorator(`1d`)(
              <Input addonAfter='%'/>,
            )}

          </Form.Item>
          <Form.Item
            label='二等奖'
            {...tailFormItemLayout}
          >
            {getFieldDecorator(`2d`)(
              <Input addonAfter='%'/>,
            )}
          </Form.Item>
          <Form.Item
            label='三等奖'
            {...tailFormItemLayout}
          >
            {getFieldDecorator(`3d`)(
              <Input addonAfter='%'/>,
            )}

          </Form.Item>
        </Form.Item>
        <Divider/>
      </Form>
    );
  }
}

export default SingleModel;
