// import * as React from 'react';
// import * as _ from 'lodash';

// import { MainStore } from '../../model/main.store';

// import { Zoom } from './zoom';

// interface Props {
//     store: MainStore;
//     displayZoom: boolean;
//     zoomLevel: number;
//     children: React.ReactNode;
// }

// const ALLOWED_ZOOM_VALUES = [0.25, 0.5, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 2];

// export class Zoomable extends React.Component<Props> {
//     render() {
//         return (
//             <div className="zoomable">
//                 {this.props.displayZoom && (
//                     <Zoom zoomLevel={this.props.zoomLevel} onZoomIn={this.increaseZoom} onZoomOut={this.decreaseZoom} />
//                 )}
//                 {this.props.children}
//             </div>
//         );
//     }

//     private increaseZoom = () => {
//         const currentZoomLevel = this.props.store.diagramDimensions.zoomLevel;
//         const currentZoomLevelIndex = _.indexOf(ALLOWED_ZOOM_VALUES, currentZoomLevel);
//         const newZoomLevelIndex = Math.min(ALLOWED_ZOOM_VALUES.length - 1, currentZoomLevelIndex + 1);
//         this.props.store.setZoom(ALLOWED_ZOOM_VALUES[newZoomLevelIndex]);
//     };

//     private decreaseZoom = () => {
//         const currentZoomLevel = this.props.store.diagramDimensions.zoomLevel;
//         const currentZoomLevelIndex = _.indexOf(ALLOWED_ZOOM_VALUES, currentZoomLevel);
//         const newZoomLevelIndex = Math.max(0, currentZoomLevelIndex - 1);
//         this.props.store.setZoom(ALLOWED_ZOOM_VALUES[newZoomLevelIndex]);
//     };
// }
