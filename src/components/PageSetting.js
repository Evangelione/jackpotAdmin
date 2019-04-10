import React, { Component } from 'react';
import { Form, Input, DatePicker, Button, Switch, message, Upload, Icon } from 'antd';
import { formItemLayout } from '@/common/constant';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import reqwest from 'reqwest';
import { api } from '@/common/constant';
import moment from 'moment';
import { connect } from 'dva';
import withRouter from 'umi/withRouter';

const { TextArea } = Input;
const strConfig = {
  rules: [{ type: 'string', required: true, message: 'Please select time!' }],
};
const timeConfig = {
  rules: [{ type: 'object', required: true, message: 'Please select time!' }],
};

@connect(({ bigWheel }) => ({
  bigWheel,
}))
@Form.create()
class PageSetting extends Component {
  state = {
    banner: [],
    background: [],
    ad: [],
    pointer: [],
    turntable: [],
    uploading: false,
  };

  componentDidMount() {
    const { detail } = this.props;
    this.setState({
      banner: [{
        uid: '-1',
        url: detail.banner,
        thumbUrl: detail.banner,
      }],
      background: [{
        uid: '-1',
        status: 'done',
        url: detail.background,
        thumbUrl: detail.background,
      }],
      ad: [{
        uid: '-1',
        status: 'done',
        url: detail.ad,
        thumbUrl: detail.ad,
      }],
      // pointer: [{
      //   uid: '-1',
      //   status: 'done',
      //   url: detail.pointer,
      //   thumbUrl: detail.pointer,
      // }],
      // turntable: [{
      //   uid: '-1',
      //   status: 'done',
      //   url: detail.turntable,
      //   thumbUrl: detail.turntable,
      // }],
    });
    this.props.form.setFieldsValue({
      title: detail.title,
      banner: detail.banner,
      background: detail.background,
      ad: detail.ad,
      startTime: detail.starttime && moment(detail.starttime),
      endTime: detail.endtime && moment(detail.endtime),
      description: detail.description,
      // pointer: detail.pointer,
      // turntable: detail.turntable,
      prizeShow: detail.prizeShow,
      record: detail.record,
      newest: detail.newest,
    });
  }

