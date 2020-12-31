import { FlowElementType } from '@infobip/moments-components';
import React, { useState, useEffect, useRef, EventHandler, useContext } from 'react';
import { Graph, Node} from '../graph';
import { LayerProperties } from './layer-props';
import { Vector2D } from '../../math/vector';

interface MiniMapProperties extends LayerProperties {
  top: number,
  left: number,
  width: number,
  height: number,
}

export class MiniMapLayer extends React.Component<MiniMapProperties> {
  constructor(props: MiniMapProperties) {
    super(props);
  }

  shouldComponentUpdate() {
    return true;
  }

  render() {
    return(
        <div>
          <canvas></canvas>
        </div>
    );
  }
}

function MiniMapRender() {
  const ref = useRef<HTMLCanvasElement>(null);
  const canvas = ref.current;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = "#FFF";
  ctx.fillRect(0, 0, 100, 100);

  return (<canvas ref={ref} />)
}

function render(delta:number, graph:Graph<FlowElementType>, scale: number, offset: Vector2D) {
  const ctx = this.camLayer.ctx;
  const pos: Vector2D = new Vector2D(this.camera.postion.x, this.camera.postion.y)
  .mul(scale)
  .add(offset)
  
  ctx.clearRect(0, 0, this.width, this.height);
  ctx.strokeStyle = "blue";
  const vpw = this.camera.viewportSize.x * scale / this.camera.postion.z;
  const vph = this.camera.viewportSize.y * scale / this.camera.postion.z;
  
  ctx.strokeRect((pos.x - vpw / 2), (pos.y - vph / 2), vpw, vph);
  ctx.beginPath();
  ctx.moveTo(pos.x - 10, pos.y);
  ctx.lineTo(pos.x + 10, pos.y);
  ctx.moveTo(pos.x, pos.y - 10);
  ctx.lineTo(pos.x, pos.y + 10);
  ctx.stroke();
}

function create(ctx: CanvasRenderingContext2D, graph:Graph<FlowElementType>) {
  this.graph = graph;
  const scale = Math.min(this.height / this.bbox.height, this.width / this.bbox.width);
  const center: Vector2D = new Vector2D(this.width / 2, this.height / 2 );
  const offset = center.sub(this.bbox.center.mul(scale));

  this.scale = scale;
  this.offset = offset;

  ctx.fillStyle = "#FFFFFFCC";
  ctx.fillRect(0, 0, this.width, this.height);
  ctx.fillStyle = 'black';

  ctx.fillRect(center.x-2, center.y-2, 2, 2)

  graph.nodes.forEach((n:Node<FlowElementType>) => {
    this.drawNode(n, scale, offset);
  });
}

function drawNode(ctx: CanvasRenderingContext2D, node:Node<FlowElementType>, scale:number, offset:Vector2D) {
  const x = node.x * scale + offset.x;
  const y = node.y * scale + offset.y;
  ctx.fillRect(x, y, 1, 1);
}