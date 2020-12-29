// import * as React from 'react';
// // import * as _ from 'lodash';
// import { observer } from 'mobx-react';
// import { FlowElementType, FlowElement } from '@infobip/moments-components';

// import { MainStore } from '../../model/main.store';
// import { haveIntersection, narrowAABB } from '../../utils/math/aabb';
// import { AABB, Point } from '../../utils/math/types';

// import {
//     NECESSARILY_VISIBLE_FLOW_SIZE,
//     NODE_TRANSFORM_DELTA_X,
//     NODE_TRANSFORM_DELTA_Y,
//     storeDiagramPosition,
// } from './utils/diagram-dimensions.utils';
// import { calculateCanvasStyle } from './utils/diagram-calculator.utils';
// import { NodeComponent, Props as NodeProps } from './node';
// import { Connections } from './connections';
// import { NodeType } from './types';

// interface Props {
//     store: MainStore;
//     readonly?: boolean;
//     children: React.ReactNode[];
// }

// interface State {
//     dragNewConnection: boolean;
//     dragDiagram: boolean;
//     mouseX: number;
//     mouseY: number;
//     newStartX?: number;
//     newStartY?: number;
//     hoverId?: number;
//     dragFrom?: number;
//     dragElementId?: number;
//     dragFromOrder?: number;
//     newConnectionEnd?: { x: number; y: number };
//     newConnectionPath?: string;
// }

// @observer
// export class Diagram extends React.Component<Props, State> {
//     private view: HTMLElement | null;
//     private releaseTimeout: NodeJS.Timer;
//     private resizeDebounced = _.debounce(() => this.updateDiagramViewportDimensions(), 300);

//     constructor(props: Props) {
//         super(props);

//         this.state = {
//             dragNewConnection: false,
//             dragDiagram: false,
//             mouseX: 0,
//             mouseY: 0,
//         };
//     }

//     componentDidMount() {
//         const ownerDocument = (this.view && this.view.ownerDocument) || document;
//         ownerDocument.addEventListener('mouseup', this.releaseDrag);

//         window.addEventListener('resize', this.resizeDebounced);
//         window.addEventListener('beforeunload', this.storePosition);
//         this.updateDiagramViewportDimensions();
//     }

//     componentWillUnmount() {
//         const ownerDocument = (this.view && this.view.ownerDocument) || document;
//         ownerDocument.removeEventListener('mouseup', this.releaseDrag);

//         window.removeEventListener('resize', this.resizeDebounced);
//         window.removeEventListener('beforeunload', this.storePosition);

//         this.storePosition();
//     }

//     render() {
//         const store = this.props.store;
//         const { width, height, centerX, centerY, zoomLevel } = store.diagramDimensions;

//         // TODO
//         const bgStyle: Record<string, unknown> = {
//             position: 'absolute',
//             left: -width + (centerX % width),
//             top: -height + (centerY % height),
//             width: 3 * width,
//             height: 3 * height,
//             zIndex: -1,
//         };

//         const canvasStyle = calculateCanvasStyle(store.diagramDimensions);
//         const visibleNodes = this.getVisibleNodes(store.diagram.aabb).map(this.wrapChildComponent);
//         const visibleConnections = this.getVisibleConnections(store.diagram.aabb);

//         return (
//             <div
//                 ref={this.setViewRef}
//                 className="tf-omni-canvas omni-canvas"
//                 onMouseDown={this.onStartDragDiagram}
//                 onMouseMove={this.onMouseMove}
//             >
//                 <div key="canvasbackground" className="omni-canvas-bg" style={bgStyle} />

//                 <Connections
//                     left={width / 2 + centerX}
//                     top={height / 2 + centerY}
//                     width={width}
//                     height={height}
//                     zoomLevel={zoomLevel}
//                     connections={visibleConnections}
//                     newConnectionPath={this.state.newConnectionPath}
//                     newConnectionEnd={this.state.newConnectionEnd}
//                     readonly={this.props.readonly}
//                     selectedElement={this.props.store.selectedElement}
//                     onDelete={this.props.store.deleteConnection}
//                 />

//                 <div style={canvasStyle}>{visibleNodes}</div>
//             </div>
//         );
//     }

//     private setViewRef = (view: HTMLElement | null) => {
//         this.view = view;
//     };

