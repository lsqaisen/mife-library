import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Layout } from 'antd';
import QueueAnim from 'rc-queue-anim';
import Loading from '@/components/global/loading';
import SiderDrawer, { create } from './sider-drawer';
import styles from './style/index.less';

export interface SiderProps {
  children?: any;
  level: number;
  loading?: boolean;
  matches: boolean;
  realWidth?: number | string;
  width?: number | string;
}

class Sider extends React.PureComponent<SiderProps, any> {
  static backgroundColors = ["#ecf0f6", "#f2f7fb"];
  static readonly defaultProps: SiderProps = {
    level: 0,
    loading: false,
    matches: false,
  }

  updateSiderDrawer = (props: SiderProps) => {
    const { matches, level, realWidth, children } = props;
    if (!children) return;
    if (!matches) {
      ReactDOM.unmountComponentAtNode(document.getElementById("media-siders"))
    } else {
      create(Object.assign({}, { sider: children, realWidth }), level);
    }
  }

  UNSAFE_componentWillReceiveProps({ children, ...props }: SiderProps) {
    const { children: _children, ..._props } = this.props;
    if (JSON.stringify(_props) !== JSON.stringify(props)) {
      this.updateSiderDrawer({ children, ...props });
    }
  }

  componentDidMount() {
    this.updateSiderDrawer(this.props);
  }

  render() {
    const { level, loading, matches, width, children } = this.props;
    if (!children) return null;
    return (
      <React.Fragment>
        {!matches ? <Layout.Sider
          className={styles.sider}
          style={{ backgroundColor: Sider.backgroundColors[level] }}
          width={width}
          collapsedWidth={0}
        >
          <QueueAnim style={{ height: '100%' }} type="alpha" duration={600}>
            {loading ? <Loading key="loading" /> : React.cloneElement(children as any, { key: 'children' })}
          </QueueAnim>
        </Layout.Sider> : <SiderDrawer />}
      </React.Fragment>
    )
  }
}

export default Sider;