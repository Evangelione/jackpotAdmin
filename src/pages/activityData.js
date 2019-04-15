import React, { Component } from 'react';
import { Table, Button, Pagination, Input, Select, Modal, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { api } from '@/common/constant';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

const Option = Select.Option;
const confirm = Modal.confirm;

@connect(({ bigWheel }) => ({
  bigWheel,
}))
class ActivityData extends Component {
  state = {
    imei: '',
    phone: '',
    name: '',
    prize: '',
    visible: false,
    codeHolder: 'Get Code',
    postBeforeStr: '+91',
    postPhone: '',
    postCode: '',
    postId: '',
  };
  timer = null;
  sec = 60;
  columns = [{
    title: <FormattedMessage id="activity.data.table.imei"/>,
    dataIndex: 'imei',
    key: 'imei',
  }, {
    title: <FormattedMessage id="activity.data.table.phone"/>,
    dataIndex: 'phone',
    key: 'phone',
  }, {
    title: <FormattedMessage id="activity.data.table.name"/>,
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => {
      return text || '暂无';
    },
  }, {
    title: <FormattedMessage id="activity.data.table.address"/>,
    dataIndex: 'address',
    key: 'address',
  }, {
    title: <FormattedMessage id="activity.data.table.pin"/>,
    dataIndex: 'pinCode',
    key: 'pinCode',
  }, {
    title: <FormattedMessage id="activity.data.table.award"/>,
    render: (text, record) => {
      return record.prize.title;
    },
  }, {
    title: <FormattedMessage id="activity.data.table.prize"/>,
    dataIndex: 'prize',
    key: 'prizeId',
    render: (text, record) => {
      return record.prize.name;
    },
  }, {
    title: <FormattedMessage id="activity.data.table.winningTime"/>,
    dataIndex: 'createtime',
    key: 'createtime',
    render: (text, record) => {
      return moment(text).format('YYYY-MM-DD HH:mm:ss');
    },
  }, {
    title: <FormattedMessage id="activity.data.table.redeemCode"/>,
    dataIndex: 'awardCode',
    key: 'awardCode',
  }, {
    title: <FormattedMessage id="activity.data.table.SMS"/>,
    dataIndex: 'verify',
    key: 'verify',
    render: (text) => {
      return text ? formatMessage({ id: 'activity.data.table.true' }) : formatMessage({ id: 'activity.data.table.false' });
    },
  }, {
    title: <FormattedMessage id="activity.data.table.Redeem"/>,
    render: (text, record) => {
      if (record.status) {
        return <Button type='primary'
                       onClick={this.cancelRedeem.bind(null, record.id)}>
          {formatMessage({ id: 'redeem.cancelRedeem' })}
        </Button>;
      } else {
        return <Button type='primary'
                       onClick={this.showModal.bind(null, record.verify, record.id)}>
          {formatMessage({ id: 'activity.data.table.Redeem' })}
        </Button>;
      }
    },
  }, {
    title: <FormattedMessage id="activity.data.table.operation"/>,
    render: (text, record) => {
      return <Button type='danger' onClick={this.danger.bind(null, record.id)}>
        {formatMessage({ id: 'activity.data.table.delete' })}
      </Button>;
    },
  }];

  componentDidMount() {
    const { id } = this.props.location.query;
    this.props.dispatch({
      type: 'bigWheel/fetchActivityData',
      payload: {
        id,
      },
    });
    this.props.dispatch({
      type: 'bigWheel/fetchPrizeList',
      payload: {
        id,
      },
    });
  }

  cancelRedeem = (id) => {
    confirm({
      title: formatMessage({ id: 'activity.data.table.cancelRedeem' }),
      content: formatMessage({ id: 'redeem.cancelContent' }),
      okText: formatMessage({ id: 'redeem.ok' }),
      cancelText: formatMessage({ id: 'redeem.no' }),
      onOk: () => {
        this.props.dispatch({
          type: 'bigWheel/cancelRedeem',
          payload: {
            id,
          },
        }).then(() => {
          const { id } = this.props.location.query;
          this.props.dispatch({
            type: 'bigWheel/fetchActivityData',
            payload: {
              id,
              page: this.props.bigWheel.activityDataPage,
            },
          });
        });
      },
    });
  };

  danger = (id) => {
    confirm({
      title: formatMessage({ id: 'modal.delete.title' }),
      content: formatMessage({ id: 'modal.delete.confirm' }),
      okText: formatMessage({ id: 'redeem.ok' }),
      cancelText: formatMessage({ id: 'redeem.no' }),
      onOk: () => {
        this.props.dispatch({
          type: 'bigWheel/deleteDanger',
          payload: {
            id,
          },
        }).then(() => {
          const { id } = this.props.location.query;
          this.props.dispatch({
            type: 'bigWheel/fetchActivityData',
            payload: {
              id,
              page: this.props.bigWheel.activityDataPage,
            },
          });
        });
      },
    });
  };

  mapPrizeList = () => {
    return this.props.bigWheel.prizeList.map((value, index) => {
      return <Option value={value.id} key={index}>{value.name}</Option>;
    });
  };

  exportImei = () => {
    const { id } = this.props.location.query;
    window.location.href = `${api}/admin/activity/user/export?activityId=${id}`;
  };

  exportTotal = () => {
    const { id } = this.props.location.query;
    window.location.href = `${api}/admin/activity/user/exportAll?activityId=${id}`;
  };

  changeField = (field, e) => {
    this.setState({
      [field]: e.target.value,
    });
  };

  selectPrize = (value) => {
    this.setState({
      prize: value,
    });
  };

  searchDetailList = () => {
    const { id } = this.props.location.query;
    const { imei, phone, name, prize } = this.state;
    this.props.dispatch({
      type: 'bigWheel/fetchActivityData',
      payload: {
        id,
        imei,
        phone,
        name,
        prize,
      },
    });
  };
  showModal = (verify, id) => {
    if (verify) {
      this.setState({
        visible: true,
        postId: id,
      });
    } else {
      confirm({
        title: formatMessage({ id: 'redeem.title' }),
        content: formatMessage({ id: 'redeem.delete' }),
        okText: formatMessage({ id: 'redeem.ok' }),
        cancelText: formatMessage({ id: 'redeem.no' }),
        onOk: () => {
          this.props.dispatch({
            type: 'bigWheel/lotteryRedeem',
            payload: {
              id,
            },
          }).then(() => {
            const { id } = this.props.location.query;
            this.props.dispatch({
              type: 'bigWheel/fetchActivityData',
              payload: {
                id,
                page: this.props.bigWheel.activityDataPage,
              },
            });
          });
        },
      });
    }

  };

  handleOk = (e) => {
    console.log(e);
    const { postPhone, postCode } = this.state;
    if (!postPhone || !postCode) {
      message.error(formatMessage({ id: 'complete.information' }));
      return false;
    }
    this.props.dispatch({
      type: 'bigWheel/lotteryRedeem',
      payload: {
        phone: this.state.postBeforeStr.substr(1) + postPhone,
        code: postCode,
        redeemKey: this.props.bigWheel.redeemKey,
        id: this.state.postId,
      },
    }).then(() => {
      this.setState({
        visible: false,
        postId: '',
      });
      this.props.dispatch({
        type: 'bigWheel/save',
        payload: {
          redeemKey: '',
        },
      });
      const { id } = this.props.location.query;
      this.props.dispatch({
        type: 'bigWheel/fetchActivityData',
        payload: {
          id,
        },
      });
    });

  };

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  changePhone = (e) => {
    this.setState({
      postPhone: e.target.value,
    });
  };
  changeCode = (e) => {
    this.setState({
      postCode: e.target.value,
    });
  };

  changeBeforeStr = (value) => {
    this.setState({
      postBeforeStr: value,
    });
  };

  pageChange = (page) => {
    const { id } = this.props.location.query;
    const { imei, phone, name, prize } = this.state;
    this.props.dispatch({
      type: 'bigWheel/fetchActivityData',
      payload: {
        id,
        page,
        imei,
        phone,
        name,
        prize,
      },
    });
  };

  getCode = () => {
    if (!this.state.postPhone) {
      message.error(formatMessage({ id: 'enter.phone' }));
      return false;
    }
    if (this.state.codeHolder !== 'Get Code') return false;
    this.setState({
      codeHolder: `${this.sec}s`,
    });
    this.timer = setInterval(() => {
      this.sec -= 1;
      this.setState({
        codeHolder: `${this.sec}s`,
      });
      if (this.sec < 0) {
        clearInterval(this.timer);
        this.timer = null;
        this.sec = 60;
        this.setState({
          codeHolder: 'Get Code',
        });
      }
    }, 1000);
    this.props.dispatch({
      type: 'bigWheel/getCode',
      payload: {
        phone: this.state.postBeforeStr.substr(1) + this.state.postPhone,
        type: 'redeem',
      },
    });
  };


  render() {
    const { activityDataList, activityDataPage, activityDataTotal } = this.props.bigWheel;
    const { imei, phone, name, prize } = this.state;
    const selectBefore = (
      <Select value={this.state.postBeforeStr} style={{ width: 72 }} onChange={this.changeBeforeStr}>
        <Option value="+91">+91</Option>
        <Option value="+977">+977</Option>
        <Option value="+86">+86</Option>
        <Option value="+81">+81</Option>
        <Option value="+82">+82</Option>
        <Option value="+84">+84</Option>
        <Option value="+850">+850</Option>
        <Option value="+852">+852</Option>
        <Option value="+853">+853</Option>
        <Option value="+855">+855</Option>
        <Option value="+856">+856</Option>
        <Option value="+880">+880</Option>
        <Option value="+886">+886</Option>
      </Select>
    );
    return (
      <div>
        <div style={{ marginBottom: 20 }}>
          {formatMessage({ id: 'activity.data.table.imei' })}：<Input style={{ width: 160, marginRight: 20 }}
                                                                     value={imei}
                                                                     onChange={this.changeField.bind(null, 'imei')}/>
          {formatMessage({ id: 'activity.data.table.phone' })}：<Input style={{ width: 160, marginRight: 20 }}
                                                                      value={phone}
                                                                      onChange={this.changeField.bind(null, 'phone')}/>
          {formatMessage({ id: 'activity.data.table.name' })}：<Input style={{ width: 160, marginRight: 20 }}
                                                                     value={name}
                                                                     onChange={this.changeField.bind(null, 'name')}/>
          {formatMessage({ id: 'activity.data.table.award' })}：<Select style={{ width: 160 }} value={prize}
                                                                       onChange={this.selectPrize}>
          {this.mapPrizeList()}
        </Select>
          <div style={{ float: 'right' }}>
            <Button type='primary' style={{ marginRight: 10 }} onClick={this.searchDetailList}>
              {formatMessage({ id: 'btn.search' })}
            </Button>
            <Button style={{ marginRight: 10 }} onClick={this.exportImei}>
              {formatMessage({ id: 'btn.export' })}
            </Button>
            <Button onClick={this.exportTotal}>
              {formatMessage({ id: 'btn.exportTotal' })}
            </Button>
          </div>
        </div>
        <Table dataSource={activityDataList} rowKey='id' columns={this.columns} pagination={false}/>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Pagination current={activityDataPage} total={activityDataTotal} onChange={this.pageChange}/>
        </div>
        <Modal
          title={formatMessage({ id: 'activity.data.table.Redeem' })}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          destroyOnClose={true}
        >
          <div style={{ padding: '10px 50px' }}>
            <Input addonBefore={selectBefore} style={{ marginBottom: 20 }}
                   placeholder='please enter your phone number' value={this.state.postPhone}
                   onChange={this.changePhone}/>
            <div style={{ position: 'relative' }}>
              <Input addonBefore={<div style={{ width: 50, textAlign: 'left' }}>Code</div>}
                     style={{ marginBottom: 20, width: '70%' }}
                     placeholder='please verification code' value={this.state.postCode} onChange={this.changeCode}/>
              <Button onClick={this.getCode} style={{ width: '30%' }}>{this.state.codeHolder}</Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default ActivityData;
