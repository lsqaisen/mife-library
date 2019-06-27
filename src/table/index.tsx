import * as React from 'react';
import { PureComponent } from 'react';
import { Table } from 'antd';
import { TableProps } from 'antd/lib/table';
import Animate from 'rc-animate';
import 'rc-table/assets/animation.css';
import './style/index.less';


class ATable<T> extends PureComponent<TableProps<T>, any> {
  render() {
    return (
      <Table
        components={{ body: { wrapper: (props: any) => <Animate transitionName="move" component="tbody" {...props} /> } }}
        {...this.props}
      />
    )
  }
}

export default ATable;

