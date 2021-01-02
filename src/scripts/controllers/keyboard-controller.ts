import { GraphEditor } from "../components/graph-editor";

export default class KeyboardController {
  readonly onKeyPress: (e: React.KeyboardEvent) => void;
  readonly onKeyDown: (e: React.KeyboardEvent) => void;

  constructor(editor: GraphEditor) {
    this.onKeyPress = onKeyPressFn.bind(editor);
    this.onKeyDown = onKeyDownFn.bind(editor);
  }
}

function onKeyDownFn(this: GraphEditor, e: React.KeyboardEvent) {
  // console.log(e);
}

const platform = window.navigator.platform.toLocaleLowerCase();
if (platform.startsWith('mac')) {

} else {

}

function isUndo() {

}

function isRedo() {

}

function onKeyPressFn(this: GraphEditor, e: React.KeyboardEvent) {
  // e.preventDefault();
  
  switch (e.code) {
    case 'KeyZ':
      break;
    case 'KeyY':
      break;
  }
}

class CommandManger {
  private stack: Command[] = [];
  private maxSize: number = 10;
  private idx: number = 0;

  undo() {
    this.stack[this.idx].undo();
    this.idx -= 1;
  }

  redo() {
    this.idx += 1;
    this.stack[this.idx].execute();
  }

  add(command: Command) {
    this.stack.push(command);
    if (this.stack.length > this.maxSize) {
      this.stack.shift();
    }
    this.idx = this.stack.length - 1;
  }
}

abstract class Command {
  abstract execute(): void;
  abstract undo(): void;
}



class UndoCommand {

}

class RedoCommand {

}