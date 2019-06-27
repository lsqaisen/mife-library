import { PureComponent } from 'react';
import * as G2 from '@antv/g2'
import Chart, { Types } from './basic';

export interface ContrastProps {
  types?: [Types, Types],
  color?: string[];
  symbol?: string;
  timeMask?: string;
  data?: any[];
  scale?: any;
  initDraw?: (chart: G2.Chart) => void;
}

class Contrast extends PureComponent<ContrastProps, any> {
  static readonly defaultProps: ContrastProps = {
    types: ['line', 'area'],
    symbol: '%',
    timeMask: 'mm:ss',
    color: ['#286cff'],
    data: [],
    initDraw: () => null,
  }

  chart: G2.Chart | null | undefined;

  initDraw = (chart: G2.Chart) => {
    const { scale, types, timeMask, color, data, initDraw } = this.props;
    chart.axis('disk', {
      grid: null
    });
    chart.axis('diskio', {
      title: true as any
    });

    const _scale = scale || {
      time: {
        type: 'time',
        mask: timeMask
      },
      diskio: {
        type: 'linear',
        sync: true,
        alias: '磁盘读写请求数（iops）',
        formatter(val: any) {
          return `${val}`
        },
      },
      disk: {
        type: 'linear',
        sync: true,
        alias: '磁盘读写速度',
        formatter(val: any) {
          return `${window.Number(val).flowCeil(0)}`
        },
      }
    };
    chart.source(data, _scale)
    let keys = Object.keys(_scale).filter(key => key !== 'time')
    keys.forEach((key, i) => {
      chart[types![i] || types![0]]().position(`time*${key}`).color('title', color!)
    })
    initDraw!(chart);
  }

  UNSAFE_componentWillReceiveProps({ data = [], timeMask }: ContrastProps) {
    if (JSON.stringify(data) !== JSON.stringify(this.props.data)) {
      this.chart!.changeData(data);
    }
    if (timeMask !== this.props.timeMask) {
      this.chart!.scale({
        time: {
          type: 'time',
          mask: timeMask,
        }
      });
    }
  }
  render() {
    return (
      <Chart
        {...this.props}
        ref={(ref: any) => ref && (this.chart = ref.chart)}
        onDraw={this.initDraw}
      />
    )
  }
}

export default Contrast;
