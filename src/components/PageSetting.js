import React, { Component } from 'react';
import { Form, Input, DatePicker, Upload, Button, Icon, Switch } from 'antd';
import { formItemLayout } from '@/common/constant';

const { TextArea } = Input;
const strConfig = {
  rules: [{ type: 'string', required: true, message: 'Please select time!' }],
};
const timeConfig = {
  rules: [{ type: 'object', required: true, message: '请选择时间' }],
};

@Form.create()
class PageSetting extends Component {
  state = {
    kvFileList: [{
      uid: '-1',
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }],
  };

  changeKV = (info) => {
    // console.log(pic);
    // this.setState({
    //   kvFileList: [{
    //     uid: pic.file.uid,
    //     name: pic.file.name,
    //     status: pic.file.status,
    //     url: pic.file.thumbUrl,
    //     thumbUrl: pic.file.thumbUrl,
    //   }],
    // });
    let fileList = info.fileList;

    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-2);

    // 2. Read from response and show file link
    fileList = fileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });

    // 3. Filter successfully uploaded files according to response from server
    fileList = fileList.filter((file) => {
      if (file.response) {
        return file.response.status === 'success';
      }
      return false;
    });

    this.setState({ kvFileList: fileList });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const props = {
      action: '//jsonplaceholder.typicode.com/posts/',
      listType: 'picture',
      fileList: [...this.state.kvFileList],
    };
    return (
      <Form {...formItemLayout}>
        <Form.Item
          label='标题'
        >
          {getFieldDecorator('title', strConfig)(
            <Input/>,
          )}
        </Form.Item>
        <Form.Item
          label='KV横幅'
        >
          {getFieldDecorator('kv')(
            <Upload {...props} onChange={this.changeKV}>
              <Button>
                <Icon type="upload"/> 上传KV横幅
              </Button>
            </Upload>,
          )}
        </Form.Item>
        <Form.Item
          label='背景图'
        >
          {getFieldDecorator('bg')(
            <Upload {...props}>
              <Button>
                <Icon type="upload"/> 上传背景图
              </Button>
            </Upload>,
          )}
        </Form.Item>
        <Form.Item
          label='广告图'
        >
          {getFieldDecorator('banner')(
            <Upload {...props}>
              <Button>
                <Icon type="upload"/> 上传广告图
              </Button>
            </Upload>,
          )}
        </Form.Item>
        <Form.Item
          label='开始时间'
        >
          {getFieldDecorator('start', timeConfig)(
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"/>,
          )}
        </Form.Item>
        <Form.Item
          label='结束时间'
        >
          {getFieldDecorator('end', timeConfig)(
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"/>,
          )}
        </Form.Item>
        <Form.Item
          label='活动说明'
        >
          {getFieldDecorator('description', strConfig)(
            <TextArea placeholder="Autosize height with minimum and maximum number of lines"
                      autosize={{ minRows: 4 }}/>,
          )}
        </Form.Item>
        <Form.Item
          label='转盘指针'
        >
          {getFieldDecorator('pointer')(
            <Upload {...props}>
              <Button>
                <Icon type="upload"/> 上传转盘指针
              </Button>
            </Upload>,
          )}
        </Form.Item>
        <Form.Item
          label='转盘'
        >
          {getFieldDecorator('turntable')(
            <Upload {...props}>
              <Button>
                <Icon type="upload"/> 上传转盘
              </Button>
            </Upload>,
          )}
        </Form.Item>
        <Form.Item
          label='中奖记录'
        >
          {getFieldDecorator('recording')(
            <Switch defaultChecked/>,
          )}
        </Form.Item>
        <Form.Item
          label='最新中奖名单'
        >
          {getFieldDecorator('list')(
            <Switch defaultChecked/>,
          )}
        </Form.Item>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Button type='primary' htmlType='submit' style={{ marginRight: 10 }}>保存</Button>
          <Button type='danger' htmlType='reset'>重置</Button>
        </div>
      </Form>
    );
  }
}

export default PageSetting;
