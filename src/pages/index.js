import React, { Component } from 'react';
import { Table, Button, Pagination, Modal } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import router from 'umi/router';
import { connect } from 'dva';
import QRCode from 'qrcode.react';

const confirm = Modal.confirm;

@connect(({ bigWheel }) => ({
  bigWheel,
}))
class Index extends Component {
  columns = [{
    title: <FormattedMessage id="bigWheel.list.table.title"/>,
    dataIndex: 'title',
    key: 'title',
  }, {
    title: <FormattedMessage id="bigWheel.list.table.activeLink"/>,
    render: (text, record) => {
      return `${this.props.bigWheel.activityUrl}/?activityId=${record.id}`;
    },
  }, {
    title: <FormattedMessage id="bigWheel.list.table.QRCode"/>,
    dataIndex: 'address',
    key: 'address',
    render: (text, record) => {
      return <QRCode value={`${this.props.bigWheel.activityUrl}?activityId=${record.id}`}/>;
    },
  }, {
    title: <FormattedMessage id="bigWheel.list.table.activeDate"/>,
    render: (text, record) => {
      let start = record.createtime.substr(0, 10);
      let end = record.endtime.substr(0, 10);
      return `${start} - ${end}`;
    },
  }, {
    title: <FormattedMessage id="bigWheel.list.table.redeemLink"/>,
    render: (text, record) => {
      return `${this.props.bigWheel.activityUrl}/cash?activityId=${record.id}`;
    },
  }, {
    title: <FormattedMessage id="bigWheel.list.table.redeemQRCode"/>,
    dataIndex: 'address4',
    key: 'address4',
    render: (text, record) => {
      return <QRCode value={`${this.props.bigWheel.activityUrl}/cash?activityId=${record.id}`}/>;
    },
  }, {
    title: <FormattedMessage id="bigWheel.list.table.activeData"/>,
    render: (text, record) => {
      return <Button type='primary' onClick={this.goActivityData.bind(null, record.id)}>
        <FormattedMessage id="bigWheel.list.table.viewDetail"/>
      </Button>;
    },
  }, {
    title: <FormattedMessage id="bigWheel.list.table.operating"/>,
    render: (text, record) => {
      return <>
        <Button type='primary' style={{ marginBottom: 5 }} onClick={this.goDetail.bind(null, record.id)}>
          <FormattedMessage id="bigWheel.list.table.setting"/>
        </Button>
        <br/>
        <Button type='danger' onClick={this.danger.bind(null, record.id)}>
          <FormattedMessage id="bigWheel.list.table.delete"/>
        </Button>
      </>;
    },
  }];

  componentDidMount() {
    this.props.dispatch({
      type: 'bigWheel/fetchBigWheelList',
      payload: {
        category: 1,
      },
    });
  }

  danger = (id) => {
    confirm({
      title: formatMessage({ id: 'modal.delete.title' }),
      content: formatMessage({ id: 'modal.delete.confirm' }),
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
              category: 1,
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
        category: 1,
        id,
      },
    });
  };

  createActivity = () => {
    this.props.dispatch({
      type: 'bigWheel/addActivity',
      payload: {
        category: 1,
      },
    }).then(() => {
      this.props.dispatch({
        type: 'bigWheel/fetchBigWheelList',
        payload: {
          category: 1,
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
          <Button type='primary' size='large' onClick={this.createActivity}>
            <FormattedMessage id="bigWheel.list.createActive"/>
          </Button>
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
