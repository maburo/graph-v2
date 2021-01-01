import * as React from 'react';
// import * as _ from 'lodash';
import classNames from 'classnames';
import {
    FlowElementApi,
    FlowElementComponentProps,
    FlowElementType,
    areEqualWithoutFunctions,
} from '@infobip/moments-components';
// import ReactTooltip from 'react-tooltip';

// import { I18n, Localization } from 'ib-i18n';

import { InformationMessage } from '../common/information-message/information-message';
import { getStartOptions } from '../start/start-creator/start-creator';

// const __: Localization = _.partial(I18n.__, 'Editor.Footer');
const __ = (s: string) => s;

interface PanelProps extends FlowElementComponentProps {
    elementApi: FlowElementApi | null;
    isEditingFlow?: boolean;
}

interface PanelState {
    hasError: boolean;
}

export class FlowElementEditor extends React.Component<PanelProps, PanelState> {
    state = {
        hasError: false,
    };

    get isEditingStartElement() {
        const entryPoints = getStartOptions(this.props.config).map(elem => elem.type);
        return this.props.isEditingFlow && entryPoints.includes(this.props.element.type as FlowElementType);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static getDerivedStateFromError(error: Error) {
        return { hasError: true };
    }

    shouldComponentUpdate(nextProps: PanelProps): boolean {
        if (this.props && this.props.element && nextProps && nextProps.element) {
            // Re-render when element is duplicated
            if (this.props.element.id !== nextProps.element.id) {
                return true;
            }

            // Don't re-render editor if X and/or Y coordinates of canvas preview element are changed
            if (
                this.props.element.diagramX !== nextProps.element.diagramX ||
                this.props.element.diagramY !== nextProps.element.diagramY
            ) {
                return false;
            }
        }

        return !areEqualWithoutFunctions(this.props, nextProps, ['config', 'elementApi']);
    }

    render() {
        const flowElementApi = this.props.elementApi;
        const flowElementType = this.props.element.type;

        if (flowElementApi === null || flowElementType === FlowElementType.EXIT) {
            return null;
        }

        return (
            <div className="tf-omni-editor omni-editor wider-sidepanel" id="omni-editor-main">
                <div
                    id={this.generateId()}
                    className={classNames('omni-editor-body', {
                        'failover-action': flowElementType === FlowElementType.FAILOVER_ACTION,
                    })}
                >
                    {/* <div className="omni-editor-content" id="omni-editor-content">
                        {!this.state.hasError ? (
                            flowElementApi.getEditorComponent(this.props)
                        ) : (
                            <InformationMessage type="error" className="omni-editor__error-message">
                                <InformationMessage.Title>{__('Unexpected error')}</InformationMessage.Title>
                                <InformationMessage.Text>
                                    {__(
                                        'An unexpected error occured while displaying component.' +
                                            ' Please reload the page or contact customer service.',
                                    )}
                                </InformationMessage.Text>
                            </InformationMessage>
                        )}
                    </div> */}
                </div>

                {flowElementType !== FlowElementType.FAILOVER_ACTION && (
                    <div className="omni-editor-footer clearfix">
                        {this.renderDeleteButton()}
                        <div className="pull-right">
                            <a
                                className="tf-omni-editor-footer-action omni-editor-footer-action"
                                onClick={this.props.onClose}
                            >
                                {__('Close')}
                            </a>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    renderDeleteButton() {
        if (this.props.readOnly) return null;

        const classes = classNames(`tf-omni-editor-footer-action omni-editor-footer-action`, {
            'omni-editor-footer-action__disabled': this.isEditingStartElement,
            'text-danger': !this.isEditingStartElement,
        });

        return (
            <>
                <div className="pull-left" data-tip data-for="flow-elements-editor_delete-tooltip">
                    <a className={classes} onClick={this.onDelete}>
                        {__('Delete')}
                    </a>
                </div>
                {/* {this.isEditingStartElement && (
                    <ReactTooltip
                        id="flow-elements-editor_delete-tooltip"
                        place="top"
                        effect="solid"
                        className="ib-flow-tooltip"
                        offset={{ bottom: -15 }}
                    >
                        {__('You can’t delete entry points that are in the original version of this flow.')}
                    </ReactTooltip>
                )} */}
            </>
        );
    }

    private generateId = (): string => {
        let id = `flow-element-editor-${this.props.element.type}`;

        if (this.props.element.type === FlowElementType.SEND_ACTION) {
            id += `-${this.props.element.action?.serviceMessagingData?.requestType}`;
        }

        return id;
    };

    private onDelete = () => {
        if (!this.isEditingStartElement) {
            this.props.onDelete(this.props.element.id);
        }
    };
}
