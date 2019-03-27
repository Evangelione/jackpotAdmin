import React, { Component } from 'react';
import { Table, Button, Pagination, Input, Select } from 'antd';
import { connect } from 'dva';

const Option = Select.Option;

const columns = [{
  title: 'IMEI',
  dataIndex: 'imei',
  key: 'imei',
}, {
  title: '手机号',
  dataIndex: 'phone',
  key: 'phone',
}, {
  title: '姓名',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '地址',
  dataIndex: 'address',
  key: 'address',
}, {
  title: '奖项',
  dataIndex: 'ad',
  key: 'ad',
}, {
  title: '奖品',
  dataIndex: 'prizeId',
  key: 'prizeId',
}, {
  title: '中奖时间',
  dataIndex: 'updatetime',
  key: 'updatetime',
}, {
  title: '兑奖码',
  dataIndex: 'awardCode',
  key: 'awardCode',
}, {
  title: '短信验证',
  dataIndex: 'verify',
  key: 'verify',
}, {
  title: '兑奖',
  render: (text, record) => {
    return <Button type='primary'>Redeem</Button>;
  },
}, {
  title: '操作',
  render: (text, record) => {
    return <Button type='danger'>删除</Button>;
  },
}];

@connect(({ bigWheel }) => ({
  bigWheel,
}))
class ActivityData extends Component {

  componentDidMount() {
    const { category } = this.props.location.query;
    this.props.dispatch({
      type: 'bigWheel/fetchActivityData',
      payload: {
        category: category,
      },
    });
  }

  exportImei = () => {
    // window.location.href = `${api}/admin/imei/export`
  };

  render() {
    const { activityDataList, activityDataPage, activityDataTotal } = this.props.bigWheel;
    return (
      <div>
        <div style={{ marginBottom: 20 }}>
          IMEI码：<Input style={{ width: 160, marginRight: 20 }}/>
          手机号：<Input style={{ width: 160, marginRight: 20 }}/>
          姓名：<Input style={{ width: 160, marginRight: 20 }}/>
          奖项：<Select defaultValue="lucy" style={{ width: 160 }}>
          <Option value="jack">Jack</Option>
          <Option value="lucy">Lucy</Option>
          <Option value="disabled" disabled>Disabled</Option>
          <Option value="Yiminghe">yiminghe</Option>
        </Select>
          <div style={{ float: 'right' }}>
            <Button type='primary' style={{ marginRight: 10 }}>搜索</Button>
            <Button onClick={this.exportImei}>导出</Button>
          </div>
        </div>
        <Table dataSource={activityDataList} rowKey='id' columns={columns} pagination={false}/>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Pagination current={activityDataPage} total={activityDataTotal}/>
        </div>

      </div>
    );
  }
}

export default ActivityData;
