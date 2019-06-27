import * as React from 'react';
import { Icon, Button } from 'antd';
import * as xterm from 'xterm';
import 'xterm/dist/xterm.css';
import * as attach from 'xterm/lib/addons/attach/attach';
import * as fit from 'xterm/lib/addons/fit/fit';
import * as fullscreen from 'xterm/lib/addons/fullscreen/fullscreen';
import debounce from 'lodash.debounce';
import { generateUUID } from '@/utils';

const Terminal = xterm.Terminal;
Terminal.applyAddon(attach);
Terminal.applyAddon(fit);
Terminal.applyAddon(fullscreen);


interface TermType extends xterm.Terminal {
  toggleFullScreen?: (fullscreen?: boolean) => void;
  fit?: () => void;
  attach?: (socket?: WebSocket, bidirectional?: boolean, buffered?: boolean) => void;
  detach?: (socket: WebSocket) => void;
  apply?: () => void;
}

export interface TerminalProps {
  url: string;
  bidirectional?: boolean;
  buffered?: boolean;
  splitWrite?: boolean;
  beforeSendData?: string[];
  beforeWriteData?: string[];
  resize?: (cols: number, rows: number) => void;
}

export default class extends React.PureComponent<TerminalProps, any> {
  static readonly defaultProps: TerminalProps = {
    url: '',
    bidirectional: true,
    buffered: false,
    splitWrite: false,
    beforeSendData: [],
    beforeWriteData: [],
    resize: () => null,
  }
  id = generateUUID();
  state = {
    showTip: true
  }
  socket: WebSocket | undefined = undefined;
  term: TermType | undefined = undefined;
  constructor(props: TerminalProps) {
    super(props);
    this.socket = new WebSocket(props.url);
    this.term = new Terminal({
      cursorBlink: true,
    });
    props.beforeWriteData!.forEach(v => this.term!.write(v))
    this.term.write('连接中...\r');
  }

  resize = () => {
    this.term!.toggleFullScreen!();
    this.term!.fit!();
  }

  componentDidMount() {
    const { resize, bidirectional, splitWrite, buffered, beforeSendData } = this.props;
    this.socket!.onopen = () => {
      this.term!.write('                              \r');
      beforeSendData!.forEach(v => this.socket!.send(v));
      !splitWrite && this.term!.attach!(this.socket, bidirectional, buffered);
    };
    splitWrite && (this.socket!.onmessage = (e) => {
      const data = e.data.split('\n');
      if (data[data.length - 1] === "") {
        delete data[data.length - 1];
      }
      data.forEach((v: any) => this.term!.write(`${v}\n\r`));
    })
    this.term!.open(document.getElementById(this.id) as HTMLElement);
    (document.getElementsByClassName('xterm-viewport')[0] as HTMLElement).style.overflow = 'auto';
    this.resize();
    this.term!.on('focus', () => {
      if (!!resize) {
        resize!(this.term!.cols, this.term!.rows);
      }
    })
    this.term!.on('resize', (size) => {
      if (!resize) {
        return;
      }
      resize(size.cols, size.rows);
    });

    this.socket!.onerror = (e) => {
      console.error(e);
    };

    this.socket!.onclose = (e) => {
      console.info(e);
      this.term!.write('连接中失败\r');
      this.term!.detach!(this.socket!);
    };

    window.addEventListener('resize', debounce(this.resize, 300));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', debounce(this.resize, 300));
    this.term!.destroy();
    this.socket!.close();
  }

  render() {
    const isWindows = this.state.showTip && navigator.userAgent.indexOf('Windows') !== -1;
    return (
      <div style={{ position: 'fixed', padding: 16, paddingRight: 0, width: '100%', height: '100%', backgroundColor: '#000' }}>
        {isWindows ? <div
          style={{
            position: 'absolute',
            padding: 8,
            borderRadius: '6px',
            top: '16px',
            right: '16px',
            backgroundColor: '#fff',
            color: '#000',
            zIndex: '999',
          } as any}>
          <p>复制: Ctrl+Insert</p>
          <p>粘贴: Shift+Insert</p>
          <Icon
            type="close-circle-o"
            style={{
              position: 'absolute',
              borderRadius: '100%',
              top: '-4px',
              right: '-4px',
              backgroundColor: '#fff',
              color: '#000',
              zIndex: '999',
              cursor: 'pointer',
            } as any}
            onClick={() => this.setState({ showTip: false })}
          />
        </div> : null}
        <div id={this.id} style={{ position: 'relative', width: 'calc(100%)', height: 'calc(100%)', backgroundColor: '#000' }} />
      </div>
    )
  }
}