import React, { Component } from 'react';
import { Input, Button, message } from 'antd';
import styles from './index.less';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import SelectLang from '../../components/SelectLang';

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
        <div style={{float: 'right', marginTop: 20, marginRight: 20}}><SelectLang/></div>
        <div className={styles.loginBox}>
          <div style={{ fontSize: 60 ,marginBottom: 100, fontWeight: 'bold', color: '#fff'}}>{formatMessage({ id: 'login.title' })}</div>
          <div>
            <Input placeholder={formatMessage({ id: 'complete.information' })}
                   onChange={this.changeField.bind(null, 'username')}/>
            <Input placeholder={formatMessage({ id: 'complete.information' })}
                   onChange={this.changeField.bind(null, 'password')} type='password'/>
            <div style={{marginTop: 20}}>
              <Button onClick={this.login}>{formatMessage({ id: 'login.btn' })}</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Index;
