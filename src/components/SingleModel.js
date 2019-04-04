import React, { Component } from 'react';
import { Checkbox, Divider, Form, Input, Select } from 'antd';
import { formItemLayout } from '@/common/constant';

const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

const strConfig = {
  rules: [{ required: true, message: 'Please select time!' }],
};

@Form.create()
class SingleModel extends Component {
  state = {
    selectedItems: [],
  };

  componentDidMount() {
    const { item } = this.props;
    if (item) {
      let prizeIdArr = item.map((item, index) => {
        // this.props.form.setFieldsValue({
        //   [item.prizeId + '']: item.probability,
        // });
        // console.log(item.prizeId + '');
        return item.prizeId;
      });
      this.props.form.setFieldsValue({
        name: item[0].name,
        id: item[0].id,
        luckyTimes: item[0].luckyTimes,
        prizeWinner: prizeIdArr,
      });
      setTimeout(() => {
        Object.keys(this.props.form.getFieldsValue()).length && item.map((item, index) => {
          this.props.form.setFieldsValue({
            [item.prizeId + '']: item.probability,
            ['id' + index]: item.id,
          });
          return item.prizeId;
        });
      }, 500);
    }
  }

  handleChange = selectedItems => {
    this.setState({ selectedItems });
  };


  getFields = () => {
    let result = null;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // values.activityId = this.props.id;
        result = values.prizeWinner.map((item, index) => {
          return {
            activityId: this.props.id,
            luckyTimes: values.luckyTimes,
            name: values.name,
            prizeId: item,
            probability: values[item],
            id: values['id' + index] || '',
          };
        });
      }
    });
    return result;
  };

  mapPrizeList = () => {
    return this.props.prizeList.map((value, index) => {
      return {
        label: value.name,
        value: value.id,
      };
    });
  };
  mapPhoneModalList = (filteredOptions) => {
    return filteredOptions.map(((value, index) => {
      return <Option value={value} key={index}>{value}</Option>;
    }));
  };

  mapProbability = () => {
    const { getFieldDecorator } = this.props.form;
    const tailFormItemLayout = {
      labelCol: {
        sm: { span: 24 },
        md: { span: 8 },
      },
      wrapperCol: {
        sm: { span: 24 },
        md: { span: 10 },
      },
    };
    let arr = this.props.form.getFieldValue('prizeWinner');
    return arr && arr.map((item, index) => {
      let name = '';
      this.props.prizeList.forEach((value => {
        if (value.id === item) {
          name = value.name;
        }
      }));
      return <Form.Item
        label={name}
        {...tailFormItemLayout}
        key={index}
      >
        {getFieldDecorator(item + '', {
          ...strConfig,
          initialValue: 0,
        })(
          <Input addonAfter='%'/>,
        )}
      </Form.Item>;
    });
  };

  render() {
    const { selectedItems } = this.state;
    const filteredOptions = this.props.phoneModalList.filter(o => !selectedItems.includes(o));
    const { getFieldDecorator } = this.props.form;
    return (
      <Form {...formItemLayout}>
        <Form.Item
          label={`机型${this.props.i + 1}`}
        >
          {getFieldDecorator(`name`, {
            ...strConfig,
            initialValue: selectedItems,
          })(
            <Select placeholder="Please select a phone modal"
                    onChange={this.handleChange}>
              {this.mapPhoneModalList(filteredOptions)}
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
          })(
            <CheckboxGroup options={this.mapPrizeList()}/>,
          )}
        </Form.Item>
        <Form.Item
          label='中奖概率'
        >
          {this.mapProbability()}
        </Form.Item>
        <Form.Item
          label='id0'
          style={{display: 'none'}}
        >
          {getFieldDecorator(`id0`)(
            <Input disabled={true}/>,
          )}
        </Form.Item>
        <Form.Item
          label='id1'
          style={{display: 'none'}}
        >
          {getFieldDecorator(`id1`)(
            <Input disabled={true}/>,
          )}
        </Form.Item>
        <Form.Item
          label='id2'
          style={{display: 'none'}}
        >
          {getFieldDecorator(`id2`)(
            <Input disabled={true}/>,
          )}
        </Form.Item>
        <Divider/>
      </Form>
    );
  }
}

export default SingleModel;
