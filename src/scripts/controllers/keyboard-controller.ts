import { GraphEditor } from "../components/graph-editor";

export const enum Platform {
  Win, Mac
}

const PLATFORM = window.navigator.platform.toLocaleLowerCase().startsWith('mac') ? Platform.Mac : Platform.Win;

interface KeyModifiers {
  readonly shiftKey?: boolean;
  readonly ctrlKey?: boolean;
  readonly metaKey?: boolean;
  readonly altKey?: boolean;
}

interface KeyAction {
  readonly modifiers: number;
  readonly command: (graph: GraphEditor) => void;
}

export interface KeyMappingSettings {
  keys: string[],
  modifiers?: KeyModifiers,
  platform?: Platform,
  action: (graph: GraphEditor) => void,
}

export default class KeyboardController {
  readonly onKeyPress: (e: React.KeyboardEvent) => void;
  readonly onKeyDown: (e: React.KeyboardEvent) => void;

  constructor(editor: GraphEditor, settings: KeyMappingSettings[]) {
    const keyMapping = mapKeys(settings);
    this.onKeyDown = onKeyDownFn.bind(editor, keyMapping);
  }
}

function extractActions(settings: KeyMappingSettings) {
  return settings.keys.map(key => ({
    key,
    modifiers: settings.modifiers,
    action: settings.action,
  }));
}

function mapKeys(settings: KeyMappingSettings[]) {
  return settings
    .filter(({ platform }) => !platform || platform === PLATFORM)
    .flatMap(extractActions)
    .reduce((acc, {key, action, modifiers}) => {
      return acc.set(key, {
        command: action,
        modifiers: modifiersBits(modifiers),
      })
    }, new Map<string, KeyAction>());
}


function onKeyDownFn(this: GraphEditor, keymap: Map<string, KeyAction>, e: React.KeyboardEvent) {
  const action = keymap.get(e.code);

  if (action && !(action.modifiers ^ modifiersBits(e))) {
    e.preventDefault();
    e.stopPropagation();
    action.command(this);
  }
}

function modifiersBits(modifiers?: KeyModifiers) {
  if (modifiers) {
    return (modifiers.shiftKey && 0x0001) 
         | (modifiers.ctrlKey && 0x0010) 
         | (modifiers.altKey && 0x0100) 
         | (modifiers.metaKey && 0x1000);
  }

  return 0;
}

export function undo(graph: GraphEditor) {

}

function zoomIn(graph: GraphEditor) {
  graph.zoom(.25);
}

function zoomOut(graph: GraphEditor) {
  graph.zoom(-.25);
}

function deleteNode(graph: GraphEditor) {
  graph.deleteSelectedNodes();
}

export const keyActions = {
  zoomIn,
  zoomOut,
  deleteNode,
}

export function defaultKeyMapping() {
  return [
    { 
      keys:['KeyF'], 
      action: () => {
        console.log('focus');
      },
    },
    { 
      keys:['Minus', 'NumpadSubtract'], 
      action: keyActions.zoomOut,
    },
    { 
      keys:['Equal', 'NumpadAdd'], 
      action: keyActions.zoomIn,
    },
    { 
      keys:['Delete'], 
      action: keyActions.deleteNode,
    },
    { 
      keys:['KeyZ'], 
      modifiers: {ctrlKey: true}, 
      action: () => { 
        console.log('undo');
      },
      platform: Platform.Win 
    },
    { 
      keys:['KeyY'], 
      modifiers: {ctrlKey: true}, 
      action: () => {
        console.log('redo');
      },
      platform: Platform.Win 
    },
    { 
      keys:['KeyZ'], 
      modifiers: {metaKey: true}, 
      action: () => {
        console.log('undo mac');
      }, 
      platform: Platform.Mac 
    },
    { 
      keys:['KeyZ'], 
      modifiers: {metaKey: true, shiftKey: true}, 
      action: () => {
        console.log('redo mac');
      }, 
      platform: Platform.Mac 
    },
  ]
}

// class CommandManger {
//   private stack: Command[] = [];
//   private maxSize: number = 10;
//   private idx: number = 0;

//   undo() {
//     this.stack[this.idx].undo();
//     this.idx -= 1;
//   }

//   redo() {
//     this.idx += 1;
//     this.stack[this.idx].execute();
//   }

//   add(command: Command) {
//     this.stack.push(command);
//     if (this.stack.length > this.maxSize) {
//       this.stack.shift();
//     }
//     this.idx = this.stack.length - 1;
//   }
// }

// abstract class Command {
//   abstract execute(): void;
//   abstract undo(): void;
// }



// class UndoCommand {

// }

// class RedoCommand {

// }