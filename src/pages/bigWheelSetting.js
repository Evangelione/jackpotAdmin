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
    const { pageSetupDetail, imeiDetail, prizeDetail, probabilityDetail } = this.props.bigWheel;
    return (
      <Tabs onChange={this.callback} type="card">
        <TabPane tab={<FormattedMessage id="setting.navBar.pageSetup"/>} key="1">
          {pageSetupDetail && Object.keys(pageSetupDetail).length && <PageSetting detail={pageSetupDetail}/>}
        </TabPane>
        <TabPane tab={<FormattedMessage id="setting.navBar.imeiSetting"/>} key="2">
          {imeiDetail && Object.keys(imeiDetail).length && <IMEISetting detail={imeiDetail}/>}
        </TabPane>
        <TabPane tab={<FormattedMessage id="setting.navBar.prizeSetting"/>} key="3">
          {/*{prizeDetail && Object.keys(prizeDetail).length && <PrizeSetting detail={prizeDetail}/>}*/}
          <PrizeSetting detail={prizeDetail} id={this.props.location.query.id}/>
        </TabPane>
        <TabPane tab={<FormattedMessage id="setting.navBar.probabilitySetting"/>} key="4">
          {/*{probabilityDetail && Object.keys(probabilityDetail).length &&*/}
          {/*<PossibilitySetting detail={probabilityDetail}/>}*/}
          <PossibilitySetting detail={probabilityDetail}/>
        </TabPane>
      </Tabs>
    );
  }
}

export default BigWheelSetting;
