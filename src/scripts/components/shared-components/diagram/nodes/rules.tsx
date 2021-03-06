import * as React from 'react';

import { FlowRule } from '@infobip/moments-components';
import { RULES_NODE_PADDING, RULES_NODE_RULE_DIFF, RULES_NODE_TOP } from '../utils/diagram-dimensions.utils';

import removeIcon from '../../../../../../assets/img/canvas/elements/remove-schnipple.svg';
import plusIcon from '../../../../../../assets/img/canvas/elements/plus-schnipple.svg';
import { relative } from 'path';

const __ = (s: string) => s;

export function renderRules(rules?: FlowRule[]) {
  return (
    <div style={{position: 'relative'}}>
      <div className="ib-flow-decision-path">
        { renderBasePath(rules?.length) }
      </div>
      { rules?.map(renderRule) }
      { renderAddRuleButton(true, rules) }
    </div>
  )
}

function renderAddRuleButton(canAddRule: boolean, rules?: FlowRule[]) {
  return rules?.length > 0 && canAddRule ? (
    <div className="ib-flow-shnipple-wrapper" style={{top: RULES_NODE_TOP, left: 8}}>
      <button className="ib-flow-shnipple" onClick={() => {}/*this.addButtonClickHandler*/}>
        <img src={plusIcon} alt="" />
      </button>
    </div>
  ) : (null);
}

function renderHPath(size: number): JSX.Element[] {
  let result = [];

  for (let i = 0; i < size; i++) {
    const d = `M30,${RULES_NODE_TOP + RULES_NODE_PADDING * i} h23`;
    result.push((<path className="omni-flow-path-path" d={d} />));
  }

  return result;
}

function renderBasePath(size: number) {
  const height = RULES_NODE_RULE_DIFF * size;

  return (
    <svg viewBox={`0 0 60 ${height}`} width="60" height={height}>
      <g className="omni-flow-path">
        <path className="omni-flow-path-path" d={`M30,0 v${height - 15}`} />
        {renderHPath(size)}
      </g>
    </svg>
  );
}

function renderRule(rule: FlowRule, index: number) {
  const ruleContent = __('Define content in panel');
  // const ruleContent = this.props.elementPreview
  //   ? this.props.elementPreview.rulesContent?.[index]
  //   : __('Define content in panel');

  return (
    <div
      key={index} // TODO: next el id?
      className="ib-flow-decision"
      style={{
        paddingTop: '10px',
        paddingLeft: '53px'
      }}
    >
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
              // onClick={this.removeButtonClickHandler}
              className="ib-flow-decision-shnipple ib-flow-decision-shnipple--remove"
            >
              <img src={removeIcon} />
            </button>
          </div>
        )}
    </div>
  );
}