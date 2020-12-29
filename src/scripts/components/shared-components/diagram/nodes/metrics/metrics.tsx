import * as React from 'react';
// import * as _ from 'lodash';
import classNames from 'classnames';
import {
    AppConfig,
    FlowActionStatistics,
    FlowElementMetric,
    FlowElementPreview,
    FlowElementType,
    SendTimeOptimizationStrategyType,
} from '@infobip/moments-components';

// import { _n, I18n, Localization } from 'ib-i18n';

import { getMetricsIcon } from '../../utils/metric.utils';
// import { DiagramReactTooltip } from '../../../../utils/diagram-react-tooltip';
import trafficIcon from '../../../../../../../assets/img/icon-traffic.svg';

import { MetricDataTooltip } from './metric-data-tooltip';

// const __: Localization = _.partial(I18n.__, 'Diagram');
const __ = (s: string) => s;

const COUNT_PLACEHOLDER = '--';

interface Props {
    id: number;
    // zoomLevel: number;
    metrics: FlowElementMetric;
    statistics?: FlowActionStatistics;
    loadingStatistics?: boolean;
    // config: AppConfig;
    elementPreview?: FlowElementPreview;
    type?: FlowElementType | string;
    showTraffic?: boolean;
    showAllRecipientCount?: boolean;
    sendTimeOptimizationStrategyType?: SendTimeOptimizationStrategyType;
}

