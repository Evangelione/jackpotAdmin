import React, { Component } from 'react';
import { Form, Radio,  Button, Input, Upload, Icon } from 'antd';
import { formItemLayout } from '@/common/constant';

const RadioGroup = Radio.Group;

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
          null
          :
          <>
            <Form.Item
              label='IMEI导入'
            >
              <Input style={{ width: '70%', marginRight: 5 }} disabled={true}/>
              {getFieldDecorator('import')(
                <Upload {...props} onChange={this.changeKV}>
                  <Button>
                    <Icon type="upload"/> 导入
                  </Button>
                </Upload>,
              )}
            </Form.Item>
            <div style={{ textAlign: 'center', marginTop: 50 }}>
              <Button type='primary' htmlType='submit' style={{ marginRight: 10 }}>保存</Button>
              <Button type='danger' htmlType='reset'>重置</Button>
            </div>
          </>
        }
      </Form>
    );
  }
}

export default ImeiSetting;
