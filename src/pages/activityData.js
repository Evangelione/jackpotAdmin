import React, { Component } from 'react';
import { Table, Button, Pagination, Input, Select, Modal, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { api } from '@/common/constant';

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
  };
  columns = [{
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
    render: (text, record) => {
      return text || '暂无';
    },
  }, {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
    render: (text, record) => {
      return text || '暂无';
    },
  }, {
    title: '奖项',
    dataIndex: 'prize',
    key: 'prize',
    render: (text, record) => {
      return record.prize.title;
    },
  }, {
    title: '奖品',
    dataIndex: 'prize',
    key: 'prizeId',
    render: (text, record) => {
      return record.prize.name;
    },
  }, {
    title: '中奖时间',
    dataIndex: 'createtime',
    key: 'createtime',
    render: (text, record) => {
      return moment(text).format('YYYY-MM-DD HH:mm:ss');
    },
  }, {
    title: '兑奖码',
    dataIndex: 'awardCode',
    key: 'awardCode',
  }, {
    title: '短信验证',
    dataIndex: 'verify',
    key: 'verify',
    render: (text) => {
      return text ? '是' : '否';
    },
  }, {
    title: '兑奖',
    render: (text, record) => {
      return <Button type='primary' disabled={record.status}
                     onClick={this.showModal.bind(null, record.verify, record.id)}>Redeem</Button>;
    },
  }, {
    title: '操作',
    render: (text, record) => {
      return <Button type='danger' onClick={this.danger.bind(null, record.id)}>删除</Button>;
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

  danger = (id) => {
    confirm({
      title: '删除本条记录？',
      content: '删除后数据无法恢复，确认要删除吗？',
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
      });
    } else {
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
    }

  };

  handleOk = (e) => {
    console.log(e);
    const { postPhone, postCode } = this.state;
    if (!postPhone || !postCode) {
      message.error('请填写完整信息');
      return false;
    }
    this.props.dispatch({
      type: 'bigWheel/lotteryRedeem',
      payload: {
        phone: postPhone,
        code: postCode,
      },
    }).then(() => {
      this.setState({
        visible: false,
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
      message.error('请输入手机号');
      return false;
    }

    this.props.dispatch({
      type: 'bigWheel/getCode',
      payload: {
        phone: this.state.postPhone,
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
          IMEI码：<Input style={{ width: 160, marginRight: 20 }} value={imei}
                       onChange={this.changeField.bind(null, 'imei')}/>
          手机号：<Input style={{ width: 160, marginRight: 20 }} value={phone}
                     onChange={this.changeField.bind(null, 'phone')}/>
          姓名：<Input style={{ width: 160, marginRight: 20 }} value={name}
                    onChange={this.changeField.bind(null, 'name')}/>
          奖项：<Select style={{ width: 160 }} value={prize} onChange={this.selectPrize}>
          {this.mapPrizeList()}
        </Select>
          <div style={{ float: 'right' }}>
            <Button type='primary' style={{ marginRight: 10 }} onClick={this.searchDetailList}>搜索</Button>
            <Button onClick={this.exportImei}>导出</Button>
          </div>
        </div>
        <Table dataSource={activityDataList} rowKey='id' columns={this.columns} pagination={false}/>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Pagination current={activityDataPage} total={activityDataTotal} onChange={this.pageChange}/>
        </div>
        <Modal
          title="兑奖"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
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
