import React, { Component } from 'react';
import { Button, Input, Table, Pagination } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import OperatorModal from './components/OperatorModal';
import { connect } from 'dva';

const { Search } = Input;

@connect(({ administrator }) => ({
  administrator,
}))
class Index extends Component {
  columns = [{
    title: <FormattedMessage id="administrator.list.table.name"/>,
    dataIndex: 'name',
    key: 'name',
  }, {
    title: <FormattedMessage id="administrator.list.table.account"/>,
    dataIndex: 'username',
    key: 'username',
  }, {
    title: <FormattedMessage id="administrator.list.table.operatingAuthorization"/>,
    dataIndex: 'auth',
    key: 'auth',
    render: (text) => {
      switch (text) {
        case '1':
          return formatMessage({ id: 'administrator.list.table.check' });
        case '2':
          return formatMessage({ id: 'administrator.list.table.redeem' });
        case '3':
          return formatMessage({ id: 'administrator.list.table.administrator' });
        default:
          return null;
      }
    },
  }, {
    title: <FormattedMessage id="administrator.list.table.creationTime"/>,
    dataIndex: 'createtime',
    key: 'createtime',
  }, {
    title: <FormattedMessage id="administrator.list.table.edit"/>,
    render: (text, record) => {
      return <OperatorModal modify={record}>
        <Button type='primary'>
          {formatMessage({ id: 'administrator.list.table.edit' })}
        </Button>
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
            <Button type='primary' htmlType='button'>
              {formatMessage({ id: 'administrator.add.btn' })}
            </Button>
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
