import { PureComponent } from 'react';
import * as G2 from '@antv/g2'
import Chart, { Types } from './basic';

export interface AreaProps {
  line?: boolean;
  type?: Types;
  color?: string[];
  symbol?: string;
  timeMask?: string;
  data?: any[];
  initDraw?: (chart: G2.Chart) => void;
}

class Area extends PureComponent<AreaProps, any> {
  static readonly defaultProps: AreaProps = {
    line: false,
    type: 'line',
    symbol: '%',
    timeMask: 'mm:ss',
    color: ['#286cff'],
    data: [],
    initDraw: () => null,
  }

  chart: G2.Chart | null | undefined;

  initDraw = (chart: G2.Chart) => {
    const { line, type, data, initDraw } = this.props;
    chart.source(data);
    chart.scale({
      value: {
        type: 'linear',
        sync: true,
        formatter(val: any) {
          return `${val}%`
        }
      },
      time: {
        type: 'time',
        mask: 'H:m',
      }
    });
    if (type !== 'line' && line) {
      chart.line().position('time*value').color("title").shape('smooth');
    }
    chart[type!]().position('time*value').color("title").shape('smooth');
    initDraw!(chart);
  }

  UNSAFE_componentWillReceiveProps({ data = [], timeMask }: AreaProps) {
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

export default Area;
