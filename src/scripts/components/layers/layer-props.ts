import { FlowElement } from "@infobip/moments-components";
import { Mode } from "../graph-editor";
import { Graph } from "../graph";

export interface LayerProperties {
  readonly graph: Graph<FlowElement>,
  readonly width: number,
  readonly height: number,
}