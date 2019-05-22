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
  state: 'initially' | 'centent' | 'empty';
  matches: boolean;
  realWidth?: number | string;
  width?: number | string;
}

class Sider extends React.PureComponent<SiderProps, any> {
  static backgroundColors = ["#ecf0f6", "#f2f7fb"];
  static readonly defaultProps: SiderProps = {
    level: 0,
    state: 'initially',
    matches: false,
  }

  updateSiderDrawer = (props: SiderProps) => {
    const { matches, level, realWidth, children } = props;
    if (!matches) {
      ReactDOM.unmountComponentAtNode(document.getElementById("media-siders"))
    } else {
      create({ sider: children, realWidth }, level);
    }
  }

  componentDidMount() {
    this.updateSiderDrawer(this.props)
  }

  UNSAFE_componentWillReceiveProps(props: SiderProps) {
    this.updateSiderDrawer(props);
  }

  render() {
    const { level, state, matches, width, children } = this.props;
    return (
      <React.Fragment>
        {!matches ? <Layout.Sider
          className={styles.sider}
          style={{ backgroundColor: Sider.backgroundColors[level] }}
          width={width}
          collapsedWidth={0}
        >
          <QueueAnim type="alpha" duration={600}>
            {state === "initially" ? <Loading key="loading" /> : React.cloneElement(children as any, { key: 'children' })}
          </QueueAnim>
        </Layout.Sider> : <SiderDrawer />}
      </React.Fragment>
    )
  }
}

export default Sider;