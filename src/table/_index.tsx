import * as React from 'react';
import ReactDOM from 'react-dom';
import { PureComponent } from 'react';
import { Table } from 'antd';
import { TableProps, ColumnProps } from 'antd/lib/table';
import { TweenOneGroup } from 'rc-tween-one';
import Animate from 'rc-animate';
import './style/index.less';

const TableContext = React.createContext(false);


const AnimateBody = (props: any) => <Animate transitionName="move" component="tbody" {...props} />;


const enterAnim = (isPageTween: boolean, widthArray: (string | number | undefined)[]) => {
  const onComplete = (e: any) => {
    let dom = e.target.childNodes;
    widthArray.forEach((width, index) => {
      if (!!width) {
        if (/^\d+%$/.test(`${width}`)) {
          (dom[index] as HTMLElement).style.flex = `${widthArray.length * parseFloat(`.${width}`)}`;
        } else {
          (dom[index] as HTMLElement).style.flex = 'none';
          (dom[index] as HTMLElement).style.width = `${parseInt(`${width}`)}px`;
        }
      }
    })
  }
  return !isPageTween ? [{
    opacity: 0, x: 30, backgroundColor: '#fffeee', duration: 0,
  }, {
    height: 0,
    duration: 200,
    type: 'from',
    delay: 250,
    ease: 'easeOutQuad',
    onComplete,
  }, {
    opacity: 1, x: 0, duration: 250, ease: 'easeOutQuad',
  }, {
    delay: 1000, backgroundColor: '#fff'
  },] : [{
    opacity: 0, duration: 0,
  }, {
    height: 0,
    duration: 150,
    type: 'from',
    delay: 150,
    ease: 'easeOutQuad',
    onComplete,
  }, {
    opacity: 1, duration: 150, ease: 'easeOutQuad',
  },]
};

const leaveAnim = (isPageTween: boolean) => {
  return !isPageTween ? [
    { duration: 250, opacity: 0 },
    { height: 0, duration: 200, ease: 'easeOutQuad' },
  ] : [
      { duration: 150, opacity: 0 },
      { height: 0, duration: 150, ease: 'easeOutQuad' },
    ]
};

class ATable<T> extends PureComponent<TableProps<T>, any> {
  animTag = (props: any) => {
    return (
      <TableContext.Consumer>
        {(isPageTween) => {
          return (
            <TweenOneGroup
              component="tbody"
              enter={enterAnim(isPageTween, (this.props.columns || []).map(v => v.width))}
              leave={leaveAnim(isPageTween)}
              appear={false}
              exclusive
              {...props}
            />
          );
        }}
      </TableContext.Consumer>
    );
  }

  changeWidth = () => {
    const { columns = [] } = this.props;
    let length = columns.length;
    let ths = ReactDOM.findDOMNode(this).getElementsByClassName('ant-table-thead')[0].getElementsByTagName('tr')[0].childNodes,
      rows = ReactDOM.findDOMNode(this).getElementsByClassName('ant-table-row');
    columns.forEach((column, index) => {
      if (!!column.width) {
        if (/^\d+%$/.test(`${column.width}`)) {
          (ths[index] as HTMLElement).style.flex = `${length * parseFloat(`.${column.width}`)}`;
        } else {
          (ths[index] as HTMLElement).style.flex = 'none';
          (ths[index] as HTMLElement).style.width = `${parseInt(`${column.width}`)}px`;
        }
        for (let i = 0; i < rows.length; i++) {
          if (/^\d+%$/.test(`${column.width}`)) {
            (rows[i].childNodes[index] as HTMLElement).style.flex = `${length * parseFloat(`.${column.width}`)}`;
          } else {
            (rows[i].childNodes[index] as HTMLElement).style.flex = 'none';
            (rows[i].childNodes[index] as HTMLElement).style.width = `${parseInt(`${column.width}`)}px`;
          }
        }
      }
    })
  }

  componentDidMount() {
    this.changeWidth();
  }

  render() {
    return (
      <Table
        className={`table-enter-leave-demo-table`}
        components={{ body: { wrapper: AnimateBody } }}
        {...this.props}
      />
    )
  }
}

export default ATable;

