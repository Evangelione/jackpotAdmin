import React, { PureComponent } from 'react';
import { formatMessage, setLocale, getLocale } from 'umi-plugin-react/locale';
import { Menu, Icon, Dropdown } from 'antd';

class SelectLang extends PureComponent {
  changeLang = ({ key }) => {
    setLocale(key);
  };

  render() {
    const selectedLang = getLocale();
    const locales = ['en-US', 'zh-CN'];
    const languageLabels = {
      'en-US': 'English',
      'zh-CN': '简体中文',
    };
    const languageIcons = {
      'en-US': '🇬🇧',
      'zh-CN': '🇨🇳',
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
