import React, { Component } from 'react';
import { Form, Divider, Row, Col, Input, Select, Radio, Checkbox, Button } from 'antd';
import { formItemLayout } from '@/common/constant';

const { Option } = Select;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const strConfig = {
  rules: [{ type: 'string', required: true, message: 'Please select time!' }],
};

@Form.create()
class PossibilitySetting extends Component {
  state = {
    radio: 1,
    prizeQuantity: '6',
    phoneQuantity: '1',
  };

  onChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      radio: e.target.value,
    });
  };

  addPhone = () => {
    this.setState({
      phoneQuantity: (this.state.phoneQuantity - 0) + 1 + '',
    });
  };

  mapPhone = () => {
    const { getFieldDecorator } = this.props.form;
    const { phoneQuantity } = this.state;
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
    let ele = [];
    for (let i = 0; i < phoneQuantity - 0; i++) {
      ele.push(
        <div key={Math.random()}>
          <Form.Item
            label={`机型${i + 1}`}
          >
            {getFieldDecorator(`phone${i + 1}`, {
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
            {getFieldDecorator(`canPro${i + 1}`, {
              ...strConfig,
            })(
              <Input/>,
            )}
          </Form.Item>
          <Form.Item
            label='可中奖项'
          >
            {getFieldDecorator(`canPhone${i + 1}`, {
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
              {getFieldDecorator(`1d${i + 1}`)(
                <Input addonAfter='%'/>,
              )}

            </Form.Item>
            <Form.Item
              label='二等奖'
              {...tailFormItemLayout}
            >
              {getFieldDecorator(`2d${i + 1}`)(
                <Input addonAfter='%'/>,
              )}
            </Form.Item>
            <Form.Item
              label='三等奖'
              {...tailFormItemLayout}
            >
              {getFieldDecorator(`3d${i + 1}`)(
                <Input addonAfter='%'/>,
              )}

            </Form.Item>
          </Form.Item>
          <Divider/>
        </div>,
      );
    }
    return ele;
  };

  mapPrizeList = () => {
    const { getFieldDecorator } = this.props.form;
    const { prizeQuantity } = this.state;
    let ele = [];
    for (let i = 0; i < prizeQuantity - 0; i++) {
      ele.push(
        <Form.Item
          key={Math.random()}
          label={`${i + 1}号位`}
        >
          {getFieldDecorator(`holder${i + 1}`, {
            ...strConfig,
            initialValue: 'thanks',
          })(
            <Select placeholder="Please select a country" onChange={this.changeQuantity}>
              <Option value="thanks">thanks for enjoy!</Option>
              <Option value="2">2</Option>
              <Option value="3">3</Option>
              <Option value="4">4</Option>
              <Option value="5">5</Option>
            </Select>,
          )}
        </Form.Item>,
      );
    }
    return ele;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { radio } = this.state;
    const tailFormItemLayout = {
      labelCol: {
        sm: { span: 24 },
        md: { span: 4 },
      },
      wrapperCol: {
        sm: { span: 24 },
        md: { span: 16 },
      },
    };
    return (
      <Form {...formItemLayout}>
        <Divider orientation="left">概率设置</Divider>
        <Row>
          <Col span={6}>
            <img src={require('@/assets/yay.jpg')} alt="" style={{ width: '100%' }}/>
          </Col>
          <Col span={18}>
            {this.mapPrizeList()}
          </Col>
        </Row>
        <Divider/>
        <Form.Item
          label='活动类型'
        >
          {getFieldDecorator('recording', {
            initialValue: this.state.radio,
          })(
            <RadioGroup onChange={this.onChange}>
              <Radio value={1}>关联机型</Radio>
              <Radio value={2}>正常活动</Radio>
            </RadioGroup>,
          )}
        </Form.Item>
        {radio === 1 ?
          <div>
            <Button type='primary' onClick={this.addPhone} style={{ margin: '20px 10px' }}>添加机型</Button>
            {this.mapPhone()}
          </div>
          :
          <>
            <Form.Item
              label='每人每天可以抽奖次数'
              {...tailFormItemLayout}
            >
              {getFieldDecorator('personDayCount')(
                <Input/>,
              )}
              若不限制可填写一个非常大的数：999999 (填写此数字前台不会显示抽奖次数)
            </Form.Item>
            <Form.Item
              label='每人总共可以抽奖次数'
              {...tailFormItemLayout}
            >
              {getFieldDecorator('personDayCountTotal')(
                <Input/>,
              )}
              若不限制可填写一个非常大的数：999999 (填写此数字前台不会显示抽奖次数)
            </Form.Item>
            <Form.Item
              label='每天限制最多中奖人数'
              {...tailFormItemLayout}
            >
              {getFieldDecorator('canProCount')(
                <Input/>,
              )}
              若不限制可填写一个非常大的数：999999，达到后所有用户仍可正常抽奖，但不会新中任何奖
            </Form.Item>
            <Form.Item
              label='每人每天可以中奖次数'
              {...tailFormItemLayout}
            >
              {getFieldDecorator('personCanDayCount')(
                <Input/>,
              )}
              0为不可重复中奖；达到此限制后当天不会再中
            </Form.Item>
            <Form.Item
              label='每人总共可以中奖次数'
              {...tailFormItemLayout}
            >
              {getFieldDecorator('personCanCountTotal')(
                <Input/>,
              )}
              0为不可重复中奖；达到此限制后不会再中
            </Form.Item>
            <Form.Item
              label='第几次才会中奖'
              {...tailFormItemLayout}
            >
              {getFieldDecorator('howCountCanPro')(
                <Input/>,
              )}
              0为按照正常概率分配。比如填写3即为前两次不中，第3次才会中（确保百分百中奖，否则第3次仍有可能不中）
            </Form.Item>
          </>
        }
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Button type='primary' htmlType='submit' style={{ marginRight: 10 }}>保存</Button>
          <Button type='danger' htmlType='reset'>重置</Button>
        </div>
      </Form>
    );
  }
}

export default PossibilitySetting;
