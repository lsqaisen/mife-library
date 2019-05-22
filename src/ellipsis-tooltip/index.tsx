import { PureComponent } from 'react';
import { Tooltip } from 'antd';

export interface EllipsisTooltipProps {
  title?: any;
}

class EllipsisTooltip extends PureComponent<EllipsisTooltipProps, any> {
  state = {
    visible: false
  }
  container: any = null;
  handleVisibleChange = (visible: boolean) => {
    if (this.container.clientWidth < this.container.scrollWidth) {
      this.setState({
        visible: visible
      })
    }
  }
  render() {
    return (
      <Tooltip visible={this.state.visible} onVisibleChange={this.handleVisibleChange} title={this.props.title}>
        <div ref={node => this.container = node as any} style={{
          textOverflow: 'ellipsis',
          overflow: 'hidden',
        }}>{this.props.children}</div>
      </Tooltip>
    )
  }
}

export default EllipsisTooltip;