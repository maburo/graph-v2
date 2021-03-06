import React from 'react';
import { Mode, useNodeState } from '../graph-editor';
import { LayerProperties } from './layer-props';
import { NodeId } from '../graph';
import { AABB, Vector2D, Vector3D } from '../../math';

interface DebugLayerProperties extends LayerProperties {
  transform: string;
  nodes: NodeId[];
  parentRef?: React.MutableRefObject<any>;
  position: Vector3D;
  mouseCoords: Vector2D;
  mode: Mode;
}

export function DebugLayer(props: DebugLayerProperties) {
  const { transform, graph, mode, position, mouseCoords } = props;

  return (
    <div className="debug render layer">
      <div
        style={{ transform, transformOrigin: "0px 0px" }}
        className="render layer"
      >
        <div>
          {props.nodes.map(id => <NodeLabel id={id} />)}
        </div>

        {renderOriginGizmo()}
        {renderBoundingBox(graph.bbox)}
      </div>

      {renderGrid(transform)}

      <div className="debug-info-overlay">
        {renderLabel(Mode[mode])}
        {renderLabel(`mx: ${mouseCoords.x.toFixed(2)} my: ${mouseCoords.y.toFixed(2)}`)}
      </div>

      {renderCrosshair(props.width, props.height, `(${~~position.x}, ${~~position.y}, ${position.z.toFixed(2)})`)}
    </div>
  )
}

function renderGrid(transform: string) {
  const size = 5000;
  const step = 100;
  const lines = [];
  for (let i = -size; i < size; i += step) {
    lines.push((<line stroke="#0004" x1={-size} x2={size} y1={i} y2={i} />))
  }

  for (let i = -size; i < size; i += step) {
    lines.push((<line stroke="#0004" x1={i} x2={i} y1={-size} y2={size} />))
  }

  return (
    <svg width="100%" height="100%">
      <g transform={transform}>
        {lines}
      </g>
    </svg>
  )
}

function renderLabel(value: string, minWidth: number = 150) {
  return (
    <div className="label" style={{ minWidth: `${minWidth}px` }}>
      {value}
    </div>
  )
}

function renderCrosshair(vpWidth: number, vpHeight: number, label: string) {
  const radius = 15;
  const centerX = vpWidth / 2;
  const centerY = vpHeight / 2;
  
  return (
    <svg 
      width={vpWidth} 
      height={vpHeight} 
      style={{position: 'absolute', top: 0, left: 0}}
      >
      <text fontSize="12" x={centerX + 4} y={centerY - 6}>{label}</text>
      <line
        stroke="#000"
        x1={centerX - radius}
        x2={centerX + radius}
        y1={centerY}
        y2={centerY}
      />
      <line
        stroke="#000"
        x1={centerX}
        x2={centerX}
        y1={centerY - radius}
        y2={centerY + radius}
      />
    </svg>
  )
}

function renderOriginGizmo() {
  return (
    <svg width="100%" height="100%">
      <g>
        <line stroke="#F00" x1="0" y1="0" x2="100" y2="0" strokeWidth="4" />
        <line stroke="#F00" x1="100" y1="0" x2="85" y2="6" strokeWidth="1.5" />
        <line stroke="#00F" x1="0" y1="0" x2="0" y2="100" strokeWidth="4" />
        <line stroke="#00F" x1="0" y1="100" x2="6" y2="85" strokeWidth="1.5" />
        <rect fill="#000" x="0" y="0" width="15" height="15" />
      </g>
    </svg>
  );
}

const NodeLabel = React.memo(({ id }: { id: number }) => {
  const node = useNodeState(id);

  return (
  <div style={{
    position: "absolute",
    padding: "10px 10px",
    fontWeight: "bold",
    minWidth: "40px",
    top: node.y + 'px',
    left: node.x + 'px',
    backgroundColor: "#AAFD",
    borderRadius: "15px",
    textAlign: "center",
   }}>{node.id}</div>);
});

function renderBoundingBox(aabb: AABB) {
  return (
    <div
      className="bounding-box"
      style={{
        left: aabb.minX,
        top: aabb.minY,
        width: aabb.maxX - aabb.minX,
        height: aabb.maxY - aabb.minY,
      }}
    />)
}