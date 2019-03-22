import React, { Component } from 'react';
import { Table, Button } from 'antd';
import router from 'umi/router';

class Index extends Component {
  state = {
    dataSource: [{
      key: '1',
      name: '抽奖测试活动',
      age: 'https://www.baidu.com/id=0098423',
      address: '西湖区湖底公园1号',
      address2: '西湖区湖底公园1号',
      address3: 'https://www.baidu.com/id=0098423',
      address4: '西湖区湖底公园1号',
      address5: '西湖区湖底公园1号',
      address6: '西湖区湖底公园1号',
    }, {
      key: '2',
      name: '抽奖测试活动',
      age: 'https://www.baidu.com/id=0098423',
      address: '西湖区湖底公园1号',
      address2: '西湖区湖底公园1号',
      address3: 'https://www.baidu.com/id=0098423',
      address4: '西湖区湖底公园1号',
      address5: '西湖区湖底公园1号',
      address6: '西湖区湖底公园1号',
    }],
  };

  columns = [{
    title: '活动标题',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '活动链接',
    dataIndex: 'age',
    key: 'age',
  }, {
    title: '活动二维码',
    dataIndex: 'address',
    key: 'address',
    render: () => {
      return <img style={{ width: 100 }}
                  src='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553164905192&di=fec4251d2bf3c91f8400ebcd3836d703&imgtype=0&src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F01%2F48%2F34%2F7657442144c5df2.jpg'
                  alt=""/>;
    },
  }, {
    title: '活动时间',
    dataIndex: 'address2',
    key: 'address2',
  }, {
    title: '兑奖链接',
    dataIndex: 'address3',
    key: 'address3',
  }, {
    title: '兑奖二维码',
    dataIndex: 'address4',
    key: 'address4',
    render: () => {
      return <img style={{ width: 100 }}
                  src='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553164905192&di=fec4251d2bf3c91f8400ebcd3836d703&imgtype=0&src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F01%2F48%2F34%2F7657442144c5df2.jpg'
                  alt=""/>;
    },
  }, {
    title: '活动数据',
    dataIndex: 'address5',
    key: 'address5',
    render: (text, record) => {
      return <Button type='primary'>查看详情</Button>;
    },
  }, {
    title: '操作',
    dataIndex: 'address6',
    key: 'address6',
    render: (text, record) => {
      return <>
        <Button type='primary' style={{ marginBottom: 5 }} onClick={this.goDetail}>设置</Button>
        <br/>
        <Button type='danger'>删除</Button>
      </>;
    },
  }];
  createActivity = () => {
    const data = {
      key: Math.random(),
      name: '抽奖测试活动',
      age: 'https://www.baidu.com/id=0098423',
      address: '西湖区湖底公园1号',
      address2: '西湖区湖底公园1号',
      address3: 'https://www.baidu.com/id=0098423',
      address4: '西湖区湖底公园1号',
      address5: '西湖区湖底公园1号',
      address6: '西湖区湖底公园1号',
    };
    this.setState({
      dataSource: [...this.state.dataSource, data],
    });
  };

  goDetail = () => {
    router.push('/bigWheelSetting');
  };

  render() {
    const { dataSource } = this.state;
    return (
      <div>
        <div style={{ textAlign: 'right', marginBottom: 20 }}>
          <Button type='primary' size='large' onClick={this.createActivity}>创建活动</Button>
        </div>
        <Table columns={this.columns} dataSource={dataSource}/>
      </div>
    );
  }
}

export default Index;
