import * as React from 'react';
// import * as _ from 'lodash';
import classNames from 'classnames';
import {
    FlowElementMetric,
    FlowElementPreview,
    FlowElementType,
    FlowRule,
    Validation,
    ValidationResult,
    FlowActionStatistics,
    AppConfig,
    // ActionMenu,
    compareWithoutFunctions,
} from '@infobip/moments-components';

// import { Localization, I18n } from 'ib-i18n';

import startIcon from '../../../../../../assets/img/canvas/icon-start-white.svg';
import plusIcon from '../../../../../../assets/img/canvas/elements/plus-schnipple.svg';
import removeIcon from '../../../../../../assets/img/canvas/elements/remove-schnipple.svg';
import { RULES_NODE_RULE_DIFF, RULES_NODE_RULE_PADDING } from '../utils/diagram-dimensions.utils';
import { TruncateWithEllipsis } from '../../truncate-with-ellipsis';
import { triggerOptions } from '../../start/start-creator/start-creator';

console.log('>>>>',startIcon);

import { Metrics } from './metrics/metrics';

// const __: Localization = _.partial(I18n.__, 'Diagram.StartNode');
const __ = (s: string) => s;

interface Props {
    id: number;
    type: FlowElementType | string;
    validationResult?: ValidationResult;
    elementPreview?: FlowElementPreview;
    rules?: FlowRule[];
    metrics?: FlowElementMetric;
    statistics?: FlowActionStatistics;
    loadingStatistics?: boolean;
    readonly?: boolean;
    zoomLevel?: number;
    // config: AppConfig;
    onAddRule: (id: number) => void;
    onRemoveRule: (id: number, index: number) => void;
    onDelete?: (id: number) => void;
    showMetricsAllRecipientCount?: boolean;
}

export class StartNode extends React.Component<Props> {
    // shouldComponentUpdate(nextProps: Props) {
    //     return compareWithoutFunctions(this.props, nextProps);
    // }

    render() {
        const config = {
            enablePeopleEvents: true,
        }
        const isEnablePeopleEvents = config.enablePeopleEvents;
        const isTriggerEntryPoint = triggerOptions.some(option => option.type === this.props.type);

        const classes = classNames('flow-start-element-header', {
            warning: this.props.validationResult?.type === Validation.WARNING,
            danger: this.props.validationResult?.type === Validation.ERROR,
        });

        const textClasses = classNames('text', {
            'fs-exclude': this.props.type === FlowElementType.START_RESOLVE_ONETIME_AUDIENCE,
        });

        const titleClasses = classNames('title', {
            'title--trigger': isEnablePeopleEvents && isTriggerEntryPoint && !this.props.readonly,
        });

        const actionPreview = this.props.elementPreview;
        const isActionTextVisible = !isEnablePeopleEvents || !isTriggerEntryPoint;

        const actionTitle = actionPreview ? actionPreview.title : __('Flow Entry Point');
        const actionText = isActionTextVisible && actionPreview ? actionPreview.content : '';

        return (
            <div
                className="flow-start-element"
                data-flow-element-type={this.props.type}
                data-flow-element-id={this.props.id}
            >
                <div className={classes} data-tip="tooltip" data-for={`node-tooltip-${this.props.id}`}>
                    <div className="icon">
                        <img src={startIcon} alt="" />
                    </div>

                    {isEnablePeopleEvents && isTriggerEntryPoint && !this.props.readonly && (
                        <div className="trigger-label">{__('Entry Point: Trigger')}</div>
                    )}

                    <div className={titleClasses}>{actionTitle}</div>

                    {!this.props.readonly && (
                        <div className={textClasses}>
                            <TruncateWithEllipsis
                                shouldTruncate={true}
                                lines={1}
                                text={actionText}
                                title={actionText}
                            />
                        </div>
                    )}

                    {/* {!this.props.readonly && (
                        <ActionMenu className="flow-element-dropdown-menu">
                            <ActionMenu.Item label={__('Delete')} onSelect={this.onDelete} />
                        </ActionMenu>
                    )} */}

                    {this.props.metrics && this.props.readonly && this.props.zoomLevel && (
                        <Metrics
                            id={this.props.id}
                            metrics={this.props.metrics}
                            statistics={this.props.statistics}
                            // zoomLevel={this.props.zoomLevel}
                            type={this.props.type}
                            elementPreview={this.props.elementPreview}
                            loadingStatistics={this.props.loadingStatistics}
                            // config={this.props.config}
                            showAllRecipientCount={this.props.showMetricsAllRecipientCount}
                        />
                    )}
                </div>

                <div className="ib-flow-decision-path">
                    {this.renderBasePath(this.props.rules?.length)}
                </div>

                {this.renderRules()}

                {this.props.rules?.length > 0 && (
                    <div className="ib-flow-decision-group-shnipple-wrapper">
                        <button className="ib-flow-decision-group-shnipple" onClick={this.addButtonClickHandler}>
                            <img src={plusIcon} />
                        </button>
                    </div>
                )}
            </div>
        );
    }

    private onDelete = () => {
        if (this.props.onDelete) {
            this.props.onDelete(this.props.id);
        }
    };

    private renderRules = () => {
        return (
            <div className="ib-flow-decision-group-decisions">
                {this.props.rules?.map((rule: FlowRule, index: number) => {
                    return (
                        <div
                            key={index}
                            className="ib-flow-decision"
                            style={{
                                top: RULES_NODE_RULE_PADDING + RULES_NODE_RULE_DIFF * index,
                            }}
                        >
                            <svg viewBox="0 0 200 50" width="200" height="50">
                                <g className="omni-flow-path">
                                    <path className="omni-flow-path-path" d="M30,35 h23" />
                                </g>
                            </svg>

                            <div className="ib-flow-decision-text-cont">
                                <div className="ib-flow-decision-text text-ellipsis">
                                    {__('Define content in panel')}
                                </div>
                            </div>

                            {!rule.nextElementId &&
                            !rule.valid &&
                            false && ( // TODO enable when rules are validated
                                    <div className="ib-flow-decision-group-shnipple-wrapper-remove">
                                        <button
                                            data-index={index}
                                            onClick={this.removeButtonClickHandler}
                                            className="ib-flow-decision-shnipple ib-flow-decision-shnipple--remove"
                                        >
                                            <img src={removeIcon} />
                                        </button>
                                    </div>
                                )}
                        </div>
                    );
                })}
            </div>
        );
    };

    private addButtonClickHandler = () => {
        this.props.onAddRule(this.props.id);
    };

    private removeButtonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        const dataIndex = event.currentTarget.dataset.index;
        if (dataIndex) {
            const index = parseInt(dataIndex, 10);
            this.props.onRemoveRule(this.props.id, index);
        }
    };

    renderBasePath(size: number) {
        const height = RULES_NODE_RULE_DIFF * size;
        return (
            <svg viewBox={`0 0 50 ${height}`} width="50" height={height}>
                <g className="omni-flow-path">
                    <path className="omni-flow-path-path" d={`M30,0 v${height - 15}`} />
                </g>
            </svg>
        );
    }
}
