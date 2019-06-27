import { PureComponent, Fragment } from 'react';
import { PageHeader, Avatar, Tag, Icon, Typography, Dropdown, Menu, Divider, Popover, Descriptions } from 'antd';
import GMenu from '@/components/global/menu';
import Logo from '@/components/global/logo';
import styles from './style/index.less';

const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
type colorType = (typeof colorList)[number];

type UserProps = {
  name: string;
  guestName: string;
  trial: boolean;
  admin: boolean;
}

type UserState = {
  color?: colorType;
}

export default class extends PureComponent<UserProps, UserState> {
  static readonly defaultProps = {
    trial: true,
  }
  state = {
    color: colorList[parseInt(`${Math.random() * 10}`) % 4]
  }
  UNSAFE_componentWillReceiveProps(nextProps: UserProps) {
    if (nextProps.name !== this.props.name) {
      this.setState({
        color: colorList[parseInt(`${Math.random() * 10}`) % 4],
      });
    }
  }
  render() {
    const { name, trial, admin, guestName, children } = this.props;
    const { color } = this.state;
    return (
      <div className={`${styles.box}`}>
        <Menu selectedKeys={[]}>
          <Menu.SubMenu title={(
            <Fragment>
              <Avatar className={styles.avatar} style={{ backgroundColor: color }} icon="user" />
              <Typography.Text style={{ marginLeft: 8, verticalAlign: 'middle' }} strong>
                <Tag style={{ padding: '0 5px' }} color={admin ? "red" : "#286cff"}>{admin ? '管理员' : '平台用户'}</Tag>
                <Typography.Text>{name}</Typography.Text>
              </Typography.Text>
            </Fragment>
          )}>
            <Menu.Item>
              xsdfasdfasdfasdfasdfasdfasfdasdf
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Divider />
          <Menu.Item>
            <Descriptions className={styles.namespace}>
              <Descriptions.Item label="工作空间">
                <Dropdown placement="bottomRight" overlay={(
                  <Menu>
                    <Menu.Item>
                      <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
                        1st menu item
                      </a>
                    </Menu.Item>
                  </Menu>
                )}>
                  <a className="ant-dropdown-link" href="#">
                    <Typography.Text style={{ float: "left", color: 'inherit', width: 'calc(100% - 14px)' }} ellipsis>
                      xxxxxxxxxxxxxxxxx
                    </Typography.Text>
                    <Icon style={{ display: "inline-block" }} type="down" />
                  </a>
                </Dropdown>
              </Descriptions.Item>
            </Descriptions>
          </Menu.Item>
        </Menu>
        {children}
      </div>
    )
  }
}