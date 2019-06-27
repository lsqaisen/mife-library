import * as React from 'react';
import { PureComponent } from 'react';
import { PageHeader } from 'antd';
import Link from 'umi/link';
import styles from './style/index.less';

export type BreadcrumbProps = {
  name?: string,
  desc?: string,
  routes?: any[];
}

class Breadcrumb extends PureComponent<BreadcrumbProps, any> {
  static readonly defaultProps = {
    routes: [{
      path: '/dashboard',
      breadcrumbName: '总览',
    }, {
      path: '/auth/user',
      breadcrumbName: '所有用户',
    }]
  }

  render() {
    const { name, desc, routes, children } = this.props;
    return (
      <PageHeader
        className={styles[`breadcrumb`]}
        style={{ minHeight: '100vh' }}
        title={name}
        subTitle={desc}
        breadcrumb={{
          routes,
          itemRender(route, _, routes) {
            const last = routes.indexOf(route) === routes.length - 1;
            return last ? <span>{route.breadcrumbName}</span> : <Link to={route.path}>{route.breadcrumbName}</Link>;
          }
        }}
      >
        {children}
      </PageHeader>
    )
  }
}

export default Breadcrumb;