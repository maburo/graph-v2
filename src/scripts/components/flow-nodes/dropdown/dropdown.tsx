import * as React from 'react';
import classNames from 'classnames';

import { Dismissible } from '../dismissible/dismissible';
// import { compareWithoutFunctions } from '../../utilities/compare.utils';
import { DropdownPlacement } from './typings';

import { DropdownItem } from './dropdown-item';

interface Props {
    noCaret?: boolean;
    placement?: DropdownPlacement;
    label: React.ReactNode;
    type?: 'submit' | 'reset' | 'button';
    className?: string;
    buttonClassName?: string;
    buttonInverseColor?: boolean;
    disabled?: boolean;
}

interface State {
    open: boolean;
}

export class Dropdown extends React.Component<Props, State> {
    static displayName = 'Dropdown';

    static Item = DropdownItem;

    static defaultProps = {
        type: 'button',
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            open: false,
        };
    }

    // shouldComponentUpdate(nextProps: Props, nextState: State) {
    //     return compareWithoutFunctions(this.props, nextProps, this.state, nextState);
    // }

    render() {
        const { open } = this.state;

        const containerClasses = classNames(this.props.className, {
            'ib-flow-dropdown': !this.props.noCaret,
            relative: this.props.noCaret,
            'is-open': open,
        });

        const placementClass = !this.props.placement
            ? 'dropdown-menu--bottom-right'
            : `dropdown-menu--${this.props.placement}`;

        const menuClasses = classNames('dropdown-menu', { 'is-open': open }, placementClass);

        const buttonClasses = classNames('dropdown-button', this.props.buttonClassName, {
            inverse: this.props.buttonInverseColor,
            'is-open': open,
        });

        return (
            <Dismissible className={containerClasses} onDismiss={open ? this.toggleDropdown : null}>
                <div>
                    <button type={this.props.type} className={buttonClasses} onClick={this.toggleDropdown}>
                        {this.props.label}
                    </button>
                    <ul className={menuClasses} onClick={this.handleListClick}>
                        {this.props.children}
                    </ul>
                </div>
            </Dismissible>
        );
    }

    private toggleDropdown = (event: React.SyntheticEvent<EventTarget>) => {
        event.stopPropagation();

        if (!this.props.disabled) {
            this.setState(prevState => ({ open: !prevState.open }));
        }
    };

    private handleListClick = (event: React.SyntheticEvent<EventTarget>) => {
        this.toggleDropdown(event);
    };
}
