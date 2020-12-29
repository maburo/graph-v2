import * as React from 'react';
// import * as _ from 'lodash';

// import { I18n, Localization } from 'ib-i18n';

// const __: Localization = _.partial(I18n.__, 'Diagram');
const __ = (s: string) => s;

interface MetricDataTooltipProps {
    title: string;
    metricsTitle: string[];
    metricsData: any[];
    metricsDescriptions: string[];
}

export const MetricDataTooltip = React.memo((props: MetricDataTooltipProps) => {
    const tooltipsData = React.useMemo<JSX.Element[]>(() => {
        const components = [] as JSX.Element[];

        for (let i = 0; i < props.metricsData.length; i++) {
            components.push(
                <div className="ib-flow-metrics-tooltip-data" key={props.metricsDescriptions[i]}>
                    <h3 className="ib-flow-metrics-tooltip-data-title">{__(`${props.metricsTitle[i]}`)}</h3>
                    <p className="ib-flow-metrics-tooltip-data-metric">{`${props.metricsData[i]}%`}</p>
                    <p className="ib-flow-metrics-tooltip-data-description">{__(`${props.metricsDescriptions[i]}`)}</p>
                </div>,
            );
        }

        return components;
    }, [props.metricsData, props.metricsDescriptions, props.metricsDescriptions]);

    return (
        <div className="ib-flow-metrics-tooltip-data">
            <div className="ib-flow-metrics-tooltip-title">{__(props.title)}</div>
            {tooltipsData}
        </div>
    );
});
