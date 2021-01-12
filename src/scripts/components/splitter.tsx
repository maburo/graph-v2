import React, { Children, useRef, useState } from 'react';

interface Props {
  children?: React.ReactNode[]
}

export default function Splitter(props: Props) {
  console.log(props.children);
  
  return (
    <div style={{
      display: 'flex'
    }}>
      {props.children.map(child => {
        return child;
      })}
    </div>
  );
}
