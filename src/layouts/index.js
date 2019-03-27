import React, { Component } from 'react';
import { LocaleProvider, Layout, Menu, Breadcrumb, Icon } from 'antd';
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
  '/': '大转盘',
  '/soduku': '九宫格',
  '/goldenEggs': '砸金蛋',
  '/administrator': '管理员设置',
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
              title={<span><Icon type="home"/><span>首页</span></span>}
            >
              <Menu.Item key="/">大转盘</Menu.Item>
              <Menu.Item key="/soduku">九宫格</Menu.Item>
              <Menu.Item key="/goldenEggs">砸金蛋</Menu.Item>
              <Menu.Item key="/imeiSetting">全局IMEI设置</Menu.Item>
              <Menu.Item key="/administrator">管理员设置</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0, textAlign: 'right' }}>
            <SelectLang/>
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>首页</Breadcrumb.Item>
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
