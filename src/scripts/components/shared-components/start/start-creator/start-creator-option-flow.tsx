import * as React from 'react';
// import * as ReactTooltip from 'react-tooltip';
// import * as _ from 'lodash';
import classNames from 'classnames';

// import { Localization, I18n } from 'ib-i18n';

import { StartOption } from '../types';

interface Props {
    option: StartOption;
    onSelect: (type: StartOption) => void;
    className?: string;
    shouldRenderOption: (option: StartOption) => boolean | string;
}

const TOOLTIP_OFFSET = 18;

// const __: Localization = _.partial(I18n.__, 'StartCreatorOptionFlow');
const __ = (s: string) => s;

export const StartCreatorOptionFlow: React.SFC<Props> = props => {
    const {
        className,
        option: { type, icon, title, description },
        shouldRenderOption,
    } = props;

    const handleClick = () => props.onSelect(props.option);

    if (!shouldRenderOption(props.option)) {
        return null;
    }

    const classes = classNames('flow-start-creator-panel__start-option', className);

    return (
        <div
            data-tip
            data-for={`clipboard-tooltip-${type}`}
            data-entry-point-element-type={type}
            className={classes}
            onClick={handleClick}
        >
            <img className="icon" src={icon} />
            <div className="title">{title}</div>
            {/* <ReactTooltip
                id={`clipboard-tooltip-${type}`}
                effect="solid"
                place="right"
                className="tooltip"
                offset={{ right: TOOLTIP_OFFSET }}
            >
                {__(`${description}`)}
            </ReactTooltip> */}
        </div>
    );
};
