import * as React from 'react';
import { Menu, Dropdown } from 'antd';
import styles from './style/index.less';

export default ({ actions, children, ...props }: any) => {
  return (
    <Dropdown
      trigger={["click"]}
      overlayClassName={styles.actions}
      placement="bottomRight"
      overlay={(
        <Menu className={styles.menus}>
          {React.cloneElement(actions, props)}
        </Menu>
      )}>
      {children}
    </Dropdown>
  )
}
