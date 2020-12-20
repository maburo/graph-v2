import * as React from 'react';
// import * as _ from 'lodash';
// import classNames from 'classnames';
import {
    FlowElementPreview,
    FlowElementType,
    Validation,
    ValidationResult,
    // ActionMenu,
    compareWithoutFunctions,
} from '@infobip/moments-components';
import { ActionMenu,  } from './action-menu';
import pauseIcon from '../../../../assets/img/canvas/icon-pause-action-color.svg';
// import { Localization, I18n } from 'ib-i18n';

// const __: Localization = _.partial(I18n.__, 'Diagram');
const __ = (str:string) => str;

interface Props {
    id: number;
    type: FlowElementType | string;
    elementPreview?: FlowElementPreview;
    validationResult?: ValidationResult;
    readonly?: boolean;
    onDelete?: (id: number) => void;
    onDuplicate?: (id: number) => void;
}

export class PauseNode extends React.Component<Props> {
    // shouldComponentUpdate(nextProps: Props) {
    //     return compareWithoutFunctions(this.props, nextProps);
    // }

    render() {
        // const classes = classNames('flow-pause-element', {
        //     warning: _.get(this.props.validationResult, 'type') === Validation.WARNING,
        //     danger: _.get(this.props.validationResult, 'type') === Validation.ERROR,
        // });
        const classes = 'flow-pause-element';

        const elementPreview = this.props.elementPreview;
        return (
            <div className={classes} data-flow-element-type={this.props.type} data-flow-element-id={this.props.id}>
                <div className="icon">
                    {/* <img src={elementPreview?.icon ?? ''} /> */}
                    <img src={pauseIcon} />
                </div>
                {/* todo: use element preview */}
                <div className="title">{elementPreview?.title ?? ''}</div>
                <div className="text">{elementPreview?.content ?? ''}</div>
                {!this.props.readonly && (
                    <div className="flow-element-dropdown-menu-cont">
                        <ActionMenu className="flow-element-dropdown-menu" inverseColor={true}>
                            <ActionMenu.Item label={__('Delete')} onSelect={this.onDelete} />
                            <ActionMenu.Item label={__('Duplicate')} onSelect={this.onDuplicate} />
                        </ActionMenu>
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

    private onDuplicate = () => {
        if (this.props.onDuplicate) {
            this.props.onDuplicate(this.props.id);
        }
    };
}
