import React, { useRef, useState } from 'react';
import { start } from 'repl';

interface State {
  width: number;
  node?: any;
}

export default function Editor() {
  const [ state, setState ] = useState<State>({ width: 1000 });
  
  return (
    <div style={{width: state.width, display: 'flex'}}>
      <div 
        style={{
          width: '5px', 
          backgroundColor: '#333',
          cursor: 'pointer',
        }}
        onMouseDown={startResize.bind({width: state.width, setState})}
        />

      <div>
        <textarea></textarea>
      </div>
    </div>
  );
}

function startResize(e: MouseEvent) {
  const startX = e.screenX;
  const { width, setState } = this;
  console.log(width, startX);
  

  function resize(re: MouseEvent) {
    setState((prev: State) => {
      const diff = startX - re.screenX;
      console.log(re.screenX, diff);
      
      return { width: width + diff };
    });
  }

  function onMouseMove(e1: MouseEvent) {
    resize(e1);
  }

  function onMouseUp(e: MouseEvent) {
    console.log('remove');
    
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  }

  console.log('add event');
  
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
}