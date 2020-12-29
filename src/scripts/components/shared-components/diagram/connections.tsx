import * as React from 'react';
// import * as _ from 'lodash';
import classNames from 'classnames';
import { FlowElement, compareWithoutFunctions } from '@infobip/moments-components';

import removeIcon from '../../../assets/img/canvas/elements/remove-schnipple.svg';

import { Arrow, Connection } from './types';

const svgDefs = `<filter id="omni-flow-group-shadow">
        <feGaussianBlur in="SourceAlpha" stdDeviation="4"></feGaussianBlur>
        <feOffset dx="0" dy="1"></feOffset>
    </filter>
    <path id="omni-flow-decision-group-bg-default" class="omni-flow-decision-group-bg omni-flow-decision-group-bg-default" d="M60.988332 1.264372C58.04718-.260082 53.27114-.294038 50.300447 1.198728L5.362457 23.779983C2.400854 25.268183 0 29.168883 0 32.472783v57.824384c0 3.3127 2.42039 7.151135 5.422486 8.581192l44.6536 21.27087c2.994755 1.42656 7.814192 1.37209 10.776187-.127574l45.794025-23.185594C109.603066 95.339045 112 91.439434 112 88.12862V33.70153c0-3.311973-2.38475-7.232917-5.325427-8.757125L60.988333 1.264372z"></path>
    <path id="omni-flow-decision-group-bg-warning" class="omni-flow-decision-group-bg omni-flow-decision-group-bg-warning" d="M60.988332 1.264372C58.04718-.260082 53.27114-.294038 50.300447 1.198728L5.362457 23.779983C2.400854 25.268183 0 29.168883 0 32.472783v57.824384c0 3.3127 2.42039 7.151135 5.422486 8.581192l44.6536 21.27087c2.994755 1.42656 7.814192 1.37209 10.776187-.127574l45.794025-23.185594C109.603066 95.339045 112 91.439434 112 88.12862V33.70153c0-3.311973-2.38475-7.232917-5.325427-8.757125L60.988333 1.264372z"></path>
    <path id="omni-flow-decision-group-bg-danger" class="omni-flow-decision-group-bg omni-flow-decision-group-bg-danger" d="M60.988332 1.264372C58.04718-.260082 53.27114-.294038 50.300447 1.198728L5.362457 23.779983C2.400854 25.268183 0 29.168883 0 32.472783v57.824384c0 3.3127 2.42039 7.151135 5.422486 8.581192l44.6536 21.27087c2.994755 1.42656 7.814192 1.37209 10.776187-.127574l45.794025-23.185594C109.603066 95.339045 112 91.439434 112 88.12862V33.70153c0-3.311973-2.38475-7.232917-5.325427-8.757125L60.988333 1.264372z"></path>
    <path id="omni-flow-path-connector" class="omni-flow-path-connector" d="M7.071068 0l7.071068 7.071068-7.071068 7.071068L0 7.071068z"></path>
    <path id="omni-flow-path-connector-connected" class="omni-flow-path-connector connected" d="M7.071068 0l7.071068 7.071068-7.071068 7.071068L0 7.071068z"></path>
    <path id="omni-flow-path-connector-dragging" class="omni-flow-path-connector dragging" d="M7.071068 0l7.071068 7.071068-7.071068 7.071068L0 7.071068z"></path>
    <marker id="omni-flow-path-arrow" class="omni-flow-path-arrow" markerWidth="10" markerHeight="10" refX="0" refY="5" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L0,10 L5,5 z"></path>
    </marker>
    <marker id="omni-flow-path-arrow-dragging" class="omni-flow-path-arrow dragging" markerWidth="10" markerHeight="10" refX="0" refY="5" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L0,10 L5,5 z"></path>
    </marker>`;

interface Props {
    left: number;
    top: number;
    width: number;
    height: number;
    zoomLevel: number;
    connections: Connection[];
    newConnectionPath?: string;
    readonly?: boolean;
    selectedElement?: FlowElement;
    newConnectionEnd?: {
        x: number;
        y: number;
    };
    onDelete: (selectedConnection: Connection) => void;
}

interface State {
    selectedConnection?: Connection;
    x?: number;
    y?: number;
}

