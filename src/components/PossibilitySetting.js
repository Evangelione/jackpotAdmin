import React, { Component } from 'react';
import { Form, Input, Radio, Button } from 'antd';
import { formItemLayout } from '@/common/constant';
import SingleModel from './SingleModel';
import { connect } from 'dva';

const RadioGroup = Radio.Group;

@connect(({ bigWheel }) => ({
  bigWheel,
}))
@Form.create()
class PossibilitySetting extends Component {
  state = {
    radio: 1,
    phoneQuantity: '1',
  };

  componentDidMount() {
    // this.setState({
    //   prizeQuantity: this.props.detail.length === 0 ? '1' : this.props.detail.length + '',
    // });
  }

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
    const { phoneQuantity } = this.state;
    let ele = [];
    for (let i = 0; i < phoneQuantity - 0; i++) {
      ele.push(
        <SingleModel key={i + Date.now()} i={i} wrappedComponentRef={(form) => this[`form${i + 1}`] = form}/>,
      );
    }
    return ele;
  };

  proSubmit = () => {
    const { phoneQuantity } = this.state;
    let result = [];
    debugger
    for (let i = 0; i < phoneQuantity - 0; i++) {
      result.push(this[`form${i + 1}`].getFields());
    }
    !result.includes(null) && this.props.dispatch({
      type: 'bigWheel/upDateProbability',
      payload: {
        form: result,
      },
    }).then(() => {
      this.props.dispatch({
        type: 'bigWheel/fetchActivityDetail',
        payload: {
          id: this.props.id,
        },
      });
    });
    console.log(result);
  };

  // mapPrizeList = () => {
  //   const { getFieldDecorator } = this.props.form;
  //   const { prizeQuantity } = this.state;
  //   let ele = [];
  //   for (let i = 0; i < prizeQuantity - 0; i++) {
  //     ele.push(
  //       <Form.Item
  //         key={Math.random()}
  //         label={`${i + 1}号位`}
  //       >
  //         {getFieldDecorator(`holder${i + 1}`, {
  //           ...strConfig,
  //           initialValue: 'thanks',
  //         })(
  //           <Select placeholder="Please select a country" onChange={this.changeQuantity}>
  //             <Option value="thanks">thanks for enjoy!</Option>
  //             <Option value="2">2</Option>
  //             <Option value="3">3</Option>
  //             <Option value="4">4</Option>
  //             <Option value="5">5</Option>
  //           </Select>,
  //         )}
  //       </Form.Item>,
  //     );
  //   }
  //   return ele;
  // };

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
      <div>
        {/*<Divider orientation="left">概率设置</Divider>*/}
        {/*<Row>*/}
        {/*<Col span={6}>*/}
        {/*<img src={require('@/assets/yay.jpg')} alt="" style={{ width: '100%' }}/>*/}
        {/*</Col>*/}
        {/*<Col span={18}>*/}
        {/*{this.mapPrizeList()}*/}
        {/*</Col>*/}
        {/*</Row>*/}
        {/*<Divider/>*/}
        <div style={{ margin: '20px 10px' }}>
          <span>活动类型：</span>
          <RadioGroup defaultValue={1} onChange={this.onChange}>
            <Radio value={1}>关联机型</Radio>
            <Radio value={2}>正常活动</Radio>
          </RadioGroup>,
        </div>
        {radio === 1 ?
          <div>
            <Button type='primary' onClick={this.addPhone} style={{ margin: '20px 10px' }}>添加机型</Button>
            {this.mapPhone()}
          </div>
          :
          <Form {...formItemLayout} style={{ marginTop: 30 }}>
            <Form.Item
              label='每人总共可以抽奖次数'
              {...tailFormItemLayout}
            >
              {getFieldDecorator('luckyTimes')(
                <Input/>,
              )}
              这个数字会在抽奖页面上显示
            </Form.Item>
          </Form>
        }
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Button type='primary' htmlType='submit' style={{ marginRight: 10 }} onClick={this.proSubmit}>保存</Button>
          <Button type='danger' htmlType='reset'>重置</Button>
        </div>
      </div>
    );
  }
}

export default PossibilitySetting;
