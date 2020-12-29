import * as React from 'react';
import classNames from 'classnames';
// import * as _ from 'lodash';

// import { Localization, I18n } from 'ib-i18n';

// const __: Localization = _.partial(I18n.__, 'Popover');
const __ = (s: string) => s;

export enum PopoverState {
    OPEN,
    LOADING,
    SUCCESS,
    ERROR,
}

export interface PopoverProps {
    popoverTitle?: string;
    actionButtonTitle?: string;
    loadingMessage?: string | JSX.Element;
    successMessage?: string | JSX.Element;
    errorMessage?: string | JSX.Element;
    className?: string;

    // eslint-disable-next-line @typescript-eslint/ban-types
    onPopoverAction: () => Promise<void | object>;
    onClose: () => void;
}

export interface State {
    popoverState: PopoverState;
}

export class Popover extends React.Component<PopoverProps, State> {
    popover?: HTMLElement;

    constructor(props: PopoverProps) {
        super(props);

        this.state = {
            popoverState: PopoverState.OPEN,
        };
    }

    componentDidMount() {
        document.addEventListener('keydown', this.onKeydown);
        document.addEventListener('click', this.onOutsideClick);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.onKeydown);
        document.removeEventListener('click', this.onOutsideClick);
    }

    render(): JSX.Element | null {
        switch (this.state.popoverState) {
            case PopoverState.OPEN:
                return this.renderForm();
            case PopoverState.SUCCESS:
                return this.renderSuccessMessage();
            case PopoverState.ERROR:
                return this.renderErrorMessage();
            case PopoverState.LOADING:
                return this.renderLoader();
            default:
                return null;
        }
    }

    private renderForm = () => {
        return (
            <div
                ref={node => {
                    this.popover = node ? node : undefined;
                }}
                className={classNames('flow-action-popover', this.props.className)}
                onClick={this.stopPropagation}
            >
                {this.props.popoverTitle && <h4 className="flow-action-popover-title">{this.props.popoverTitle}</h4>}

                {this.props.children}

                <div className="flow-action-popover-buttons">
                    <span id="close" className="btn btn-link tf-popover-exit-btn" onClick={this.onCancel}>
                        {__('Cancel')}
                    </span>
                    {this.props.actionButtonTitle && (
                        <span id="action" className="btn primary-btn tf-popover-action-btn" onClick={this.onAction}>
                            {this.props.actionButtonTitle}
                        </span>
                    )}
                </div>
            </div>
        );
    };

    private renderLoader = () => {
        return (
            <div className={classNames('flow-action-popover', this.props.className)} onClick={this.stopPropagation}>
                <div className="text-center">
                    {this.props.loadingMessage && <p>{this.props.loadingMessage}</p>}
                    <svg className="spin-new" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                        <circle className="spin-new-circle" fill="none" strokeLinecap="round" cx="33" cy="33" r="30" />
                    </svg>
                </div>
            </div>
        );
    };

    private renderSuccessMessage = () => {
        return this.renderMessage(this.props.successMessage);
    };

    private renderErrorMessage = () => {
        return this.renderMessage(this.props.errorMessage);
    };

    private renderMessage = (message?: string | JSX.Element) => {
        let msg;

        if (typeof message === 'string') {
            msg = <p>{message}</p>;
        } else {
            msg = message;
        }

        return (
            <div
                ref={node => {
                    this.popover = node ? node : undefined;
                }}
                className={classNames('flow-action-popover', this.props.className)}
                onClick={this.stopPropagation}
            >
                <h4 className="flow-action-popover-title">{this.props.popoverTitle}</h4>

                {msg}

                <div className="flow-action-popover-buttons">
                    <a id="close" className="btn btn-link tf-popover-exit-btn" onClick={this.closePopover}>
                        {__('Close')}
                    </a>
                </div>
            </div>
        );
    };

    private closePopover = (event?: React.MouseEvent<EventTarget>) => {
        if (event) {
            event.preventDefault();
        }
        this.props.onClose();
    };

    private onCancel = (event?: React.MouseEvent<EventTarget>) => {
        this.closePopover(event);
    };

    private onKeydown = (event: KeyboardEvent) => {
        if (event.key == 'Escape') {
            this.closePopover();
        }
    };

    private onOutsideClick = (event: MouseEvent) => {
        if (!!this.popover && !this.popover.contains(event.target as Element)) {
            event.preventDefault();
            this.props.onClose();
        }
    };

    private onAction = (event?: React.MouseEvent<EventTarget>) => {
        if (event) {
            event.preventDefault();
        }

        setTimeout(() => {
            this.setState(
                {
                    popoverState: PopoverState.LOADING,
                },
                () => {
                    this.props
                        .onPopoverAction()
                        .then(() => {
                            if (this.props.successMessage) {
                                this.setState({ popoverState: PopoverState.SUCCESS });
                            } else {
                                this.props.onClose();
                            }
                        })
                        .catch(() => {
                            if (this.props.errorMessage) {
                                this.setState({ popoverState: PopoverState.ERROR });
                            } else {
                                this.props.onClose();
                            }
                        });
                },
            );
        }, 0);
    };

    stopPropagation(event?: React.MouseEvent<EventTarget>) {
        event?.stopPropagation();
    }
}
