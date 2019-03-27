import React, { Component } from 'react';
import { Form, Input, DatePicker, Upload, Button, Icon, Switch, message } from 'antd';
import { formItemLayout } from '@/common/constant';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import reqwest from 'reqwest';
import { api } from '@/common/constant';

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
    uploading: false,
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

  beforeUpload = (file) => {
    this.setState({
      kvFileList: [file],
    });
    this.handleUpload();
    return false;
  };

  handleUpload = () => {
    const { kvFileList } = this.state;
    const formData = new FormData();
    kvFileList.forEach((file) => {
      formData.append('file', file);
    });

    this.setState({
      uploading: true,
    });

    console.log(formData);

    // You can use any AJAX library you like
    reqwest({
      url: `${api}/api/upload`,
      method: 'post',
      processData: false,
      data: formData,
      success: (resp) => {
        console.log(resp);
        this.setState({
          fileList: [],
          uploading: false,
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
    const formatedText = formatMessage({
      id: 'index.bread.index',
    });
    console.log(formatedText);
    const { getFieldDecorator } = this.props.form;
    const { uploading } = this.state;
    const props = {
      action: '//jsonplaceholder.typicode.com/posts/',
      listType: 'picture',
      fileList: [...this.state.kvFileList],
    };
    console.log(this.state.kvFileList);
    return (
      <Form {...formItemLayout}>
        <Form.Item
          label={<FormattedMessage id="setting.navBar.pageSetup.title"/>}
        >
          {getFieldDecorator('title', strConfig)(
            <Input placeholder={formatMessage({
              id: 'setting.navBar.pageSetup.title.placeHolder',
            })}/>,
          )}
        </Form.Item>
        <Form.Item
          label={<FormattedMessage id="setting.navBar.pageSetup.kv"/>}
        >
          {getFieldDecorator('banner')(
            <Upload
              listType='picture'
              loading={uploading}
              fileList={this.state.kvFileList}
              beforeUpload={this.beforeUpload}
            >
              <Button>
                <Icon type="upload"/> <FormattedMessage id="setting.navBar.pageSetup.kv.btn"/>
              </Button>
            </Upload>,
          )}
        </Form.Item>
        <Form.Item
          label={<FormattedMessage id="setting.navBar.pageSetup.bg"/>}
        >
          {getFieldDecorator('background')(
            <Upload {...props}>
              <Button>
                <Icon type="upload"/> <FormattedMessage id="setting.navBar.pageSetup.bg.btn"/>
              </Button>
            </Upload>,
          )}
        </Form.Item>
        <Form.Item
          label={<FormattedMessage id="setting.navBar.pageSetup.banner"/>}
        >
          {getFieldDecorator('ad')(
            <Upload {...props}>
              <Button>
                <Icon type="upload"/> <FormattedMessage id="setting.navBar.pageSetup.banner.btn"/>
              </Button>
            </Upload>,
          )}
        </Form.Item>
        <Form.Item
          label={<FormattedMessage id="setting.navBar.pageSetup.start"/>}
        >
          {getFieldDecorator('startTime', timeConfig)(
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"
                        placeholder={formatMessage({
                          id: 'setting.navBar.pageSetup.start.placeHolder',
                        })}/>,
          )}
        </Form.Item>
        <Form.Item
          label={<FormattedMessage id="setting.navBar.pageSetup.end"/>}
        >
          {getFieldDecorator('endTime', timeConfig)(
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"
                        placeholder={formatMessage({
                          id: 'setting.navBar.pageSetup.end.placeHolder',
                        })}/>,
          )}
        </Form.Item>
        <Form.Item
          label={<FormattedMessage id="setting.navBar.pageSetup.eventDesc"/>}
        >
          {getFieldDecorator('description', strConfig)(
            <TextArea placeholder={formatMessage({
              id: 'setting.navBar.pageSetup.eventDesc.placeHolder',
            })}
                      autosize={{ minRows: 4 }}/>,
          )}
        </Form.Item>
        <Form.Item
          label={<FormattedMessage id="setting.navBar.pageSetup.pointer"/>}
        >
          {getFieldDecorator('pointer')(
            <Upload {...props}>
              <Button>
                <Icon type="upload"/> <FormattedMessage id="setting.navBar.pageSetup.pointer.btn"/>
              </Button>
            </Upload>,
          )}
        </Form.Item>
        <Form.Item
          label={<FormattedMessage id="setting.navBar.pageSetup.turntable"/>}
        >
          {getFieldDecorator('turntable')(
            <Upload {...props}>
              <Button>
                <Icon type="upload"/> <FormattedMessage id="setting.navBar.pageSetup.turntable.btn"/>
              </Button>
            </Upload>,
          )}
        </Form.Item>
        <Form.Item
          label={<FormattedMessage id="setting.navBar.pageSetup.award"/>}
        >
          {getFieldDecorator('record')(
            <Switch defaultChecked/>,
          )}
        </Form.Item>
        <Form.Item
          label={<FormattedMessage id="setting.navBar.pageSetup.winnersList"/>}
        >
          {getFieldDecorator('newest')(
            <Switch defaultChecked/>,
          )}
        </Form.Item>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Button type='primary' htmlType='submit' style={{ marginRight: 10 }}>
            <FormattedMessage id="setting.navBar.pageSetup.save"/>
          </Button>
          <Button type='danger' htmlType='reset'>
            <FormattedMessage id="setting.navBar.pageSetup.reset"/>
          </Button>
        </div>
      </Form>
    );
  }
}

export default PageSetting;
