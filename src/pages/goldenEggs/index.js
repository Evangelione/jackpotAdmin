import React, { Component } from 'react';
import { Table, Button, Pagination, Modal } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';

const confirm = Modal.confirm;

@connect(({ bigWheel }) => ({
  bigWheel,
}))
class Index extends Component {
  columns = [{
    title: '活动标题',
    dataIndex: 'title',
    key: 'title',
    render: (text, record) => {
      return text || '暂未设置';
    },
  }, {
    title: '活动链接',
    render: (text, record) => {
      return `http://lottery.morefun.co.in/?activityId=${record.id}`;
    },
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
    render: (text, record) => {
      let start = record.createtime.substr(0, 10);
      let end = record.endtime.substr(0, 10);
      return `${start} - ${end}`;
    },
  }, {
    title: '兑奖链接',
    render: (text, record) => {
      return `http://lottery.morefun.co.in/cash?activityId=${record.id}`;
    },
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
    render: (text, record) => {
      return <Button type='primary' onClick={this.goActivityData.bind(null, record.id)}>查看详情</Button>;
    },
  }, {
    title: '操作',
    render: (text, record) => {
      return <>
        <Button type='primary' style={{ marginBottom: 5 }} onClick={this.goDetail.bind(null, record.id)}>设置</Button>
        <br/>
        <Button type='danger' onClick={this.danger.bind(null, record.id)}>删除</Button>
      </>;
    },
  }];

  componentDidMount() {
    this.props.dispatch({
      type: 'bigWheel/fetchBigWheelList',
      payload: {
        category: 3,
      },
    });
  }

  danger = (id) => {
    confirm({
      title: '删除本条记录？',
      content: '删除后数据无法恢复，确认要删除吗？',
      onOk: () => {
        this.props.dispatch({
          type: 'bigWheel/deleteActivityData',
          payload: {
            id,
          },
        }).then(() => {
          this.props.dispatch({
            type: 'bigWheel/fetchBigWheelList',
            payload: {
              category: 3,
            },
          });
        });
      },
    });
  };

  goActivityData = (id) => {
    router.push({
      pathname: '/activityData',
      query: {
        category: 3,
        id,
      },
    });
  };


  createActivity = () => {
    this.props.dispatch({
      type: 'bigWheel/addActivity',
      payload: {
        category: 3,
      },
    }).then(() => {
      this.props.dispatch({
        type: 'bigWheel/fetchBigWheelList',
        payload: {
          category: 3,
        },
      });
    });
  };

  goDetail = (id) => {
    router.push({ pathname: '/bigWheelSetting', query: { id } });
  };

  bigWheelPageChange = (page) => {
    this.props.dispatch({
      type: 'bigWheel/fetchBigWheelList',
      payload: {
        page,
        category: 3,
      },
    });
  };

  render() {
    const { bigWheelList, bigWheelPage, bigWheelTotal } = this.props.bigWheel;
    return (
      <div>
        <div style={{ textAlign: 'right', marginBottom: 20 }}>
          <Button type='primary' size='large' onClick={this.createActivity}>创建活动</Button>
        </div>
        <Table columns={this.columns} dataSource={bigWheelList} rowKey='id' pagination={false}/>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Pagination current={bigWheelPage} total={bigWheelTotal} onChange={this.bigWheelPageChange}/>
        </div>
      </div>
    );
  }
}

export default Index;
