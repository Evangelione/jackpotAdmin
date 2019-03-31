import React, { Component } from 'react';
import { Button, Form, Select } from 'antd';
import SingleForm from './SingleItem';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';

const { Option } = Select;

@connect(({ bigWheel }) => ({
  bigWheel,
}))
@Form.create()
class PrizeSetting extends Component {
  state = {
    prizeQuantity: '1',
  };

  componentDidMount() {
    this.setState({
      prizeQuantity: this.props.detail.length === 0 ? '1' : this.props.detail.length + '',
    });
  }

  mapFormItem = () => {
    const { prizeQuantity } = this.state;
    let ele = [];
    for (let i = 0; i < prizeQuantity - 0; i++) {
      ele.push(
        <SingleForm key={i + Date.now()} item={this.props.detail[i]} index={i} id={this.props.location.query.id}
                    wrappedComponentRef={(form) => this[`form${i + 1}`] = form}/>,
      );
    }
    if (prizeQuantity - 0 === 0) {
      ele.push(
        <SingleForm wrappedComponentRef={(form) => this.form1 = form}/>,
      );
    }
    return ele;
  };

  changeQuantity = (value) => {
    this.setState({
      prizeQuantity: value,
    });
  };

  prizeSubmit = () => {
    const { prizeQuantity } = this.state;
    let result = [];
    for (let i = 0; i < prizeQuantity - 0; i++) {
      result.push(this[`form${i + 1}`].getFields());
    }
    !result.includes(null) && this.props.dispatch({
      type: 'bigWheel/upDatePrizeList',
      payload: {
        json: result,
      },
    }).then(() => {
      this.props.dispatch({
        type: 'bigWheel/fetchActivityDetail',
        payload: {
          id: this.props.id,
        },
      });

    });
  };

  render() {
    return (
      <div>
        <span style={{ margin: '20px 10px 20px 70px', fontSize: 16, color: 'rgba(0, 0, 0, 0.85)' }}>奖项个数：</span>
        <Select placeholder="Please select a country" value={this.state.prizeQuantity} onChange={this.changeQuantity}
                style={{ width: 200 }}>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
          <Option value="3">3</Option>
          <Option value="4">4</Option>
          <Option value="5">5</Option>
        </Select>
        {this.mapFormItem()}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Button type='primary' htmlType='submit' style={{ marginRight: 10 }} onClick={this.prizeSubmit}>保存</Button>
        </div>
      </div>
    );
  }
}

export default withRouter(PrizeSetting);
