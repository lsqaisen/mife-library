import { PureComponent } from 'react';
import MaskedInput, { MaskedInputProps } from 'react-maskedinput';

class IPInput extends PureComponent<any, any> {
  render() {
    const { value, form } = this.props;
    return (
      { MaskedInput }
    )
  }
}

export default IPInput;