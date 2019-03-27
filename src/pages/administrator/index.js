import React, { Component } from 'react';
import { Button, Input, Table, Pagination } from 'antd';
import OperatorModal from './components/OperatorModal';
import { connect } from 'dva';

const { Search } = Input;

@connect(({ administrator }) => ({
  administrator,
}))
class Index extends Component {
  columns = [{
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '账号',
    dataIndex: 'username',
    key: 'username',
  }, {
    title: '权限',
    dataIndex: 'auth',
    key: 'auth',
    render: (text) => {
      switch (text) {
        case '1':
          return '查看';
        case '2':
          return '兑奖';
        case '3':
          return '管理员';
        default:
          return null;
      }
    },
  }, {
    title: '创建时间',
    dataIndex: 'createtime',
    key: 'createtime',
  }, {
    title: '编辑',
    render: (text, record) => {
      return <OperatorModal modify={record}>
        <Button type='primary'>编辑</Button>
      </OperatorModal>;
    },
  }];

  componentDidMount() {
    this.props.dispatch({
      type: 'administrator/fetchUserList',
      payload: {},
    });
  }

  userListPageChange = (page) => {
    this.props.dispatch({
      type: 'administrator/fetchUserList',
      payload: {
        page,
      },
    });
  };

  searchUserList = (keyWord) => {
    this.props.dispatch({
      type: 'administrator/fetchUserList',
      payload: {
        page: 1,
        searchKeyWord: keyWord,
      },
    });
  };

  keyWordChange = (e) => {
    !e.target.value && this.props.dispatch({
      type: 'administrator/fetchUserList',
      payload: {},
    });
  };

  render() {
    const { userList, userPage, userTotal } = this.props.administrator;
    return (
      <>
        <div style={{ textAlign: 'right', marginBottom: 20 }}>
          <OperatorModal>
            <Button type='primary' htmlType='button'>新增管理员</Button>
          </OperatorModal>
          <div style={{ display: 'inline-block', verticalAlign: 'bottom', marginLeft: 10 }}>
            <Search style={{ width: 300 }} onSearch={this.searchUserList} onChange={this.keyWordChange}/>
          </div>
        </div>
        <Table columns={this.columns} dataSource={userList} rowKey='id' pagination={false}/>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Pagination current={userPage} total={userTotal} onChange={this.userListPageChange}/>
        </div>
      </>
    );
  }
}

export default Index;
