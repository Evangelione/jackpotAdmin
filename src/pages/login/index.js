import React, { Component } from 'react';
import { Input, Button, message } from 'antd';
import styles from './index.less';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';

@connect(({ bigWheel }) => ({
  bigWheel,
}))
class Index extends Component {
  state = {
    username: '',
    password: '',
  };
  login = () => {
    const { username, password } = this.state;
    if (!username || !password) {
      message.error(formatMessage({ id: 'complete.information' }));
      return false;
    }
    this.props.dispatch({
      type: 'bigWheel/loginAdmin',
      payload: {
        username,
        password,
      },
    });
  };

  changeField = (field, e) => {
    this.setState({
      [field]: e.target.value,
    });
  };

  render() {
    return (
      <div className={styles.background}>
        <div className={styles.loginBox}>
          <div style={{ fontSize: 28 }}>vivo抽奖系统管理后台</div>
          <div className={styles.logo}/>
          <Input placeholder={formatMessage({ id: 'complete.information' })}
                 onChange={this.changeField.bind(null, 'username')}/>
          <Input placeholder={formatMessage({ id: 'complete.information' })}
                 onChange={this.changeField.bind(null, 'password')}/>
          <div>
            <Button onClick={this.login}>登录</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Index;
