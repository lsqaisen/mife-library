import { PureComponent } from 'react';
import * as G2 from '@antv/g2'
import Chart, { Types } from './basic';
import styles from './style/index.less';

export interface CircleProps {
  line?: boolean;
  type?: Types;
  color?: string[];
  symbol?: string;
  timeMask?: string;
  data?: any[];
  initDraw?: (chart: G2.Chart) => void;
}

class Circle extends PureComponent<CircleProps, any> {
  static readonly defaultProps: CircleProps = {
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
    const { line, type, data, color, initDraw } = this.props;
    chart.source(data);
    chart.legend(false);

    chart.facet('rect', {
      fields: ['type'],
      padding: 20,
      showTitle: false,
      eachView: function eachView(view, facet) {
        var data = facet.data;
        data.push({
          type: '其他',
          value: 100 - data[0].value
        });
        view.source(data);
        view.coord('theta', {
          radius: 0.8,
          innerRadius: 0.5
        });
        view.intervalStack().position('value').color('type', color!);
        view.guide().html({
          position: ['50%', '50%'],
          html: `<div class="${styles['g2-guide-html']}"><p class="${styles.title}">${data[0].type}</p><p class="${styles.value}">${data[0].value}%</p></div>`
        });
      }
    });
    initDraw!(chart);
  }

  UNSAFE_componentWillReceiveProps({ data = [] }: CircleProps) {
    if (JSON.stringify(data) !== JSON.stringify(this.props.data)) {
      this.chart!.changeData(data);
    }
  }
  render() {
    return (
      <Chart
        {...this.props}
        height={199}
        ref={(ref: any) => ref && (this.chart = ref.chart)}
        onDraw={this.initDraw}
      />
    )
  }
}

export default Circle;
