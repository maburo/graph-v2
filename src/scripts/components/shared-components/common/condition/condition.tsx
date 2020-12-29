import * as React from 'react';
import { ValidationResult } from '@infobip/moments-components';
// import * as _ from 'lodash';
import classNames from 'classnames';

// import { Localization, I18n } from 'ib-i18n';

import { ActionButton } from '../action-button/action-button';
import { Subheader } from '../subheader/subheader';

// const __: Localization = _.partial(I18n.__, 'Common');
const __ = (s: string) => s;

export class ConditionContainer extends React.Component<{
    className?: string;
}> {
    render(): JSX.Element {
        return <div className={classNames('condition-container', this.props.className)}>{this.props.children}</div>;
    }
}

export class ConditionHeader extends React.Component<{
    className?: string;
    order?: number;
    label: string;
    readonly: boolean;

    onRemove: () => void;
}> {
    render(): JSX.Element {
        return (
            <div className={classNames('condition-header', this.props.className)}>
                <Subheader>
                    {this.props.label} {this.props.order}
                </Subheader>
                {this.props.readonly || (
                    <ActionButton className="condition-header__remove-button" onClick={this.props.onRemove}>
                        {__('Remove')}
                    </ActionButton>
                )}
            </div>
        );
    }
}

export class ConditionBody extends React.Component<{
    className?: string;
    validationResult?: ValidationResult;
}> {
    render(): JSX.Element {
        return (
            <div className={classNames('condition-body', this.props.className)}>
                <div className="condition-body__form">{this.props.children}</div>
            </div>
        );
    }
}
