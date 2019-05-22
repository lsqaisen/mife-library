import * as React from 'react';
import { PureComponent } from 'react';
import { Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { generateUUID } from '@/utils'

export interface FormInputProps<T = any> extends FormComponentProps {
  value?: T;
  onChange?: (v: T) => void;
}

export default <T extends Object = {}>(WrappedComponent: React.ComponentClass<any, any>) => {
  class FormInput extends PureComponent<FormInputProps<T>, any> {
    changeValidator = (rules: any[]) => {
      const { validateFields } = this.props.form;
      const index = rules.findIndex(rule => Object.keys(rule).includes('validator'));
      if (index !== -1) {
        rules[index] = {
          validator: (rule: any, value: any, callback: any) => {
            validateFields((error: any, _: any) => {
              if (error) {
                callback(error)
              }
              callback()
            })
            rules[index].validator(rule, value, callback)
          }
        }
      } else {
        rules.push({
          validator: (rule: any, value: any, callback: any) => {
            validateFields((error: any, _: any) => {
              if (error) {
                callback(error)
              }
              callback()
            })
          }
        })
      }
    }
    UNSAFE_componentWillReceiveProps(nextProps: any) {
      if (!(nextProps as any)['data-__meta'].rules) (nextProps as any)['data-__meta'].rules = [];
      this.changeValidator((nextProps as any)['data-__meta'].rules)
    }
    componentDidMount() {
      if (!(this.props as any)['data-__meta'].rules) (this.props as any)['data-__meta'].rules = [];
      this.changeValidator((this.props as any)['data-__meta'].rules);
    }
    render() {
      return React.createElement(WrappedComponent, this.props);
    }
  }

  return Form.create<FormInputProps<T>>({
    name: `${generateUUID()}`,
    onValuesChange: ({ onChange }, changedValues, allValues) => {
      onChange && onChange(Object.assign({}, changedValues, allValues) as T);
    }
  })(FormInput);
};