  // changeKV = (info) => {
  //   // console.log(pic);
  //   // this.setState({
  //   //   banner: [{
  //   //     uid: pic.file.uid,
  //   //     name: pic.file.name,
  //   //     status: pic.file.status,
  //   //     url: pic.file.thumbUrl,
  //   //     thumbUrl: pic.file.thumbUrl,
  //   //   }],
  //   // });
  //   let fileList = info.fileList;
  //
  //   // 1. Limit the number of uploaded files
  //   // Only to show two recent uploaded files, and old ones will be replaced by the new
  //   fileList = fileList.slice(-2);
  //
  //   // 2. Read from response and show file link
  //   fileList = fileList.map((file) => {
  //     if (file.response) {
  //       // Component will show file.url as link
  //       file.url = file.response.url;
  //     }
  //     return file;
  //   });
  //
  //   // 3. Filter successfully uploaded files according to response from server
  //   fileList = fileList.filter((file) => {
  //     if (file.response) {
  //       return file.response.status === 'success';
  //     }
  //     return false;
  //   });
  //
  //   this.setState({ banner: fileList });
  // };

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
      url: `${api}/api/upload`,
      method: 'post',
      processData: false,
      data: formData,
      success: (resp) => {
        this.setState({
          [field]: [{
            ...this.state[field],
            uid: resp.data.id,
            status: 'done',
            url: resp.data.url,
            thumbUrl: resp.data.url,
          }],
          uploading: false,
        }, () => {
          this.props.form.setFieldsValue({
            [field]: resp.data.url,
          });
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

  onRemove = (filed, file) => {
    this.setState({
      [filed]: [],
    });
    this.props.form.setFieldsValue({
      [filed]: '',
    });
  };

  submitPageSetting = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.id = this.props.detail.id;
        // values.startTime = values.startTime.toISOString();
        // values.endTime = values.endTime.toISOString();
        this.props.dispatch({
          type: 'bigWheel/upDatePageSetup',
          payload: {
            form: values,
          },
        }).then(() => {
          this.props.dispatch({
            type: 'bigWheel/fetchActivityDetail',
            payload: {
              id: this.props.location.query.id,
            },
          }).then(() => {
            const { detail } = this.props;
            this.props.form.setFieldsValue({
              title: detail.title,
              banner: detail.banner,
              background: detail.background,
              ad: detail.ad,
              startTime: detail.starttime && moment(detail.starttime),
              endTime: detail.endtime && moment(detail.endtime),
              description: detail.description,
              // pointer: detail.pointer,
              // turntable: detail.turntable,
              prizeShow: detail.prizeShow,
              record: detail.record,
              newest: detail.newest,
            });
          });
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { uploading } = this.state;
    return (
      <Form {...formItemLayout} >
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
              fileList={this.state.banner}
              onRemove={this.onRemove.bind(null, 'banner')}
              beforeUpload={this.beforeUpload.bind(null, 'banner')}>
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
            <Upload
              listType='picture'
              loading={uploading}
              fileList={this.state.background}
              onRemove={this.onRemove.bind(null, 'background')}
              beforeUpload={this.beforeUpload.bind(null, 'background')}>
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
            <Upload
              listType='picture'
              loading={uploading}
              fileList={this.state.ad}
              onRemove={this.onRemove.bind(null, 'ad')}
              beforeUpload={this.beforeUpload.bind(null, 'ad')}>
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
        {/*<Form.Item*/}
        {/*label={<FormattedMessage id="setting.navBar.pageSetup.pointer"/>}*/}
        {/*>*/}
        {/*{getFieldDecorator('pointer')(*/}
        {/*<Upload*/}
        {/*listType='picture'*/}
        {/*loading={uploading}*/}
        {/*fileList={this.state.pointer}*/}
        {/*onRemove={this.onRemove.bind(null, 'pointer')}*/}
        {/*beforeUpload={this.beforeUpload.bind(null, 'pointer')}>*/}
        {/*<Button>*/}
        {/*<Icon type="upload"/> <FormattedMessage id="setting.navBar.pageSetup.pointer.btn"/>*/}
        {/*</Button>*/}
        {/*</Upload>,*/}
        {/*)}*/}
        {/*</Form.Item>*/}
        {/*<Form.Item*/}
        {/*label={<FormattedMessage id="setting.navBar.pageSetup.turntable"/>}*/}
        {/*>*/}
        {/*{getFieldDecorator('turntable')(*/}
        {/*<Upload*/}
        {/*listType='picture'*/}
        {/*loading={uploading}*/}
        {/*fileList={this.state.turntable}*/}
        {/*onRemove={this.onRemove.bind(null, 'turntable')}*/}
        {/*beforeUpload={this.beforeUpload.bind(null, 'turntable')}>*/}
        {/*<Button>*/}
        {/*<Icon type="upload"/> <FormattedMessage id="setting.navBar.pageSetup.turntable.btn"/>*/}
        {/*</Button>*/}
        {/*</Upload>,*/}
        {/*)}*/}
        {/*</Form.Item>*/}
        <Form.Item
          label={<FormattedMessage id="setting.navBar.pageSetup.prizeList"/>}
        >
          {getFieldDecorator('prizeShow', { valuePropName: 'checked', initialValue: false })(
            <Switch/>,
          )}
        </Form.Item>
        <Form.Item
          label={<FormattedMessage id="setting.navBar.pageSetup.award"/>}
        >
          {getFieldDecorator('record', { valuePropName: 'checked', initialValue: false })(
            <Switch/>,
          )}
        </Form.Item>
        <Form.Item
          label={<FormattedMessage id="setting.navBar.pageSetup.winnersList"/>}
        >
          {getFieldDecorator('newest', { valuePropName: 'checked', initialValue: false })(
            <Switch/>,
          )}
        </Form.Item>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Button type='primary' htmlType='button' style={{ marginRight: 10 }} onClick={this.submitPageSetting}>
            <FormattedMessage id="setting.navBar.pageSetup.save"/>
          </Button>
          <Button type='danger' htmlType='reset' onClick={() => {
            this.props.form.resetFields();
            this.setState({
              banner: [],
              background: [],
              ad: [],
              pointer: [],
              turntable: [],
            });
          }}>
            <FormattedMessage id="setting.navBar.pageSetup.reset"/>
          </Button>
        </div>
      </Form>
    );
  }
}

export default withRouter(PageSetting);
