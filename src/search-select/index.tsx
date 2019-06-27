import { PureComponent } from 'react';
import { Select, Spin } from 'antd';
import { SelectProps } from 'antd/lib/select';
import debounce from 'lodash.debounce'
const Option = Select.Option;
const OptGroup = Select.OptGroup;


interface optionType {
	key: string;
	value?: any;
	label: any;
	disabled?: boolean;
	children?: optionType[]
}

export interface SearchSelectProps extends SelectProps {
	initFirst?: boolean;
	data?: optionType[];
	asyncSearch?: (param: any) => void;
}

interface SearchSelectState {
	init?: boolean;
	error?: string;
	loading: boolean;
	end: boolean;
	data: optionType[];
	nextParams?: any;
}

class SearchSelect extends PureComponent<SearchSelectProps, SearchSelectState> {
	static readonly defaultProps = {
		initFirst: false,
		data: []
	}

	state: SearchSelectState = {
		init: false,
		error: '',
		loading: false,
		end: false,
		data: [],
	}

	constructor(props: SearchSelectProps) {
		super(props);
		this.state.data = (props.data || []) as optionType[];
	}

	getOptions = (options: optionType[]) => {
		if (Array.isArray(options)) {
			return options.map(option => {
				if (Array.isArray(option.children)) {
					return (
						<OptGroup key={option.key} label={option.label}>
							{this.getOptions(option.children)}
						</OptGroup>
					)
				} else {
					return (
						<Option disabled={option.disabled} key={option.key} value={option.value || option.key}>{option.label}</Option>
					)
				}
			});
		}
		return null;
	}

	load = async (e?: any) => {
		const { onSearch } = this.props;
		const { data: _data, nextParams } = this.state;
		this.setState({ loading: true })
		try {
			let { data, params } = await onSearch!(nextParams);
			this.setState({
				init: true,
				loading: false,
				nextParams: params,
				data: _data.concat(data || []),
				end: !params
			});
		} catch (error) {
			this.setState({ error, loading: false, init: true, })
		}
	}

	UNSAFE_componentWillReceiveProps({ data }: SearchSelectProps) {
		const { data: _data } = this.props;
		if (data!.length !== _data!.length || data!.some(v => _data!.every(_v => v.key !== _v.key))) {
			this.setState({ data: data! })
		}
	}
	componentDidMount() {
		this.props.initFirst && this.load();
	}
	render() {
		const { onSearch, ...props } = this.props;
		const { init, error, loading, end, data } = this.state;
		return (
			<Select
				{...props}
				onFocus={() => !init && this.load()}
				notFoundContent={error ? <p>
					<span style={{ color: 'red' }}>{error}</span><br />
					<a onClick={this.load}>重新加载</a>
				</p> :
					'暂无数据'}
			>
				{this.getOptions(data)}
				{!loading && !end ? <Option disabled key="$nextsearch">
					<a onClick={this.load}>更多...</a>
				</Option> : []}
				{loading ? <Option disabled key="$loading"><Spin size="small" /></Option> : []}
			</Select>
		)
	}
}

export default SearchSelect;