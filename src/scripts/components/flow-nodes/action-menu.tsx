import * as React from 'react';
// import * as _ from 'lodash';

import { Dropdown } from './dropdown/dropdown';
import { DropdownItem } from './dropdown/dropdown-item';
import { DropdownPlacement } from './dropdown/typings';

export interface Props {
    placement?: DropdownPlacement;
    inverseColor?: boolean;
    className?: string;
}

export class ActionMenu extends React.PureComponent<Props> {
    static Item = DropdownItem;

    render() {
        if (React.Children.count(this.props.children) === 0) {
            return null;
        }

        return (
            <Dropdown
                placement={this.props.placement}
                buttonInverseColor={this.props.inverseColor}
                className={this.props.className}
                label={this.renderEllipsis()}
            >
                {this.props.children}
            </Dropdown>
        );
    }

    private renderEllipsis = () => {
        return (
            <svg width="3px" height="15px" viewBox="0 0 3 15">
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g fill={this.props.inverseColor ? '#545454' : '#ffffff'}>
                        <g>
                            <circle cx="1.5" cy="1.5" r="1.5" />
                            <circle cx="1.5" cy="7.5" r="1.5" />
                            <circle cx="1.5" cy="13.5" r="1.5" />
                        </g>
                    </g>
                </g>
            </svg>
        );
    };
}
