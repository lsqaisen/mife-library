import * as React from 'react';
import { Drawer } from 'antd';
import { DrawerProps } from 'antd/lib/drawer';
import styles from './style/index.less';

const Btn = ({ open, onClick }: any) => (
  <div
    className={`${styles.btn} ${open && styles.open}`}
    onClick={onClick}
  >
    <i className={styles.icon} />
  </div>
)

export interface SiderDrawerItemProps extends DrawerProps {
  show: boolean;
  sider: undefined | string | React.ReactElement;
  realWidth?: string | number;
  onChange?: (value: boolean) => void;
}

class SiderDrawerItem extends React.PureComponent<SiderDrawerItemProps, any> {
  static readonly defaultProps: SiderDrawerItemProps = {
    show: true,
    sider: undefined,
    realWidth: 210,
    onChange: () => null,
  }
  state = {
    init: false,
    visible: false,
  }
  changeVisible = () => {
    this.setState({ visible: !this.state.visible }, () => {
      this.props.onChange!(this.state.visible);
    })
  }
  componentDidMount() {
    this.setState({ init: true })
  }
  render() {
    const { show, realWidth, sider, children, onChange, ...props } = this.props;
    const { init, visible } = this.state;
    return (
      <React.Fragment>
        <Drawer
          {...props}
          className={`media-sider-drawer ${styles.drawer_sider} ${init ? '' : styles.drawer}`}
          bodyStyle={{ padding: 0 }}
          visible={!init ? true : visible}
          closable={false}
          placement="left"
          width={realWidth}
          onClose={this.changeVisible}
        >
          {show && <Btn open={visible} onClick={this.changeVisible} />}
          {children}
          {React.cloneElement(sider as any, {
            changeVisible: this.changeVisible
          })}
        </Drawer>
      </React.Fragment>
    )
  }
}

export default SiderDrawerItem;