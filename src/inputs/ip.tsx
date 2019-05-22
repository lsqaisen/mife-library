import { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { Input } from 'antd';
import { InputProps } from 'antd/lib/input'
import Inputmask from 'inputmask';

class IPInput extends PureComponent<InputProps, any> {
  componentDidMount() {
    Inputmask({ alias: 'ip', placeholder: "0" }).mask(ReactDOM.findDOMNode(this))
  }
  render() {
    return (
      <Input {...this.props} />
    )
  }
}

export default IPInput;