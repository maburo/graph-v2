import { GraphEditor } from "../components/graph";

export default class MouseController {
  readonly onMouseMove: (e: React.MouseEvent) => void;
  readonly onMouseUp: (e: React.MouseEvent) => void;
  readonly onMouseDown: (e: React.MouseEvent) => void;
  readonly onWheel: (e: WheelEvent) => void;

  constructor(editor: GraphEditor) {
    this.onMouseMove = onMouseMoveFn.bind(editor);
    this.onMouseDown = onMouseDownFn.bind(editor);
    this.onMouseUp = onMouseUpFn.bind(editor);
    this.onWheel = onWheelFn.bind(editor);
  }
}

function onWheelFn(this: GraphEditor, e: React.WheelEvent) {
  e.preventDefault();
  this.onZoom(e.deltaY, e.clientX, e.clientY);
}

function onMouseMoveFn(this: GraphEditor, e: React.MouseEvent) {
  e.preventDefault();
  this.onMove(e.clientX, e.clientY);
}

function onMouseUpFn(this: GraphEditor, e: React.MouseEvent<unknown>) {
  e.preventDefault();
  this.onEndInteraction(e.clientX, e.clientY);
}

function onMouseDownFn(this: GraphEditor, e: React.MouseEvent<unknown>) {
  e.preventDefault();
  this.onStartInteraction(e.clientX, e.clientY);
}
