import * as React from 'react';
// import * as _ from 'lodash';
import classNames from 'classnames';
// import { compareWithoutFunctions, renderInput } from '@infobip/moments-components';

// import { Loader } from 'ib-loader';

function renderRegularInput(props: React.HTMLProps<HTMLInputElement>): JSX.Element {
    return <input {...props} />;
}

// function focusInput(event: React.MouseEvent<HTMLInputElement>) {
//     event.currentTarget.focus();
// }

// function renderIEInput(props: React.HTMLProps<HTMLInputElement>): JSX.Element {
//     return <input {..._.omit(props, 'onChange')} onInput={props.onChange} onMouseDown={focusInput} />;
// }

export const renderInput = renderRegularInput;

interface Props {
    className?: string;
    editable?: boolean;
    saving?: boolean;
    error?: boolean;
    success?: boolean;
    inputRef?: (inputNode: HTMLInputElement | null) => HTMLInputElement | null;
    placeholder?: string;
    value?: string | number;
    autoFocus?: boolean;
    animatedLabel?: boolean;
    errorMessage?: string;
    onChange: (value: string, name?: string) => void;
    onBlur?: (name?: string) => void;
    onEnterKey?: (name?: string) => void;
    onEscapeKey?: () => void;
    // eslint-disable-next-line @typescript-eslint/ban-types
    onEditing?: Function;
    handleDeleteRow?: () => void;
}

interface State {
    pristine: boolean;
    hover: boolean;
    editing: boolean;
    focus: boolean;
}

export class EditableLabel extends React.PureComponent<Props, State> {
    private inputNode: HTMLInputElement;

    constructor(props: Props) {
        super(props);

        this.state = {
            pristine: true,
            hover: false,
            editing: false,
            focus: false,
        };
    }

    componentDidMount() {
        if (this.props.autoFocus || (this.props.errorMessage && !this.state.pristine)) {
            this.setState({ editing: true });
            this.setOnEditing(true);
        }
    }

    // shouldComponentUpdate(nextProps: Props, nextState: State) {
    //     return compareWithoutFunctions(this.props, nextProps, this.state, nextState);
    // }

    render() {
        const { value, animatedLabel, placeholder, errorMessage, autoFocus, editable } = this.props;

        const className = classNames('editable-label', this.props.className, {
            focus: this.state.focus,
            editing: this.state.editing,
            success: this.props.success,
            error: (!this.state.pristine && this.props.error) || (!this.state.pristine && !!this.props.errorMessage),
            'with-animated-label': this.props.animatedLabel,
        });

        return (
            <div
                id={placeholder ? placeholder.replace(/ /g, '-') + '-editable-label' : 'editable-label'}
                onMouseOver={this.onMouseOver}
                onMouseLeave={this.onMouseLeave}
            >
                <div className={className}>
                    {renderInput({
                        type: 'text',
                        ref: this.setInputRef,
                        // eslint-disable-next-line eqeqeq
                        value: value == null ? '' : String(value),
                        placeholder: this.renderPlaceholder(),
                        disabled: !editable,
                        autoFocus: autoFocus,
                        onChange: this.onInputChange,
                        onFocus: this.onFocus,
                        onBlur: this.onBlur,
                        onKeyUp: this.onKeyUp,
                    })}

                    {animatedLabel && <label className="animated-label">{placeholder}</label>}

                    {this.renderStatus()}

                    <div className={this.resolveBarClassName()} />
                </div>

                {!this.state.pristine && errorMessage && <div className="error-label">{errorMessage}</div>}
            </div>
        );
    }

    private setInputRef = (inputNode: HTMLInputElement) => {
        this.inputNode = inputNode;

        if (this.props.inputRef) {
            this.props.inputRef(inputNode);
        }
    };

    private onKeyUp = (event: React.KeyboardEvent<EventTarget>) => {
        if (event.key === 'Enter' && this.props.onEnterKey) {
            this.props.onEnterKey();
        }

        if (event.key === 'Escape' && this.props.onEscapeKey) {
            this.props.onEscapeKey();
        }
    };

    private onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            pristine: false,
        });

        this.props.onChange(event.target.value);
    };

    private setOnEditing = (editing: boolean) => {
        if (this.props.onEditing) {
            this.props.onEditing(editing);
        }
    };

    private onFocus = () => {
        this.setState({ focus: true });
    };

    private onBlur = () => {
        this.setState({ focus: false });
        if (this.props.onBlur && !this.state.hover) {
            this.props.onBlur();
        }
    };

    private onMouseOver = () => {
        this.setState({ hover: true });
    };

    private onMouseLeave = () => {
        this.setState({ hover: false });
    };

    private clear = () => {
        if (!!this.props.value) {
            if (this.props.handleDeleteRow) {
                this.props.handleDeleteRow();
            }
        } else {
            this.setState({
                pristine: false,
            });
        }
        this.props.onChange('');

        if (this.state.editing) {
            this.inputNode.focus();
        }
    };

    private renderStatus = () => {
        if (this.props.saving) {
            return (
                <div className="save-loader">
                    {/* <Loader loading={true} hasOverlay={true} iconSize="1em" /> */}
                </div>
            );
        } else if (this.state.editing && !this.props.saving) {
            return <a className="icon-cancel" onClick={this.clear} />;
        } else {
            const classes = classNames({
                'icon-pencil': this.state.hover && this.props.editable,
                'icon-ok success':
                    (!this.state.pristine && !this.props.error && !this.props.errorMessage) || this.props.success,
            });
            return <span className={classes} />;
        }
    };

    private resolveBarClassName = () => {
        return classNames('editable-label__bar', {
            error: (!!this.props.errorMessage && !this.state.pristine) || !!this.props.errorMessage,
        });
    };

    private renderPlaceholder = () => {
        const { placeholder } = this.props;

        if (this.state.editing || this.props.animatedLabel) {
            return '';
        }

        return placeholder ? placeholder : '';
    };
}
