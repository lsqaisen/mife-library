import { PureComponent } from 'react';
import { Menu, Icon, Modal } from 'antd';
import { MenuProps } from 'antd/lib/menu';
import QueueAnim from 'rc-queue-anim';
import ScrollBar from 'react-perfect-scrollbar';
import styles from './style/index.less';

const { Item, SubMenu, ItemGroup } = Menu;

export interface ItemData {
  type: 'group' | 'item' | 'subitem';
  key: string;
  component: React.ReactNode | (() => React.ReactNode) | string;
  childs?: ItemData[];
}

export interface GMenuProps extends MenuProps {
  width: number | string;
  data: ItemData[];
}

class GMenu extends PureComponent<GMenuProps, any> {
  static readonly defaultProps: GMenuProps = {
    width: '100%',
    data: []
  }
  getComponent = (data: ItemData[]) => {
    return data.map(v => {
      switch (v.type) {
        case 'subitem':
          return (
            <SubMenu key={v.key} title={v.component}>
              {this.getComponent(v.childs!)}
            </SubMenu>
          )
        case 'group':
          return (
            <ItemGroup key={v.key} title={v.component}>
              {this.getComponent(v.childs!)}
            </ItemGroup>
          )
        case 'item':
          return (
            <Item key={v.key}>
              {v.component}
            </Item>
          )
        default:
          return null;
      }

    })
  }
  render() {
    const { width, data, ...props } = this.props;
    return (
      <div className={styles.menu_box} style={{ width }}>
        <ScrollBar
          options={{
            suppressScrollX: true,
          }}
        >
          <QueueAnim
            component={Menu}
            componentProps={{
              ...props,
              mode: "inline",
              style: { height: '100%' },
            }}
            animConfig={[
              { opacity: [1, 0], translateX: [0, -250] },
              { opacity: [1, 0], translateX: [0, 250] },
            ]}
          >
            {this.getComponent(data)}
          </QueueAnim>
        </ScrollBar>
      </div >
    )
  }
}

export default GMenu;