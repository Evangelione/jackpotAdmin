import React, { Component } from 'react';
import { Table, Button, Pagination, Select, message, DatePicker } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import reqwest from 'reqwest';
import { api } from '@/common/constant';
import moment from 'moment';

const Option = Select.Option;

@connect(({ bigWheel }) => ({
  bigWheel,
}))
class Index extends Component {
  state = {
    fileList: [],
    uploading: false,
    activityId: '',
    goodName: '',
    area: '',
    start: null,
    end: null,
  };

  search = () => {
    this.props.dispatch({
      type: 'bigWheel/fetchImei',
      payload: {
        id: this.state.activityId,
        goodName: this.state.goodName,
        area: this.state.area,
        start: this.state.start ? moment(this.state.start).format('YYYY-MM-DD') : '',
        end: this.state.end ? moment(this.state.end).format('YYYY-MM-DD') : '',
      },
    });
  };

  export = () => {
    const { activityId, goodName, area, start, end } = this.state;
    let cacheStart = start || '';
    let cacheEnd = end || '';
    window.location.href = `${api}/admin/activity/user/exportGlobal?activityId=${activityId}&goodName=${goodName}&area=${area}&start=${cacheStart}&end=${cacheEnd}`;
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'bigWheel/fetchImei',
      payload: {},
    });
    this.props.dispatch({
      type: 'bigWheel/fetchGlobalOption',
      payload: {},
    });
  }

  columns = [{
    title: formatMessage({ id: 'custom.table.phone' }),
    dataIndex: 'phone',
    key: 'phone',
  }, {
    title: formatMessage({ id: 'custom.table.imei' }),
    dataIndex: 'imei',
    key: 'imei',
  }, {
    title: formatMessage({ id: 'custom.table.name' }),
    dataIndex: 'name',
    key: 'name',
  }, {
    title: formatMessage({ id: 'custom.table.address' }),
    dataIndex: 'address',
    key: 'address',
  }, {
    title: formatMessage({ id: 'custom.table.pin' }),
    dataIndex: 'pinCode',
    key: 'pinCode',
  }, {
    title: formatMessage({ id: 'custom.table.title' }),
    dataIndex: 'title',
    key: 'title',
  }, {
    title: formatMessage({ id: 'custom.table.award' }),
    dataIndex: 'prizeTitle',
    key: 'prizeTitle',
  }, {
    title: formatMessage({ id: 'custom.table.prize' }),
    dataIndex: 'prizeName',
    key: 'prizeName',
  }, {
    title: formatMessage({ id: 'custom.table.drawTime' }),
    dataIndex: 'createtime',
    key: 'createtime',
  }, {
    title: formatMessage({ id: 'custom.table.product' }),
    dataIndex: 'goodName',
    key: 'goodName',
  }, {
    title: formatMessage({ id: 'custom.table.area' }),
    dataIndex: 'area',
    key: 'area',
  }];

  onStartChange = (value) => {
    this.setState({
      start: value,
    });
  };

  onEndChange = (value) => {
    this.setState({
      end: value,
    });
  };

  delete = (id) => {
    this.props.dispatch({
      type: 'global/deleteGlobalImei',
      payload: {
        id,
      },
    }).then(() => {
      this.props.dispatch({
        type: 'bigWheel/fetchImei',
        payload: {},
      });
    });
  };

  pageChange = (page) => {
    this.props.dispatch({
      type: 'bigWheel/fetchImei',
      payload: {
        page,
        id: this.state.activityId,
        goodName: this.state.goodName,
        area: this.state.area,
        start: this.state.start ? moment(this.state.start).format('YYYY-MM-DD') : '',
        end: this.state.end ? moment(this.state.end).format('YYYY-MM-DD') : '',
      },
    });
  };

  onRemove = () => {
    this.setState({
      fileList: [],
    });
    this.props.form.setFieldsValue({
      file: '',
    });
  };
  beforeUpload = (field, file) => {
    // this.setState({
    //   [field]: [file],
    // });
    this.handleUpload(field, file);
    return false;
  };

  handleUpload = (field, file) => {
    const formData = new FormData();
    formData.append('file', file);

    this.setState({
      uploading: true,
    });


    // You can use any AJAX library you like
    reqwest({
      url: `${api}/admin/imei/import`,
      method: 'post',
      processData: false,
      data: formData,
      success: (resp) => {
        this.setState({
          fileList: [{
            ...this.state[field],
            name: resp.data.name,
            uid: '-`',
            status: 'done',
            url: resp.data.url,
          }],
          uploading: false,
          file: resp.data.url,
        });
        message.success(resp.msg);
      },
      error: () => {
        this.setState({
          uploading: false,
        });
        message.error('upload failed.');
      },
    });
  };

  mapActivityOption = () => {
    return this.props.bigWheel.activityOption.map((value, index) => {
      return <Option value={value.value} key={index}>{value.label}</Option>;
    });
  };

  mapModalOption = () => {
    return this.props.bigWheel.modalOption.map((value, index) => {
      return <Option value={value} key={index}>{value}</Option>;
    });
  };

  mapAreaOption = () => {
    return this.props.bigWheel.areaOption.map((value, index) => {
      return <Option value={value.value} key={index}>{value.label}</Option>;
    });
  };

  fetchAreaOption = (value) => {
    this.props.dispatch({
      type: 'bigWheel/fetchAreaSelect',
      payload: {
        id: value,
      },
    });
    this.setState({
      activityId: value,
    });
  };

  fetchModalOption = (value) => {
    this.props.dispatch({
      type: 'bigWheel/fetchModalSelect',
      payload: {
        id: value,
      },
    });
    this.setState({
      goodName: value,
    });
  };


  render() {
    const { imeiList, imeiPage, imeiTotal } = this.props.bigWheel;
    return (
      <div>
        <div style={{ marginBottom: 20 }}>
          <span>{formatMessage({ id: 'custom.title' })}</span>
          <Select style={{ width: 120, margin: '0 20px 0 10px' }} onChange={this.fetchAreaOption}
                  placeholder={formatMessage({ id: 'custom.selectActivity' })}>
            {this.mapActivityOption()}
          </Select>
          <span>{formatMessage({ id: 'custom.productName' })}</span>
          <Select style={{ width: 120, margin: '0 20px 0 10px' }} onChange={this.fetchModalOption}
                  placeholder={formatMessage({ id: 'custom.selectProduct' })}>
            {this.mapModalOption()}
          </Select>
          <span>{formatMessage({ id: 'custom.area' })}</span>
          <Select style={{ width: 120, margin: '0 20px 0 10px' }} onChange={_ => this.setState({ area: _ })}
                  placeholder={formatMessage({ id: 'custom.selectArea' })}>
            {this.mapAreaOption()}
          </Select>
          <span>{formatMessage({ id: 'custom.date' })}</span>
          <DatePicker
            format="YYYY-MM-DD"
            value={this.state.start}
            placeholder={formatMessage({ id: 'setting.navBar.pageSetup.start' })}
            onChange={this.onStartChange}
            style={{ margin: '0 20px' }}
          />
          <DatePicker
            format="YYYY-MM-DD"
            value={this.state.end}
            placeholder={formatMessage({ id: 'setting.navBar.pageSetup.end' })}
            onChange={this.onEndChange}
          />
          <Button style={{ float: 'right', marginLeft: 10 }}
                  onClick={this.export}>{formatMessage({ id: 'custom.Export' })}</Button>
          <Button type='primary' style={{ float: 'right' }}
                  onClick={this.search}>{formatMessage({ id: 'custom.search' })}</Button>
        </div>
        <Table dataSource={imeiList} columns={this.columns} rowKey='imei' pagination={false}/>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Pagination current={imeiPage} total={imeiTotal} onChange={this.pageChange}/>
        </div>
      </div>
    );
  }
}

export default Index;
