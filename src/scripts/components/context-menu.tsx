import React, { useState, useEffect, useRef } from 'react';

interface ContextMenuItem {
  id: string,
  text: string,
  callback: () => void,
}

export interface ContextMenuProps {
  parentRef?: React.MutableRefObject<any>,
  items: ContextMenuItem[],
}

interface ContextMenuState {
  visible: boolean,
  x: number,
  y: number,
}

export function ContextMenu(props: ContextMenuProps) {
  const [ state, setState ] = useState({ visible: false, x: 0, y: 0 });

  useEffect(() => {
    if (props.parentRef === null) return;
    const parent = props.parentRef.current;

    const showMenu = (e: MouseEvent) => {
      e.preventDefault();
      setState({visible: true, x: e.clientX, y: e.clientY});
    };

    const hideMenu = (e: MouseEvent) => {
      e.preventDefault();
      setState({visible: false, x: 0, y: 0});
    };

    parent.addEventListener('contextmenu', showMenu);
    window.addEventListener('click', hideMenu);

    return function cleanup() {
      parent.removeEventListener('contextmenu', showMenu);
      window.removeEventListener('click', hideMenu);
    };
  });
  
  const menuItems = props.items.map(it => {
    return (
      <li key={it.id}>
        <a 
          href="" 
          onClick={e => {
            e.preventDefault();
            it.callback();
          }}
          >
          {it.text}
        </a>
      </li>
    )
  })

  return state.visible ? (
    <div className="context-menu" style={{left: state.x, top: state.y}}>
      <ul>
        {menuItems}
      </ul>
    </div>
  ) : null;
}