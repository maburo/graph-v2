// import * as React from 'react';

// interface Props {
//     zoomLevel: number;
//     onZoomIn: () => void;
//     onZoomOut: () => void;
// }

// export class Zoom extends React.PureComponent<Props> {
//     render() {
//         return (
//             <div className="ib-flow-zoom disable-user-selection">
//                 <div className="ib-flow-zoom__level disable-user-selection">
//                     {Math.round(this.props.zoomLevel * 100)}%
//                 </div>
//                 <div className="ib-flow-zoom__buttons">
//                     <button className="ib-flow-zoom__button ib-flow-zoom__button--in" onClick={this.props.onZoomIn}>
//                         {this.renderZoomInIcon()}
//                     </button>
//                     <div className="ib-flow-zoom__divider" />
//                     <button className="ib-flow-zoom__button ib-flow-zoom__button--out" onClick={this.props.onZoomOut}>
//                         {this.renderZoomOutIcon()}
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     renderZoomInIcon() {
//         return (
//             <div className="ib-flow-zoom__icon">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" width="10" height="10">
//                     <path
//                         d="M5,0 L5,10 M0,5 L10,5"
//                         fill="transparent"
//                         stroke="#8a8a8a"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                     />
//                 </svg>
//             </div>
//         );
//     }

//     renderZoomOutIcon() {
//         return (
//             <div className="ib-flow-zoom__icon">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" width="10" height="10">
//                     <path d="M0,5 L10,5" fill="transparent" stroke="#8a8a8a" strokeWidth="2" strokeLinecap="round" />
//                 </svg>
//             </div>
//         );
//     }
// }
