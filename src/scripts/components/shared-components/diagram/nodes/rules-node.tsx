import * as React from 'react';
// import * as _ from 'lodash';
import classNames from 'classnames';
import {
    FlowElementMetric,
    FlowElementPreview,
    FlowElementType,
    FlowRule,
    Receiver,
    Validation,
    ValidationResult,
    FlowActionStatistics,
    AppConfig,
    // ActionMenu,
    compareWithoutFunctions,
} from '@infobip/moments-components';

// import { Localization, I18n } from 'ib-i18n';

import plusIcon from '../../../../../../assets/img/canvas/elements/plus-schnipple.svg';
import removeIcon from '../../../../../../assets/img/canvas/elements/remove-schnipple.svg';
import { RULES_NODE_RULE_DIFF, RULES_NODE_RULE_PADDING } from '../utils/diagram-dimensions.utils';
// import { DiagramReactTooltip } from '../../../utils/diagram-react-tooltip';
import { TruncateWithEllipsis } from '../../truncate-with-ellipsis';

import { ElementGroup, getAllFlowElements } from './utils';
import { Metrics } from './metrics/metrics';

// const __: Localization = _.partial(I18n.__, 'Diagram');
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
    zoomLevel: number;
    addingRuleDisabled?: boolean;
    // config: AppConfig;
    onAddRule: (id: number, receiver?: Receiver) => void;
    onRemoveRule: (id: number, index: number) => void;
    onDelete?: (id: number) => void;
    onDuplicate?: (id: number) => void;
    showMetricsAllRecipientCount?: boolean;
    canAddRule: boolean;
}

export class RulesNode extends React.Component<Props> {
    static defaultProps: Partial<Props> = {
        canAddRule: true,
    };

    // shouldComponentUpdate(nextProps: Props) {
    //     return compareWithoutFunctions(this.props, nextProps);
    // }

    render() {
        return (
            <div data-flow-element-type={this.props.type} data-flow-element-id={this.props.id}>
                {this.renderHeader()}

                <div className="ib-flow-decision-path">
                    {this.renderBasePath(this.props.rules?.length)}
                </div>

                {this.renderRules()}
                {this.props.canAddRule && (
                    <div
                        className="ib-flow-decision-group-shnipple-wrapper"
                        data-tip="tooltip"
                        data-for={`add-condition-tooltip-${this.props.id}`}
                    >
                        <button
                            className={classNames('ib-flow-decision-group-shnipple', {
                                disabled: this.props.addingRuleDisabled,
                            })}
                            onClick={this.addButtonClickHandler}
                        >
                            <img src={plusIcon} alt="" />
                        </button>
                    </div>
                )}
                {/* {this.props.addingRuleDisabled && (
                    <DiagramReactTooltip
                        id={`add-condition-tooltip-${this.props.id}`}
                        place="right"
                        zoomLevel={this.props.zoomLevel}
                        className="ib-flow-tooltip flow-schnipple-tooltip"
                    >
                        {__(
                            'Button disabled because multiple channels are used. Add conditions in edit panel on the right.',
                        )}
                    </DiagramReactTooltip>
                )} */}
            </div>
        );
    }

    private renderHeader() {
        const elementDefinition = getAllFlowElements().find(el => el.type === this.props.type);
        const elementGroup = elementDefinition ? elementDefinition.group : ElementGroup.CHANNEL;

        const classes = classNames('ib-flow-action-group', `ib-flow-action-group--${elementGroup.toLowerCase()}`, {
            warning: this.props.validationResult?.type === Validation.WARNING,
            danger: this.props.validationResult?.type === Validation.ERROR,
        });

        const actionPreview = this.props.elementPreview;
        const actionTitle = actionPreview ? actionPreview.title : '';
        const actionText = actionPreview ? actionPreview.content : '';

        return (
            <div className={classes} data-tip="tooltip" data-for={`node-tooltip-${this.props.id}`}>
                <div className="ib-flow-action-group-left-border" />
                <div className="ib-flow-action-group-icon">
                    <img src={actionPreview ? actionPreview.icon : ''} alt="" />
                </div>

                <div className="ib-flow-action-group-text-container">
                    <div className="ib-flow-action-group-title text-ellipsis">{actionTitle}</div>
                    <div className="ib-flow-action-group-message-text fs-exclude">
                        <TruncateWithEllipsis
                            lines={this.props.readonly ? 1 : 2}
                            shouldTruncate={true}
                            text={actionText}
                        />
                    </div>
                </div>

                {!this.props.readonly && (
                    <div className="flow-element-dropdown-menu-cont">
                        {/* <ActionMenu className="flow-element-dropdown-menu" inverseColor={true}>
                            <ActionMenu.Item label={__('Delete')} onSelect={this.onDelete} />
                            <ActionMenu.Item label={__('Duplicate')} onSelect={this.onDuplicate} />
                        </ActionMenu> */}
                    </div>
                )}

                {this.props.metrics && this.props.readonly && this.props.zoomLevel && (
                    <Metrics
                        id={this.props.id}
                        metrics={this.props.metrics}
                        statistics={this.props.statistics}
                        // zoomLevel={this.props.zoomLevel}
                        loadingStatistics={this.props.loadingStatistics}
                        elementPreview={this.props.elementPreview}
                        // config={this.props.config}
                        showAllRecipientCount={this.props.showMetricsAllRecipientCount}
                    />
                )}
            </div>
        );
    }

    private onDelete = () => {
        if (this.props.onDelete) {
            this.props.onDelete(this.props.id);
        }
    };

    private onDuplicate = () => {
        if (this.props.onDuplicate) {
            this.props.onDuplicate(this.props.id);
        }
    };

    private renderRules = () => {
        return (
            <div className="ib-flow-decision-group-decisions">
                {this.props.rules?.map((rule: FlowRule, index: number) => {
                    const ruleContent = this.props.elementPreview
                        ? this.props.elementPreview.rulesContent?.[index]
                        : __('Define content in panel');

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
                                {/* In case progress for rules was implemented
                                 * {this.props.metrics && this.props.readonly && <RuleProgressMetric />}
                                 */}

                                <div className="ib-flow-decision-text text-ellipsis">{ruleContent}</div>
                            </div>

                            {!rule.nextElementId &&
                            !rule.valid &&
                            false && ( // TODO remove when valid is implemented
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
        if (!this.props.addingRuleDisabled) {
            const receiver = (this.props.rules[0]?.condition as any)?.receiver;
            this.props.onAddRule(this.props.id, receiver);
        }
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