//     private wrapChildComponent = (child: React.Component<NodeProps>) => {
//         const id = child.props.id;
//         const node = this.props.store.diagram.nodes[id];

//         const selectedElement = this.props.store.selectedElement;
//         const selected = !!selectedElement && id === selectedElement.id;

//         const nodeContent = (
//             <NodeComponent
//                 {...node}
//                 id={id}
//                 key={id}
//                 selected={selected}
//                 hovered={id === this.state.hoverId}
//                 draggingFrom={this.state.dragFrom === id}
//                 draggingFromOrder={this.state.dragFromOrder}
//                 zoomLevel={this.props.store.diagramDimensions.zoomLevel}
//                 onHover={this.onNodeHover}
//                 onClick={this.onNodeClick}
//                 onLeave={this.onNodeLeave}
//                 onStartDrag={this.props.readonly ? _.noop : this.onStartDragElement}
//                 onStartDragConnection={this.props.readonly ? _.noop : this.onStartDragNewConnection}
//             >
//                 {child}
//             </NodeComponent>
//         );

//         if (node.type === NodeType.MENU_ELEMENT) {
//             return (
//                 <Dismissible key={id} closeOnElementRemoved={true} onDismiss={this.onMenuDismissed(id)}>
//                     {nodeContent}
//                 </Dismissible>
//             );
//         }

//         return nodeContent;
//     };

//     private onMenuDismissed = (id: number) => {
//         return () => {
//             this.props.store.deleteElement(id);
//         };
//     };

//     private onStartDragDiagram = (event: React.MouseEvent<HTMLElement>) => {
//         event.stopPropagation();

//         if (event.button !== 0) {
//             return;
//         }

//         this.setState({
//             dragDiagram: true,
//             mouseX: event.clientX,
//             mouseY: event.clientY,
//         });
//     };

//     private onStartDragElement = (id: number, mouseX: number, mouseY: number) => {
//         this.setState({
//             dragElementId: id,
//             mouseX,
//             mouseY,
//         });
//     };

//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     private onStartDragNewConnection = (
//         id: number,
//         order: number,
//         x: number,
//         y: number,
//         mouseX: number,
//         mouseY: number,
//     ) => {
//         const { width, height, centerX, centerY, zoomLevel } = this.props.store.diagramDimensions;

//         this.props.store.closeEditor();

//         this.setState({
//             dragNewConnection: true,
//             dragFrom: id,
//             dragFromOrder: order,
//             newStartX: x,
//             newStartY: y,
//             mouseX: x * zoomLevel + width / 2 + centerX + NODE_TRANSFORM_DELTA_X,
//             mouseY: y * zoomLevel + height / 2 + centerY + NODE_TRANSFORM_DELTA_Y,
//         });
//     };

//     private onNodeHover = (id: number) => {
//         if (this.state.dragNewConnection) {
//             this.setState({
//                 hoverId: id,
//             });
//         }
//     };

//     private onNodeLeave = () => {
//         if (this.state.dragNewConnection) {
//             this.setState({
//                 hoverId: undefined,
//             });
//         }
//     };

//     private onNodeClick = (id: number) => {
//         this.props.store.selectElement(id);
//     };

//     private onMouseMove = (event: React.MouseEvent<HTMLElement>) => {
//         event.stopPropagation();

//         if (event.button !== 0) {
//             return;
//         }

//         const deltaX = event.clientX - this.state.mouseX;
//         const deltaY = event.clientY - this.state.mouseY;
//         const zoomLevel = this.props.store.diagramDimensions.zoomLevel;

//         if (this.state.dragDiagram) {
//             const { x, y } = this.clampNewPosition(deltaX, deltaY);
//             this.props.store.moveDiagram(x, y);

//             this.setState({ mouseX: this.state.mouseX + x, mouseY: this.state.mouseY + y });
//         }

//         if (this.state.dragNewConnection) {
//             this.setState(prevState => ({
//                 newConnectionPath:
//                     'M ' +
//                     prevState.newStartX +
//                     ' ' +
//                     prevState.newStartY +
//                     ' l ' +
//                     deltaX / zoomLevel +
//                     ' ' +
//                     deltaY / zoomLevel,
//                 newConnectionEnd: {
//                     x: (prevState.newStartX ?? 0) + deltaX / zoomLevel,
//                     y: (prevState.newStartY ?? 0) + deltaY / zoomLevel,
//                 },
//             }));
//         }

