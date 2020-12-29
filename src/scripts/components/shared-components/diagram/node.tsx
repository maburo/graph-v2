import * as React from 'react';
// import * as _ from 'lodash';
import classNames from 'classnames';
import { compareWithoutFunctions } from '@infobip/moments-components';

import { Connector } from './connector';
import { Node, NodeConnector } from './types';

export interface Props extends Node {
    children: React.ReactNode;
    selected: boolean;
    zoomLevel: number;
    draggingFrom: boolean;
    draggingFromOrder?: number;
    onStartDrag: (id: number, x: number, y: number) => void;
    onStartDragConnection: (id: number, order: number, x: number, y: number, mouseX: number, mouseY: number) => void;
    onHover: (id: number) => void;
    onClick: (id: number) => void;
    onLeave: () => void;
}

export class NodeComponent extends React.Component<Props> {
    shouldComponentUpdate(nextProps: Props) {
        return compareWithoutFunctions(this.props, nextProps);
    }

    render() {
        const classes = classNames('omni-canvas-node', {
            'omni-canvas-node--hovered': this.props.hovered,
            'omni-canvas-node--selected': this.props.selected,
        });

        return (
            <div
                className={classes}
                draggable={true}
                onMouseDown={this.onMouseDown}
                onMouseOver={this.onMouseOver}
                onMouseLeave={this.onMouseLeave}
                onClick={this.onClick}
                style={{
                    position: 'absolute',
                    left: this.props.x,
                    top: this.props.y,
                    cursor: 'pointer',
                }}
            >
                {this.props.children}

                {this.props.connectors.map((connector: NodeConnector, index: number) => (
                    <Connector
                        {...connector}
                        key={index}
                        zoomLevel={this.props.zoomLevel}
                        draggingFrom={this.props.draggingFrom && this.props.draggingFromOrder === connector.order}
                        onStartDrag={this.onStartDragConnection}
                    />
                ))}
            </div>
        );
    }

    private onMouseDown = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        event.preventDefault();

        if (event.button !== 0) {
            return;
        }

        this.props.onStartDrag(this.props.id, event.clientX, event.clientY);
    };

    private onMouseOver = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        event.preventDefault();

        this.props.onHover(this.props.id);
    };

    private onMouseLeave = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        event.preventDefault();

        this.props.onLeave();
    };

    private onClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        event.preventDefault();

        this.props.onClick(this.props.id);
    };

    private onStartDragConnection = (
        order: number,
        clientX: number,
        clientY: number,
        mouseX: number,
        mouseY: number,
    ) => {
        this.props.onStartDragConnection(
            this.props.id,
            order,
            this.props.x + clientX,
            this.props.y + clientY,
            mouseX,
            mouseY,
        );
    };
}
