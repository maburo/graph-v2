import * as React from 'react';
import classNames from 'classnames';
import { compareWithoutFunctions } from '@infobip/moments-components';

interface Props {
    children: React.ReactElement<HTMLElement>;
    onClose: () => void;
}

interface State {
    openSearchBox: boolean;
}

export class SearchWrapper extends React.Component<Props, State> {
    private inputNode: HTMLInputElement;

    constructor(props: Props) {
        super(props);

        this.state = {
            openSearchBox: false,
        };
    }

    shouldComponentUpdate(nextProps: Props, nextState: State) {
        return compareWithoutFunctions(this.props, nextProps, this.state, nextState);
    }

    render() {
        return (
            <div className="ib-cx-search" data-open={this.state.openSearchBox} data-empty="true">
                {this.renderChild()}
                <div className="ib-cx-search-actions">
                    <span className="ib-cx-search-btn" onClick={this.handleSearchBoxOpen}>
                        <i className="tf-icon-search icon-search" />
                    </span>
                    <span className="ib-cx-search-close" onClick={this.handleSearchBoxClose}>
                        <i className="icon-cancel" />
                    </span>
                </div>
            </div>
        );
    }

    private renderChild = () => {
        const defaultClassNames = 'ib-cx-search-input form-control';
        return React.cloneElement(this.props.children, {
            ref: this.handleRef,
            className: classNames(this.props.children.props.className, defaultClassNames),
        });
    };

    private handleRef = (inputNode: HTMLInputElement) => {
        this.inputNode = inputNode;
    };

    private handleSearchBoxOpen = () => {
        this.setState(
            {
                openSearchBox: true,
            },
            this.setInputFocus,
        );
    };

    private setInputFocus = () => {
        this.inputNode.focus();
    };

    private handleSearchBoxClose = () => {
        this.setState(
            {
                openSearchBox: false,
            },
            this.props.onClose,
        );
    };
}
