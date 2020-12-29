import * as React from 'react';
// import * as _ from 'lodash';
import { compareWithoutFunctions } from '@infobip/moments-components';

// import { Localization, I18n } from 'ib-i18n';
import connectorIcon from '../../../../../assets/img/canvas/connector-connected.svg';
import schnippleIcon from '../../../../../assets/img/canvas/elements/connect-schnipple.svg';
// import { DiagramReactTooltip } from '../../utils/diagram-react-tooltip';

import { CONNECTOR_SIZE, SCHNIPPLE_SIZE } from './utils/diagram-dimensions.utils';

// const __: Localization = _.partial(I18n.__, 'Diagram');

interface Props {
    x: number;
    y: number;
    order: number;
    draggingFrom: boolean;
    zoomLevel: number;
    connectedTo?: number;
    valid?: boolean;
    onStartDrag: (order: number, clientX: number, clientY: number, mouseX: number, mouseY: number) => void;
}

export class Connector extends React.Component<Props> {
    shouldComponentUpdate(nextProps: Props) {
        return compareWithoutFunctions(this.props, nextProps);
    }

    render() {
        if (this.props.draggingFrom) {
            return null;
        }

        if (this.props.connectedTo) {
            return (
                <img
                    onMouseDown={this.onMouseDown}
                    onDragStart={this.onDragStart}
                    style={{
                        position: 'absolute',
                        left: this.props.x - CONNECTOR_SIZE / 2,
                        top: this.props.y - CONNECTOR_SIZE / 2,
                        width: CONNECTOR_SIZE,
                        height: CONNECTOR_SIZE,
                    }}
                    src={connectorIcon}
                    draggable={false}
                    alt=""
                />
            );
        }

        // TODO
        if (!this.props.valid) {
            // return null;
        }

        const style: Record<string, unknown> = {
            position: 'absolute',
            left: this.props.x + SCHNIPPLE_SIZE / 4,
            top: this.props.y - SCHNIPPLE_SIZE / 2,
            width: SCHNIPPLE_SIZE,
            height: SCHNIPPLE_SIZE,
        };

        return (
            <div
                data-tip=""
                data-for={`connector-tooltip-${this.props.order}`}
                className="ib-flow-decision-group-shnipple-wrapper"
                style={style}
                onMouseDown={this.onMouseDown}
                onDragStart={this.onDragStart}
            >
                <div className="connecting-line" />
                <button className="ib-flow-decision-shnipple ib-flow-decision-shnipple--connect">
                    <img src={schnippleIcon} />
                </button>

                {/* <DiagramReactTooltip
                    id={`connector-tooltip-${this.props.order}`}
                    place="right"
                    zoomLevel={this.props.zoomLevel}
                    className="ib-flow-tooltip flow-schnipple-tooltip"
                >
                    {__('Click to add an element or drag to connect to an existing element')}
                </DiagramReactTooltip> */}
            </div>
        );
    }

    onDragStart(event: React.MouseEvent<HTMLElement>) {
        event.preventDefault();
    }

    private onMouseDown = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        event.preventDefault();

        this.props.onStartDrag(this.props.order, this.props.x, this.props.y, event.clientX, event.clientY);
    };
}