export class Connections extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {};
    }

    shouldComponentUpdate(nextProps: Props, nextState: State) {
        return compareWithoutFunctions(this.props, nextProps, this.state, nextState);
    }

    componentDidUpdate(prevProps: Readonly<Props>) {
        const { x, y } = this.state;
        // We should compare link to props for avoid event when change state
        if (this.props !== prevProps && (x || y)) {
            this.setState({
                x: undefined,
                y: undefined,
            });
        }
    }

    render() {
        const { width, height, connections } = this.props;
        const connectionsNodes = connections.map(this.renderConnection);

        return (
            <div>
                <svg key="links" id="omni-canvas-svg" className="omni-canvas-svg" width={width} height={height}>
                    <defs key="svgdefs" dangerouslySetInnerHTML={{ __html: svgDefs }} />

                    {connectionsNodes}

                    {this.renderNewConnection(this.props.newConnectionPath, this.props.newConnectionEnd)}
                </svg>

                {this.state.selectedConnection && this.renderDeleteButton()}
            </div>
        );
    }

    private renderConnection = (connection: Connection, index: number) => {
        const { left, top, zoomLevel, selectedElement } = this.props;

        // eslint-disable-next-line eqeqeq
        if (connection == null || !connection.path) {
            return null;
        }

        const isSelectedElementConnection =
            selectedElement && (selectedElement.id === connection.fromId || selectedElement.id === connection.toId);
        const classes = classNames('omni-flow-path', {
            'omni-flow-path--selected': isSelectedElementConnection,
        });

        return (
            <g key={index} className={classes} transform={`translate(${left},${top}) scale(${zoomLevel} ${zoomLevel})`}>
                <path className="omni-flow-path-path" d={connection.path} />
                <path
                    className="omni-flow-path-path-overlay"
                    d={connection.path}
                    onClick={this.handleConnectionClick(connection)}
                />

                {connection.arrow && this.renderArrow(connection.arrow)}
            </g>
        );
    };

    private renderNewConnection = (path?: string, end?: { x: number; y: number }) => {
        const { left, top, zoomLevel } = this.props;

        if (!path || !end) {
            return null;
        }

        return (
            <g className="omni-flow-path" transform={`translate(${left},${top}) scale(${zoomLevel} ${zoomLevel})`}>
                <path strokeDasharray="5" className="omni-flow-path-path" d={path} />
                <path className="omni-flow-new-path-overlay" d={path} />
                <circle cx={end.x} cy={end.y} r="15" fill="rgba(41, 184, 153, 0.1)" />
                <circle cx={end.x} cy={end.y} r="10" fill="rgba(41, 184, 153, 0.1)" />
                <circle cx={end.x} cy={end.y} r="5" fill="black" />
            </g>
        );
    };

    private handleConnectionClick = (selectedConnection?: Connection) => {
        if (this.props.readonly) {
            return () => {};
        }

        return (event: React.MouseEvent<SVGPathElement>) => {
            this.setState({
                selectedConnection,
                x: event.clientX,
                y: event.clientY,
            });
        };
    };

    renderArrow(arrow: Arrow) {
        let arrowPath = '';
        switch (arrow.orientation) {
            case 'DOWN':
                arrowPath = 'M-5,-5 L0,0 L5,-5';
                break;
            case 'LEFT':
                arrowPath = 'M-5,-5 L0,0 L-5,5';
                break;
            case 'RIGHT':
                arrowPath = 'M5,-5 L0,0 L5,5';
                break;
            case 'UP':
                arrowPath = 'M5,5 L0,0 L-5,5';
                break;
            case 'NONE':
                arrowPath = 'M0,0 m-5,0 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0';
                break;
        }

        return <path className="omni-flow-path-arrow" transform={`translate(${arrow.x} ${arrow.y})`} d={arrowPath} />;
    }

    private renderDeleteButton = () => {
        if (!this.state.selectedConnection) {
            return null;
        }

        const style: Record<string, unknown> = {
            position: 'absolute',
            left: (this.state.x || 0) - 75,
            top: (this.state.y || 0) - 60,
        };

        return (
            // <Dismissible onDismiss={this.onDismissDeleteButton}>
                <div style={style}>
                    <button
                        className="ib-flow-decision-shnipple ib-flow-decision-shnipple--remove"
                        onMouseDown={this.onDelete}
                    >
                        <img src={removeIcon} />
                    </button>
                </div>
            // </Dismissible>
        );
    };

    private onDismissDeleteButton = () => {
        return () => {
            this.setState({ selectedConnection: undefined });
        };
    };

    private onDelete = () => {
        if (this.state.selectedConnection) {
            this.props.onDelete(this.state.selectedConnection);
            this.setState({ selectedConnection: undefined });
        }
    };
}
