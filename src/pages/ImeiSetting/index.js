import React, { Component } from 'react';
import { Table, Button, Input, Pagination } from 'antd';
import { connect } from 'dva';

const dataSource = [{
  key: '1',
  name: '胡彦斌',
  age: 32,
  address: '西湖区湖底公园1号',
}, {
  key: '2',
  name: '胡彦祖',
  age: 42,
  address: '西湖区湖底公园1号',
}];

const columns = [{
  title: '标题',
  dataIndex: 'title',
  key: 'title',
}, {
  title: '数据条数',
  dataIndex: 'dataCount',
  key: 'dataCount',
}, {
  title: '时间',
  dataIndex: 'time',
  key: 'time',
}, {
  title: '操作',
  render: () => {
    return <Button type='danger'>删除</Button>;
  },
}];

@connect(({ bigWheel }) => ({
  bigWheel,
}))
class Index extends Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'bigWheel/fetchImei',
    });
  }

  render() {
    const {  imeiPage, imeiTotal } = this.props.bigWheel;
    return (
      <div>
        <div style={{ marginBottom: 20 }}>
          IMEI导入：<Input style={{ width: '40%', marginRight: 10 }}/><Button type='primary'>导入</Button>
        </div>
        <p>1、如果Excel文件太过庞大可分批次导入，系统会累加</p>
        <p>2、全局IMEI码支持多场活动，若活动需要使用全局IMEI码，则关闭活动设置-奖品及概率设置中的IMEI设置即可</p>
        <Table dataSource={dataSource} columns={columns} pagination={false}/>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Pagination current={imeiPage} total={imeiTotal}/>
        </div>
      </div>
    );
  }
}

export default Index;
