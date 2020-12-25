import React, { useState, useEffect, useRef, EventHandler, useContext } from 'react';
import { Mode } from '../graph';
import { LayerProperties } from './layer-props';
import { Node } from '../vgraph';
import { AABB, Vector3D } from '../../math';

interface DebugLayerProperties extends LayerProperties {
  transform: string,
  nodes: Node<any>[],
  parentRef?: React.MutableRefObject<any>,
  position: Vector3D,
}

export function DebugLayer(props: DebugLayerProperties) {
  const { transform, graph, mode, position } = props;

  return (
    <div className="debug render layer">
      <div
        style={{ transform, transformOrigin: "0px 0px" }}
        className="render layer"
      >
        {renderNodeLabels(props.nodes)}
        {renderOriginGizmo()}
        {renderBoundingBox(graph.aabb)}
      </div>

      <div className="debug-info-overlay">
        {renderModeLabel(mode)}
        {renderPosition(position)}
      </div>

      {renderCrosshair(props.width, props.height)}
    </div>
  )
}

function renderModeLabel(mode: Mode) {
  return (
    <div className="label" style={{ minWidth: "130px" }}>
      Mode: {Mode[mode]}
    </div>
  )
}

function renderPosition(position: Vector3D) {
  const { x, y, z } = position;

  return (
    <div className="label" style={{ minWidth: "150px" }}>
      {`x: ${x.toFixed(2)} y: ${y.toFixed(2)} z: ${z.toFixed(2)}`}
    </div>
  );
}

function renderCrosshair(vpWidth: number, vpHeight: number) {
  const radius = 15;
  const centerX = vpWidth / 2;
  const centerY = vpHeight / 2;

  return (
    <svg width={vpWidth} height={vpHeight}>
      <line
        stroke="#0007"
        x1={centerX - radius}
        x2={centerX + radius}
        y1={centerY}
        y2={centerY}
      />
      <line
        stroke="#0007"
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

function renderNodeLabels(nodes: Node<any>[]) {
  const elements = nodes.map(element => <div style={{
    position: "absolute",
    padding: "10px 10px",
    fontWeight: "bold",
    minWidth: "40px",
    top: element.y + 'px',
    left: element.x + 'px',
    backgroundColor: "#AAFD",
    borderRadius: "15px",
    textAlign: "center",
  }}>{element.id}</div>)

  return <div>{elements}</div>
}

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