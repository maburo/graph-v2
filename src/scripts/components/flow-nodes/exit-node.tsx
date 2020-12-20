import * as React from 'react';
// import * as _ from 'lodash';
import {
    // ActionMenu,
    // compareWithoutFunctions,
    FlowElementType,
    Validation,
    FlowElementMetric,
    FlowElementPreview,
    ValidationResult,
    FlowActionStatistics,
    AppConfig,
} from '@infobip/moments-components';
import { ActionMenu,  } from './action-menu';
// import classNames from 'classnames';

// import { Localization, I18n } from 'ib-i18n';

// import { Metrics } from './metrics/metrics';
// const __: Localization = _.partial(I18n.__, 'Diagram');
const __ = (str:string) => str;

interface Props {
    id: number;
    type: FlowElementType | string;
    validationResult?: ValidationResult;
    elementPreview?: FlowElementPreview;
    readonly?: boolean;
    zoomLevel?: number;
    metrics?: FlowElementMetric;
    statistics?: FlowActionStatistics;
    loadingStatistics?: boolean;
    // config: AppConfig;
    onDelete?: (id: number) => void;
    showMetricsAllRecipientCount?: boolean;
}

export function ExitNode(props:Props) {
    // shouldComponentUpdate(nextProps: Props) {
    //     return false;
    //     return compareWithoutFunctions(this.props, nextProps);
    // }

    // render() {
      // const classes = classNames('flow-stop-element', {
      //     warning: _.get(this.props.validationResult, 'type') === Validation.WARNING,
      //     danger: _.get(this.props.validationResult, 'type') === Validation.ERROR,
      // });

      const classes = 'flow-stop-element';

      return (
          <div
              className={classes}
              data-flow-element-type={props.type}
              data-flow-element-id={props.id}
              data-tip="tooltip"
              data-for={`node-tooltip-${props.id}`}
          >
              <div className="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15">
                      <path d="M0,0 L16,0 L16,16 L0,16 z" fill="rgba(207, 40, 40, 0.6)" />
                  </svg>
              </div>
              {/* {this.props.readonly ? (
                  this.renderMetrics()
              ) : ( */}
                  <div>
                      <div className="title">{__('Exit flow')}</div>
                      <div className="flow-element-dropdown-menu-cont">
                          <ActionMenu className="flow-element-dropdown-menu" inverseColor={true}>
                              <ActionMenu.Item 
                                label={__('Delete')} 
                                onSelect={() => props.onDelete?.call(props.id)} 
                                />
                          </ActionMenu>
                      </div>
                  </div>
              {/* )} */}
          </div>
      );
    }

    // private renderMetrics():any {
    //   return null;
    // }

    // private renderMetrics() {
    //   return (null);
    //     if (!this.props.metrics || !this.props.zoomLevel) {
    //         return '';
    //     }

    //     return (
    //         <Metrics
    //             id={this.props.id}
    //             metrics={this.props.metrics}
    //             statistics={this.props.statistics}
    //             elementPreview={this.props.elementPreview}
    //             zoomLevel={this.props.zoomLevel}
    //             loadingStatistics={this.props.loadingStatistics}
    //             config={this.props.config}
    //             showAllRecipientCount={this.props.showMetricsAllRecipientCount}
    //         />
    //     );
    // }

    // private onDelete = () => {
    //     if (this.props.onDelete) {
    //         this.props.onDelete(this.props.id);
    //     }
    // };
// }
