import React, { Component } from 'react';
import { Tabs } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import PageSetting from '../components/PageSetting';
import IMEISetting from '../components/IMEISetting';
import PrizeSetting from '../components/PrizeSetting';
import PossibilitySetting from '../components/PossibilitySetting';
import { connect } from 'dva';

const TabPane = Tabs.TabPane;

@connect(({ bigWheel }) => ({
  bigWheel,
}))
class BigWheelSetting extends Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'bigWheel/fetchActivityDetail',
      payload: {
        id: this.props.location.query.id,
      },
    });
  }

  callback = (key) => {
    console.log(key);
  };

  render() {
    const { activityDetail } = this.props.bigWheel;
    console.log(activityDetail);
    return (
      <Tabs onChange={this.callback} type="card">
        <TabPane tab={<FormattedMessage id="setting.navBar.pageSetup"/>} key="1">
          <PageSetting/>
        </TabPane>
        <TabPane tab={<FormattedMessage id="setting.navBar.imeiSetting"/>} key="2">
          <IMEISetting/>
        </TabPane>
        <TabPane tab={<FormattedMessage id="setting.navBar.prizeSetting"/>} key="3">
          <PrizeSetting/>
        </TabPane>
        <TabPane tab={<FormattedMessage id="setting.navBar.probabilitySetting"/>} key="4">
          <PossibilitySetting/>
        </TabPane>
      </Tabs>
    );
  }
}

export default BigWheelSetting;
