import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useState } from 'react';
import Item from './sider-drawer-item';

window.sider_drawers = window.sider_drawers || [];

let state: any,
  setState: any,
  matches: boolean,
  setMatches: any;

function getDrawersElement([data, children]: any, show: any) {
  if (!data) return null;
  const [s, set] = useState(false);
  if (!!children) {
    return <Item show={show[0]} onChange={set} {...data}>
      {getDrawersElement(children, [s, set])}
    </Item>
  }
  return <Item show={show[0]} {...data} />
}

const SiderDrawer: any = () => {
  [state = [], setState] = useState(window.sider_drawers);
  let data: any[] = [state[0], undefined];
  for (let i = 1; i <= state.length - 1; i++) {
    data = [state[i], data];
  }
  [matches, setMatches] = useState(true);
  return getDrawersElement(data, [matches, setMatches]);
}

export const create = (data: any, level: number) => {
  window.sider_drawers[level] = data;
  if (setState) setState(window.sider_drawers.filter((v: any) => !!v));
}

export default () => {
  return (
    ReactDOM.createPortal(
      <SiderDrawer key="media-siders" />,
      document.getElementById("media-siders")
    )
  )
};