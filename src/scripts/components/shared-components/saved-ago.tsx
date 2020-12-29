import * as React from 'react';
// import * as _ from 'lodash';

// import { Localization, formatRelative, I18n } from 'ib-i18n';

// const __: Localization = _.partial(I18n.__, 'Footer');
const __ = (s: string) => s;

interface Props {
    savedAt?: number;
}

export class SavedAgo extends React.Component<Props> {
    shouldComponentUpdate(nextProps: Props) {
        return this.props.savedAt !== nextProps.savedAt;
    }

    render() {
        if (!this.props.savedAt) {
            return null;
        }

        return <span>{__(`Last saved ${this.props.savedAt}`)}</span>;
    }
}
