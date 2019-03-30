import React, { Component } from 'react';
import { Table, Button, Input, Pagination } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';


@connect(({ bigWheel }) => ({
  bigWheel,
}))
class Index extends Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'bigWheel/fetchImei',
      payload: {},
    });
  }

  columns = [{
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
    render: (text, record) => {
      return <Button type='danger' onClick={this.delete.bind(null, record.id)}>删除</Button>;
    },
  }];

  delete = (id) => {
    this.props.dispatch({
      type: 'global/deleteGlobalImei',
      payload: {
        id,
      },
    }).then(() => {
      this.props.dispatch({
        type: 'bigWheel/fetchImei',
        payload: {},
      });
    });
  };

  pageChange = (page) => {
    this.props.dispatch({
      type: 'bigWheel/fetchImei',
      payload: {
        page,
      },
    });
  };

  render() {
    const { imeiList, imeiPage, imeiTotal } = this.props.bigWheel;
    return (
      <div>
        <div style={{ marginBottom: 20 }}>
          {formatMessage({ id: 'imei.import.title' })}：<Input style={{ width: '40%', marginRight: 10 }}/>
          <Button type='primary'>{formatMessage({ id: 'imei.import.btn' })}</Button>
        </div>
        <p>{formatMessage({ id: 'imei.import.desc' })}</p>
        <Table dataSource={imeiList} columns={this.columns} rowKey='id' pagination={false}/>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Pagination current={imeiPage} total={imeiTotal} onChange={this.pageChange}/>
        </div>
      </div>
    );
  }
}

export default Index;
