import React, { Component } from 'react';
import { Form, Radio, Table, Switch, Button, Input, Upload, Icon } from 'antd';
import { formItemLayout } from '@/common/constant';

const RadioGroup = Radio.Group;
const dataSource = [{
  key: '1',
  name: '胡彦斌',
  age: 32,
  address: '西湖区湖底公园1号',
}, {
  key: '2',
  name: '胡彦祖',
  age: 42,
  address: '西湖区湖底公园1号',
}];

const columns = [{
  title: '标题',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '数据条数',
  dataIndex: 'age',
  key: 'age',
}, {
  title: '时间',
  dataIndex: 'address',
  key: 'address',
}, {
  title: '操作',
  dataIndex: 'operator',
  key: 'operator',
  render: (text, record) => {
    return <Switch/>;
  },
}];

@Form.create()
class ImeiSetting extends Component {
  state = {
    radio: 1,
    fileList: [{
      uid: '-1',
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }],
  };

  onChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      radio: e.target.value,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { radio } = this.state;
    const props = {
      action: '//jsonplaceholder.typicode.com/posts/',
      showUploadList: false,
      fileList: [...this.state.fileList],
    };
    return (
      <Form {...formItemLayout}>
        <Form.Item
          label='IMEI设置'
        >
          {getFieldDecorator('recording', {
            initialValue: this.state.radio,
          })(
            <RadioGroup onChange={this.onChange}>
              <Radio value={1}>全局设置</Radio>
              <Radio value={2}>单独设置</Radio>
            </RadioGroup>,
          )}
        </Form.Item>
        {radio === 1 ?
          <Table dataSource={dataSource} columns={columns} pagination={false}/>
          :
          <Form.Item
            label='IMEI导入'
          >
            <Input style={{ width: '70%', marginRight: 5 }}/>
            {getFieldDecorator('import')(
              <Upload {...props} onChange={this.changeKV}>
                <Button>
                  <Icon type="upload"/> 导入
                </Button>
              </Upload>,
            )}
          </Form.Item>
        }
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Button type='primary' htmlType='submit' style={{ marginRight: 10 }}>保存</Button>
          <Button type='danger' htmlType='reset'>重置</Button>
        </div>

      </Form>
    );
  }
}

export default ImeiSetting;
