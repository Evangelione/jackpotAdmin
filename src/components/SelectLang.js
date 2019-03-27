import React, { PureComponent } from 'react';
import { formatMessage, setLocale, getLocale } from 'umi-plugin-react/locale';
import { Menu, Icon, Dropdown } from 'antd';

class SelectLang extends PureComponent {
  changeLang = ({ key }) => {
    setLocale(key);
  };

  render() {
    const selectedLang = getLocale();
    const locales = ['zh-CN', 'en-US'];
    const languageLabels = {
      'zh-CN': '简体中文',
      'en-US': 'English',
    };
    const languageIcons = {
      'zh-CN': '🇨🇳',
      'en-US': '🇬🇧',
    };
    const langMenu = (
      <Menu selectedKeys={[selectedLang]} onClick={this.changeLang}>
        {locales.map(locale => (
          <Menu.Item key={locale}>
            <span role="img" aria-label={languageLabels[locale]}>
              {languageIcons[locale]}
            </span>{' '}
            {languageLabels[locale]}
          </Menu.Item>
        ))}
      </Menu>
    );
    return (
      <Dropdown overlay={langMenu} placement="bottomRight">
        <span style={{ marginRight: 10, cursor: 'pointer' }}>
          <Icon type="global" title={formatMessage({ id: 'navBar.lang' })}/>
        </span>
      </Dropdown>

    );
  }
}

export default SelectLang;
