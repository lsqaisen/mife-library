import * as React from 'react';
import { PureComponent, Fragment } from 'react';
import { Icon } from 'antd';
import { TableProps } from 'antd/lib/table';
import Table from './';
import Actions from './actions';

export interface ActionTableProps<T> extends TableProps<T> {
  loading?: boolean;
  actionType?: 'button' | 'dropdown';
  actionText?: string;
  actions?: React.ReactNode | (() => React.ReactNode);
}

class ActionTable<T> extends PureComponent<ActionTableProps<T>, any> {
  static Actions: any = null;
  static readonly defaultProps: ActionTableProps<any> = {
    loading: false,
    actionType: 'dropdown',
    actionText: '操作',
  }
  state = {
    selectIndex: -1,
    visibles: {} as { [key: string]: boolean },
  }

  render() {
    const { loading, dataSource, actionText, actionType, actions, columns, children, ...props } = this.props;
    const { selectIndex, visibles } = this.state;
    return (
      <Fragment>
        <Table<T>
          {...props}
          loading={loading}
          columns={columns!.concat(actions ? [{
            title: '操作',
            dataIndex: '',
            fixed: 'right',
            width: 72,
            className: "tc",
            onCell: () => {
              return {
                style: {
                  minWidth: 72,
                }
              }
            },
            render: (_, r, i) => actionType === "dropdown" ? (
              <Actions
                actions={this.props.actions}
                data={r}
                onClick={(key: string) => {
                  const visibles = this.state.visibles;
                  this.setState({ visibles: Object.assign({}, visibles, { [key]: true }), selectIndex: i })
                }}
              >
                <a className="ant-dropdown-link" href="#" onClick={(e) => e.preventDefault()}>
                  {actionText} <Icon type="down" />
                </a>
              </Actions>
            ) : (
                <a className="ant-dropdown-link" href="#" onClick={(e) => {
                  e.preventDefault();
                  const visibles = this.state.visibles;
                  this.setState({ visibles: Object.assign({}, visibles, { ['button']: true }), selectIndex: i })
                }}>{actionText}</a>
              ),
          }] : [])}
          dataSource={dataSource}
        />
        {children && React.Children.map(children, (action: any) => {
          return action && React.cloneElement(action, {
            visible: visibles[action.key],
            data: dataSource![selectIndex] || {},
            onClose: () => {
              const visibles = this.state.visibles;
              this.setState({ visibles: Object.assign({}, visibles, { [action.key]: false }), selectIndex: -1 })
            },
          })
        }

        )}
      </Fragment >
    )
  }
}

ActionTable.Actions = Actions;

export default ActionTable;