export const Metrics: React.SFC<Props> = props => {
    const config = {
        enableFlowGoal: false,
    }

    const {
        id,
        statistics,
        type,
        elementPreview,
        // config: { enableAbExperiments },
    } = props;
    const {
        START_RESOLVE_ONETIME_AUDIENCE,
        START_EVALUATE_INBOUND_MESSAGE,
        START_EVALUATE_DATE_TIME_ATTRIBUTE,
        START_EVALUATE_PEOPLE_EVENT,
        START_EVALUATE_BEHAVIOUR_EVENT,
        START_FLOW_WEBHOOK,
        START_IVR_INBOUND,
    } = FlowElementType;
    const FlowElementTypes: string[] = [
        START_RESOLVE_ONETIME_AUDIENCE,
        START_EVALUATE_INBOUND_MESSAGE,
        START_EVALUATE_PEOPLE_EVENT,
        START_EVALUATE_BEHAVIOUR_EVENT,
        START_FLOW_WEBHOOK,
        START_IVR_INBOUND,
        START_EVALUATE_DATE_TIME_ATTRIBUTE,
    ];
    const isStartElement = type && FlowElementTypes.includes(type);
    const count = props.metrics.count || COUNT_PLACEHOLDER;
    const classes = classNames('ib-flow-metrics', {
        'start-element': isStartElement,
    });

    const countMetricsIcon = getMetricsIcon('count', type);
    const conversionMetricsIcon = getMetricsIcon('conversion', type);
    const tooltipTitle = () => {
        if (!elementPreview) {
            return '';
        }
        const { content, title } = elementPreview;
        FlowElementTypes.filter(el => el === START_FLOW_WEBHOOK).includes(type || '') ? content : title;
    };
    const events = statistics?.events ?? {};
    const allRecipientsCount = statistics && statistics.allRecipientsCount;
    const trafficStats = statistics && statistics.traffic;
    const traffic = trafficStats || COUNT_PLACEHOLDER;
    const sendTimeOptimizationStatistic = statistics?.sendTimeOptimizationStatistic;

    const showTraffic = props.showTraffic && config.enableFlowGoal;
    const showAllRecipientCount =
        props.showAllRecipientCount && config.enableFlowGoal && allRecipientsCount !== undefined;

    

    return (
        <div className={classes}>
            <div className="ib-flow-metrics-metric-container">
                {(!config.enableFlowGoal || isStartElement) && (
                    <div className="tf-ib-flow-metrics-metric-box ib-flow-metrics-metric-box ib-flow-metrics-metric-box--people">
                        <img src={countMetricsIcon} />
                        <span>{props.loadingStatistics ? COUNT_PLACEHOLDER : props.metrics.count}</span>
                    </div>
                )}
                {!isStartElement && (
                    <div className="tf-flow-metric-user-percentage ib-flow-metrics-metric-box">
                        <img src={conversionMetricsIcon} />
                        {!props.loadingStatistics && props.metrics.conversion !== undefined ? ( // TODO temporary until migration of old campaigns is fixed
                            <span>
                                props.metrics.conversion
                                {/* {_n(props.metrics.conversion, { style: 'percent' })} */}
                            </span>
                        ) : (
                            <span>{COUNT_PLACEHOLDER}</span>
                        )}
                    </div>
                )}
                {showTraffic && (
                    <div className="tf-flow-metric-traffic ib-flow-metrics-metric-box">
                        <img src={trafficIcon} />
                        <span>{props.loadingStatistics ? COUNT_PLACEHOLDER : traffic}</span>
                    </div>
                )}
            </div>
            {/* <DiagramReactTooltip
                id={`node-tooltip-${id}`}
                place="bottom"
                className="ib-flow-metrics-tooltip"
                zoomLevel={props.zoomLevel}
            >
                <div className="ib-flow-metrics-tooltip-title">{__(tooltipTitle())}</div>
                <div className="ib-flow-metrics-tooltip-data">
                    <h3 className="ib-flow-metrics-tooltip-data-title">{props.metrics.tooltipTitle}</h3>
                    <p className="ib-flow-metrics-tooltip-data-metric">{count}</p>
                    {!_.isEmpty(events) &&
                        enableAbExperiments &&
                        Object.keys(events).map((event, index) => (
                            <div key={index} className="flow-actions-statistics">
                                <div>{__(_.capitalize(event))}</div>
                                <div>{events[event]}</div>
                            </div>
                        ))}

                    <p className="ib-flow-metrics-tooltip-data-description">{props.metrics.tooltipDescription}</p>
                </div>
                {showAllRecipientCount && (
                    <div className="ib-flow-metrics-tooltip-data">
                        <h3 className="ib-flow-metrics-tooltip-data-title">{__('Total engagements')}</h3>
                        <p className="ib-flow-metrics-tooltip-data-metric">{allRecipientsCount || COUNT_PLACEHOLDER}</p>
                        <p className="ib-flow-metrics-tooltip-data-description">
                            {__('Total engagements for this element (people can be targeted multiple times)')}
                        </p>
                    </div>
                )}
                <div className="ib-flow-metrics-tooltip-percentage-info">
                    <p className="ib-flow-metrics-tooltip-data-description">
                        {__(
                            'Percentage of engaged users can exceed 100% because of multiple entries of the same person.',
                        )}
                    </p>
                </div>

                {showTraffic && (
                    <div className="ib-flow-metrics-tooltip-data">
                        <h3 className="ib-flow-metrics-tooltip-data-title">{__('Traffic')}</h3>
                        <p className="ib-flow-metrics-tooltip-data-metric">{traffic || COUNT_PLACEHOLDER}</p>
                        <p className="ib-flow-metrics-tooltip-data-description">
                            {__(
                                'Total number of traffic (messages) sent via this communication might be delayed from time to time depending on the current load.',
                            )}
                        </p>
                    </div>
                )}
                {props.sendTimeOptimizationStrategyType &&
                    props.sendTimeOptimizationStrategyType === SendTimeOptimizationStrategyType.OPEN && (
                        <MetricDataTooltip
                            title={__('Open Rate')}
                            metricsTitle={[__('Optimized messages'), __('Controlled messages'), __('New Messages')]}
                            metricsData={[
                                sendTimeOptimizationStatistic?.optimized?.opens.rate,
                                sendTimeOptimizationStatistic?.control?.opens.rate,
                                sendTimeOptimizationStatistic?.notApplicable?.opens.rate,
                            ]}
                            metricsDescriptions={[
                                __('Percent of messages opened that were sent during an optimized timeframe.'),
                                __('Percent of messages opened that were sent at the time the campaign was scheduled.'),
                                __(
                                    `Percent of messages with urls opened that were sent at the time the campaign was scheduled, because it's new audience.`,
                                ),
                            ]}
                        />
                    )}
                {props.sendTimeOptimizationStrategyType &&
                    props.sendTimeOptimizationStrategyType === SendTimeOptimizationStrategyType.CLICK && (
                        <MetricDataTooltip
                            title={__('Click Rate')}
                            metricsTitle={[__('Optimized messages'), __('Controlled messages'), __('New Messages')]}
                            metricsData={[
                                sendTimeOptimizationStatistic?.optimized?.clicks.rate,
                                sendTimeOptimizationStatistic?.control?.clicks.rate,
                                sendTimeOptimizationStatistic?.notApplicable?.clicks.rate,
                            ]}
                            metricsDescriptions={[
                                __(
                                    'Percent of messages with urls clicked that were sent during an optimized timeframe.',
                                ),
                                __(
                                    'Percent of messages with urls clicked that were sent at the time the campaign was scheduled.',
                                ),
                                __(
                                    `Percent of message with urls clicked that were sent at the time the campaign was scheduled, because it's new audience.`,
                                ),
                            ]}
                        />
                    )}
            </DiagramReactTooltip> */}
        </div>
    );
};

export const RuleProgressMetric: React.SFC = () => {
    return (
        <div>
            <div className="ib-flow-decision-progress" style={{ width: '25%' }} />
            <div className="ib-flow-decision-metric">20</div>
        </div>
    );
};
