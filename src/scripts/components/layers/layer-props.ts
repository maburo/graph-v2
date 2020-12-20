import { FlowElement } from "@infobip/moments-components";
import { Mode } from "../graph";
import { Graph } from "../vgraph";

export interface LayerProperties {
  readonly graph: Graph<FlowElement>,
  readonly mode: Mode,
  readonly width: number,
  readonly height: number,
}