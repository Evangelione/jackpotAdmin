import React, { Component } from 'react';
import { Button, Form, Input, Radio, message } from 'antd';
import { formItemLayout } from '@/common/constant';
import SingleModel from './SingleModel';
import { connect } from 'dva';
import withRouter from 'umi/withRouter';
import { formatMessage } from 'umi-plugin-react/locale/index';

const RadioGroup = Radio.Group;

@connect(({ bigWheel }) => ({
  bigWheel,
}))
@Form.create()
class PossibilitySetting extends Component {
  state = {
    radio: 0,
    phoneQuantity: '1',
    detail: [],
  };

  componentWillMount() {
    this.props.dispatch({
      type: 'bigWheel/fetchPrizeList',
      payload: {
        id: this.props.id,
      },
    });
    this.props.dispatch({
      type: 'bigWheel/fetchPhoneModal',
      payload: {},
    });
    if (this.props.detail.type === 1) {
      this.setState({
        radio: this.props.detail.type,
      }, () => {
        this.props.form.setFieldsValue({
          luckyTimes: this.props.detail.luckyTimes,
        });
      });
    } else {
      let detail = this.serialization(this.props.detail.setup);
      this.setState({
        detail,
        phoneQuantity: detail.length + '',
        radio: this.props.detail.type,
      });
    }

  }

  onChange = (e) => {
    this.setState({
      radio: e.target.value,
    });
  };

  addPhone = () => {
    this.setState({
      phoneQuantity: (this.state.phoneQuantity - 0) + 1 + '',
    });
  };

  deletePhone = () => {
    if (this.state.phoneQuantity === '1') {
      return false;
    }
    this.setState({
      phoneQuantity: (this.state.phoneQuantity - 0) - 1 + '',
    });
  };

  serialization = (arr) => {
    if (!arr) return [];
    let result = [];
    arr.forEach((value, index) => {
      if (!result.length) {
        result.push([value]);
        return false;
      }
      if (result.some((v, i) => {
          if (value.name === result[i][0].name) {
            result[i].push(value);
            return true;
          } else {
            return false;
          }
        })) {
      } else {
        result.push([value]);

      }
      // if (result[result.length - 1][0].name === value.name) {
      //   result[result.length - 1].push(value);
      // } else {
      //   result.push([value]);
      // }
    });
    return result;
  };

  mapPhone = () => {
    const { phoneQuantity } = this.state;
    let ele = [];
    for (let i = 0; i < phoneQuantity - 0; i++) {
      ele.push(
        <SingleModel key={i + Date.now()} item={this.state.detail[i]} i={i} prizeList={this.props.bigWheel.prizeList}
                     phoneModalList={this.props.bigWheel.phoneModalList} id={this.props.location.query.id}
                     wrappedComponentRef={(form) => this[`form${i + 1}`] = form}/>,
      );
    }
    return ele;
  };

  proSubmit = () => {
    if (this.state.radio === 0) {
      const { phoneQuantity } = this.state;
      let result = [];
      for (let i = 0; i < phoneQuantity - 0; i++) {
        let item = this[`form${i + 1}`].getFields();
        if (!item) {
          message.error(formatMessage({ id: 'complete.information' }));
          return false;
        }
        if (result.length && item[0].name === result[result.length - 1].name) {
          message.error('不能选择相同机型');
          return false;
        }
        result.push(...item);
      }
      !result.includes(null) && this.props.dispatch({
        type: 'bigWheel/upDateProbability',
        payload: {
          json: result,
        },
      }).then(() => {
        this.props.dispatch({
          type: 'bigWheel/fetchActivityDetail',
          payload: {
            id: this.props.id,
          },
        }).then(() => {
          let detail = this.serialization(this.props.detail.setup);
          this.setState({
            detail,
            phoneQuantity: detail.length + '',
          });
        });

      });
    } else {
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.props.dispatch({
            type: 'bigWheel/upDateProbabilityNormal',
            payload: {
              id: this.props.id,
              count: values.luckyTimes,
            },
          }).then(() => {
            this.props.dispatch({
              type: 'bigWheel/fetchActivityDetail',
              payload: {
                id: this.props.id,
              },
            });
          });
        }
      });
    }
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
          <RadioGroup value={this.state.radio} onChange={this.onChange}>
            <Radio value={0}>关联机型</Radio>
            <Radio value={1}>正常活动</Radio>
          </RadioGroup>,
        </div>
        {radio === 0 ?
          <div>
            <Button type='primary' onClick={this.addPhone} style={{ margin: '20px 10px' }}>添加机型</Button>
            <Button type='primary' onClick={this.deletePhone} style={{ margin: '20px 10px' }}>删除机型</Button>
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
        </div>
      </div>
    );
  }
}

export default withRouter(PossibilitySetting);
