import { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import * as G2 from '@antv/g2';
import { ChartProps } from '@antv/g2'
import { generateUUID } from '@/utils';

export type Types = "line" | "path" | "area" | "point" | "interval" | "polygon" | "schema" | "edge" | "heatmap" | "pointStack" | "pointJitter" | "pointDodge" | "intervalStack" | "intervalDodge" | "intervalSymmetric" | "areaStack" | "schemaDodge";

export interface BasicProps extends ChartProps {
  style?: React.CSSProperties;
  onDraw?: (chart: G2.Chart) => void
}

class Basic extends PureComponent<BasicProps, any> {
  static readonly defaultProps: BasicProps = {
    container: generateUUID(),
    forceFit: true,
    height: 260,
    padding: 'auto',
    onDraw: () => null,
  }

  chart: any = undefined;

  componentDidMount() {
    const { style, container, onDraw, ...props } = this.props;
    if (typeof container === "string") {
      const dom = document.createElement('div');
      (ReactDOM.findDOMNode(this) as HTMLElement).appendChild(dom);
      this.chart = new G2.Chart({ container: dom, ...props });
    } else {
      this.chart = new G2.Chart({ container, ...props });
      (ReactDOM.findDOMNode(this) as HTMLElement).appendChild(container);
    }
    onDraw!(this.chart);
    this.chart.render();
  }
  render = () => (<div style={this.props.style} />)
}

export default Basic;