//         if (this.state.dragElementId) {
//             if (deltaX === 0 && deltaY === 0) {
//                 return;
//             }

//             this.props.store.moveElement(this.state.dragElementId, deltaX / zoomLevel, deltaY / zoomLevel);
//             this.setState({ mouseX: event.clientX, mouseY: event.clientY });
//         }
//     };

//     private releaseDrag = (event: MouseEvent) => {
//         if (this.state.dragElementId) {
//             event.stopPropagation();
//         }

//         if (event.button !== 0) {
//             return;
//         }

//         if (this.state.dragNewConnection) {
//             if (this.state.hoverId) {
//                 // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//                 this.props.store.addNewConnection(this.state.dragFrom!, this.state.dragFromOrder!, this.state.hoverId);
//             } else {
//                 const node = this.state.newConnectionEnd || {
//                     x: (this.state.newStartX ?? 0) + 100,
//                     y: (this.state.newStartY ?? 0) - 20,
//                 };
//                 this.props.store.addNewElement(
//                     this.state.dragFrom!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
//                     this.state.dragFromOrder!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
//                     node,
//                     FlowElementType.NEW_ELEMENT,
//                 );
//             }
//         }

//         clearTimeout(this.releaseTimeout);
//         this.releaseTimeout = setTimeout(this.props.store.setPreventClickOnDiagram, 500);

//         this.setState({
//             newConnectionPath: undefined,
//             newConnectionEnd: undefined,
//             dragNewConnection: false,
//             dragDiagram: false,
//             dragFrom: undefined,
//             dragFromOrder: undefined,
//             dragElementId: undefined,
//             hoverId: undefined,
//         });
//     };

//     private updateDiagramViewportDimensions() {
//         if (this.view) {
//             const style = getComputedStyle(this.view);
//             const width =
//                 this.view.offsetWidth + parseInt(style.marginLeft || '0', 10) + parseInt(style.marginRight || '0', 10);
//             const height =
//                 this.view.offsetHeight + parseInt(style.marginTop || '0', 10) + parseInt(style.marginBottom || '0', 10);
//             this.props.store.updateDimensions(width, height);
//         }
//     }

//     private storePosition = () => {
//         const {
//             diagramDimensions: { centerY, centerX, zoomLevel },
//             campaign: { communicationId },
//         } = this.props.store;

//         communicationId && storeDiagramPosition({ centerX, centerY, zoomLevel }, communicationId);
//     };

//     private getVisibleNodes = (diagramAABB: AABB) => {
//         const {
//             store: { diagram },
//             children,
//         } = this.props;

//         return children.filter((ch: React.Component<FlowElement>) => {
//             const element = ch.props;
//             const node = diagram.nodes[element.id];

//             return haveIntersection(diagramAABB, node.aabb);
//         });
//     };

//     private getVisibleConnections = (diagramAABB: AABB) => {
//         return this.props.store.diagram.connections.filter(con => haveIntersection(con.aabb, diagramAABB));
//     };

//     clamp(val: number, min: number, max: number): number {
//         if (val < min) return min;
//         if (val > max) return max;
//         return val;
//     }

//     private clampNewPosition(deltaX: number, deltaY: number): Point {
//         const {
//             diagram: { flowAABB },
//             diagramDimensions: { zoomLevel, centerY, centerX, width, height },
//         } = this.props.store;
//         const newCenterX = centerX + deltaX;
//         const newCenterY = centerY + deltaY;

//         if (!flowAABB) {
//             return { x: deltaX, y: deltaY };
//         }

//         const { min, max } = narrowAABB(flowAABB, NECESSARILY_VISIBLE_FLOW_SIZE);

//         const centerArea = {
//             min: {
//                 x: -min.x * zoomLevel + width / 2,
//                 y: -min.y * zoomLevel + height / 2,
//             },
//             max: {
//                 x: -max.x * zoomLevel - width / 2,
//                 y: -max.y * zoomLevel - height / 2,
//             },
//         };

//         return {
//             x: this.clamp(newCenterX, centerArea.max.x, centerArea.min.x) - centerX,
//             y: this.clamp(newCenterY, centerArea.max.y, centerArea.min.y) - centerY,
//         };
//     }
// }
