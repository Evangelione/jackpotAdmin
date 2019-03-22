import React, { Component } from 'react';
import { Tabs } from 'antd';
import PageSetting from '../components/PageSetting';
import IMEISetting from '../components/IMEISetting';
import PrizeSetting from '../components/PrizeSetting';
import PossibilitySetting from '../components/PossibilitySetting';

const TabPane = Tabs.TabPane;

class BigWheelSetting extends Component {
  callback = (key) => {
    console.log(key);
  };

  render() {
    return (
      <Tabs onChange={this.callback} type="card">
        <TabPane tab="页面设置" key="1">
          <PageSetting/>
        </TabPane>
        <TabPane tab="IMEI设置" key="2">
          <IMEISetting/>
        </TabPane>
        <TabPane tab="奖品设置" key="3">
          <PrizeSetting/>
        </TabPane>
        <TabPane tab="概率设置" key="4">
          <PossibilitySetting/>
        </TabPane>
      </Tabs>
    );
  }
}

export default BigWheelSetting;
