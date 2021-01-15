import { NodesLayer } from './nodes-layer';
import { SelectLayer } from './select-layer';
import { EdgesLayer, EdgeProperties } from './edges-layer';
import { BezierEdgeRender } from './edge-renders/bezier';
import { StraightEdgeRender } from './edge-renders/straight';
import { DebugLayer } from './debug-layer';
import { MiniMapLayer } from './mini-map';

const EdgeRender = {
  bezier: BezierEdgeRender,
  straight: StraightEdgeRender
}

export {
  NodesLayer,
  SelectLayer,
  EdgesLayer,
  EdgeProperties,
  EdgeRender,
  DebugLayer,
  MiniMapLayer,
}