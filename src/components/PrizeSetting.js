import React, { Component } from 'react';
import { Button, Form, Icon, Input, Select, Upload, Switch, Divider } from 'antd';
import { formItemLayout } from '@/common/constant';

const { Option } = Select;
const { TextArea } = Input;

const strConfig = {
  rules: [{ type: 'string', required: true, message: 'Please select time!' }],
};

const objConfig = {
  rules: [{ type: 'object', required: true, message: 'Please select time!' }],
};

@Form.create()
class PrizeSetting extends Component {
  state = {
    prizeQuantity: '1',
    fileList: [{
      uid: '-1',
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }],
  };

  changeFile = (info) => {
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

    this.setState({ fileList });
  };

  mapFormItem = () => {
    const { getFieldDecorator } = this.props.form;
    const { prizeQuantity } = this.state;
    const props = {
      action: '//jsonplaceholder.typicode.com/posts/',
      listType: 'picture',
      fileList: [...this.state.fileList],
    };
    let ele = [];
    for (let i = 0; i < prizeQuantity - 0; i++) {
      ele.push(
        <div key={Math.random()}>
          <Divider orientation="left">{i + 1}号奖品</Divider>
          <Form.Item
            label='奖项名称'
          >
            {getFieldDecorator('prizeName', {
              ...strConfig,
            })(
              <Input/>,
            )}
          </Form.Item>
          <Form.Item
            label='奖品名称'
          >
            {getFieldDecorator('prizeName2', {
              ...strConfig,
            })(
              <Input/>,
            )}
          </Form.Item>
          <Form.Item
            label='中奖概率'
          >
            {getFieldDecorator('probability', {
              ...strConfig,
            })(
              <Input addonAfter='%'/>,
            )}
          </Form.Item>
          <Form.Item
            label='奖品数量'
          >
            {getFieldDecorator('prizeCount', {
              ...strConfig,
            })(
              <Input/>,
            )}
          </Form.Item>
          <Form.Item
            label='每日数量'
          >
            {getFieldDecorator('dayCount', {
              ...strConfig,
            })(
              <Input/>,
            )}
          </Form.Item>
          <Form.Item
            label='可中次数'
          >
            {getFieldDecorator('canPrize', {
              ...strConfig,
            })(
              <Input/>,
            )}
          </Form.Item>
          <Form.Item
            label='奖品图片'
          >
            {getFieldDecorator('prizeImage', {
              ...objConfig,
            })(
              <Upload {...props} onChange={this.changeFile}>
                <Button>
                  <Icon type="upload"/> 上传奖品图片
                </Button>
              </Upload>,
            )}
          </Form.Item>
          <Form.Item
            label='中奖提示语'
          >
            {getFieldDecorator('hint', {
              ...strConfig,
            })(
              <TextArea placeholder="Autosize height with minimum and maximum number of lines"
                        autosize={{ minRows: 4 }}/>,
            )}
          </Form.Item>
          <Form.Item
            label='短信验证'
          >
            {getFieldDecorator('dxHint')(
              <Switch defaultChecked/>,
            )}
          </Form.Item>
        </div>,
      );
    }
    console.log(ele);
    return ele;
  };

  changeQuantity = (value) => {
    this.setState({
      prizeQuantity: value,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { prizeQuantity } = this.state;
    return (
      <Form {...formItemLayout}>
        <Form.Item
          label='奖项个数'
        >
          {getFieldDecorator('quantitySelect', {
            ...strConfig,
            initialValue: prizeQuantity,
          })(
            <Select placeholder="Please select a country" onChange={this.changeQuantity}>
              <Option value="1">1</Option>
              <Option value="2">2</Option>
              <Option value="3">3</Option>
              <Option value="4">4</Option>
              <Option value="5">5</Option>
            </Select>,
          )}
        </Form.Item>
        {this.mapFormItem()}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Button type='primary' htmlType='submit' style={{ marginRight: 10 }}>保存</Button>
          <Button type='danger' htmlType='reset'>重置</Button>
        </div>
      </Form>
    );
  }
}

export default PrizeSetting;
