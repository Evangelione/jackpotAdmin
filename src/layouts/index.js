import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import SelectLang from '../components/SelectLang';
// import zh_CN from 'antd/lib/locale-provider/zh_CN';
import router from 'umi/router';
import { connect } from 'dva';

// import moment from 'moment';
// import 'moment/locale/zh-cn';

// moment.locale('zh-cn');

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

const BreadcrumbItem = {
  '/': <FormattedMessage id="index.bread.bigWheel"/>,
  '/soduku': <FormattedMessage id="index.bread.soduku"/>,
  '/goldenEggs': <FormattedMessage id="index.bread.eggFrenzy"/>,
  '/imeiSetting': <FormattedMessage id="index.bread.imei"/>,
  '/administrator': <FormattedMessage id="index.bread.admin"/>,
};

@connect(({ global }) => ({
  global,
}))
class BasicLayout extends Component {
  state = {
    collapsed: false,
  };

  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  handleClick = ({ item, key, keyPath }) => {
    router.push(key);
  };

  render() {
    const { global: { currentLink }, location: { pathname } } = this.props;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div className="logo"/>
          <Menu theme="dark" defaultSelectedKeys={[currentLink]} defaultOpenKeys={['home']} mode="inline"
                onClick={this.handleClick}>
            <SubMenu
              key="home"
              title={<span><Icon type="home"/><span>
                <FormattedMessage id="index.bread.index"/>
              </span></span>}
            >
              <Menu.Item key="/">
                <FormattedMessage id="index.bread.bigWheel"/>
              </Menu.Item>
              <Menu.Item key="/soduku">
                <FormattedMessage id="index.bread.soduku"/>
              </Menu.Item>
              <Menu.Item key="/goldenEggs">
                <FormattedMessage id="index.bread.eggFrenzy"/>
              </Menu.Item>
              <Menu.Item key="/imeiSetting">
                <FormattedMessage id="index.bread.imei"/>
              </Menu.Item>
              <Menu.Item key="/administrator">
                <FormattedMessage id="index.bread.admin"/>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0, textAlign: 'right' }}>
            <SelectLang/>
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>
                <FormattedMessage id="index.bread.index"/>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{BreadcrumbItem[pathname]}</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              {this.props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default BasicLayout;
