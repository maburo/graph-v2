import * as React from 'react';

import { StartOption } from '../types';

interface Props {
    option: StartOption;
    onSelect: (type: StartOption) => void;
}

export const StartCreatorOption: React.SFC<Props> = props => {
    const { type, icon, title } = props.option;

    const handleClick = () => props.onSelect(props.option);

    return (
        <div data-entry-point-element-type={type} className="flow-start-option" onClick={handleClick}>
            <img className="icon" src={icon} />
            <div className="title">{title}</div>
        </div>
    );
};
