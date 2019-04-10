import React, { Component } from 'react';
import { Table, Button, Pagination, Select, message, DatePicker } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import reqwest from 'reqwest';
import { api } from '@/common/constant';

const { RangePicker } = DatePicker;
const Option = Select.Option;

@connect(({ bigWheel }) => ({
  bigWheel,
}))
class Index extends Component {
  state = {
    fileList: [],
    uploading: false,
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'bigWheel/fetchImei',
      payload: {},
    });
  }

  columns = [{
    title: formatMessage({ id: 'custom.table.phone' }),
    dataIndex: 'filename',
    key: 'filename',
  }, {
    title: formatMessage({ id: 'custom.table.imei' }),
    dataIndex: 'num',
    key: 'num',
  }, {
    title: formatMessage({ id: 'custom.table.name' }),
    dataIndex: 'createtime',
    key: 'createtime',
  }, {
    title: formatMessage({ id: 'custom.table.address' }),
  }, {
    title: formatMessage({ id: 'custom.table.pin' }),
  }, {
    title: formatMessage({ id: 'custom.table.title' }),
  }, {
    title: formatMessage({ id: 'custom.table.award' }),
  }, {
    title: formatMessage({ id: 'custom.table.prize' }),
  }, {
    title: formatMessage({ id: 'custom.table.drawTime' }),
  }, {
    title: formatMessage({ id: 'custom.table.product' }),
  }, {
    title: formatMessage({ id: 'custom.table.area' }),
  }];
  onChange = (value, dateString) => {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
  };

  onOk = (value) => {
    console.log('onOk: ', value);
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

  render() {
    const { imeiList, imeiPage, imeiTotal } = this.props.bigWheel;
    return (
      <div>
        <div style={{ marginBottom: 20 }}>
          <span>{formatMessage({ id: 'custom.title' })}</span>
          <Select defaultValue="lucy" style={{ width: 120, margin: '0 20px 0 10px' }}
                  placeholder={formatMessage({ id: 'custom.selectActivity' })}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="disabled" disabled>Disabled</Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
          <span>{formatMessage({ id: 'custom.productName' })}</span>
          <Select defaultValue="lucy" style={{ width: 120, margin: '0 20px 0 10px' }}
                  placeholder={formatMessage({ id: 'custom.selectProduct' })}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="disabled" disabled>Disabled</Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
          <span>{formatMessage({ id: 'custom.area' })}</span>
          <Select defaultValue="lucy" style={{ width: 120, margin: '0 20px 0 10px' }}
                  placeholder={formatMessage({ id: 'custom.selectArea' })}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="disabled" disabled>Disabled</Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
          <span>{formatMessage({ id: 'custom.date' })}</span>
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            placeholder={['Start Time', 'End Time']}
            onChange={this.onChange}
            onOk={this.onOk}
            style={{ margin: '0 20px 0 10px' }}
          />
          <Button style={{ float: 'right', marginLeft: 10 }}>{formatMessage({ id: 'custom.Export' })}</Button>
          <Button type='primary' style={{ float: 'right' }}>{formatMessage({ id: 'custom.search' })}</Button>
        </div>
        <Table dataSource={imeiList} columns={this.columns} rowKey='id' pagination={false}/>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Pagination current={imeiPage} total={imeiTotal} onChange={this.pageChange}/>
        </div>
      </div>
    );
  }
}

export default Index;
