import { GraphEditor } from "../components/graph";

export default class TouchController {
  readonly onTouchStart: (e: React.TouchEvent) => void;
  readonly onTouchEnd: (e: React.TouchEvent) => void;
  readonly onTouchMove: (e: React.TouchEvent) => void;

  constructor(editor: GraphEditor) {
    this.onTouchStart = onTouchStartFn.bind(editor);
    this.onTouchEnd = onTouchEndFn.bind(editor);
    this.onTouchMove = onTouchMoveFn.bind(editor);
  }
}

function onTouchStartFn(this: GraphEditor, e: React.TouchEvent) {
  e.preventDefault();
  const touches = e.changedTouches;
  
  for (let i = 0; e.touches.length; i++) {
    const touch = touches.item(i);
    this.onStartInteraction(touch.clientX, touch.clientY);
    this.onMove(touch.clientX, touch.clientY);
  }
}

function onTouchEndFn(this: GraphEditor, e: React.TouchEvent) {
  e.preventDefault();
  this.onEndInteraction(0, 0);
}

function onTouchMoveFn(this: GraphEditor, e: React.TouchEvent) {
  e.preventDefault();
  const touches = e.changedTouches;
  
  for (let i = 0; e.touches.length; i++) {
    const touch = touches.item(i);
    this.onMove(touch.clientX, touch.clientY);
  }
}