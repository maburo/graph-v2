import * as React from 'react';
import classNames from 'classnames';

import { StartOption, StartOptionTrigger } from './types';

interface Props {
    option: StartOption | StartOptionTrigger;
    selected: boolean;
    onSelect: (type: StartOption | StartOptionTrigger) => void;
}

export class GettingStartedOption extends React.Component<Props> {
    render() {
        const {
            option: { type, icon, title, description, link },
        } = this.props;

        const classes = classNames('start-option', {
            selected: this.props.selected,
        });

        return (
            <div data-start-option-element-type={type} className={classes} onClick={this.handleClick}>
                <img className="icon" src={icon} />
                <div className="title">{title}</div>
                <div className="description">{description}</div>

                {link && (
                    <div>
                        <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link"
                            onClick={this.handleLinkClick}
                        >
                            Read more
                            <i className="fas fa-external-link-alt" />
                        </a>
                    </div>
                )}
            </div>
        );
    }

    private handleClick = () => {
        this.props.onSelect(this.props.option);
    };

    handleLinkClick(e: React.MouseEvent<HTMLAnchorElement>) {
        e.stopPropagation();
    }
}
