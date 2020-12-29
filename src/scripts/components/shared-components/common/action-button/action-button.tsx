import * as React from 'react';
import classNames from 'classnames';

export const ActionButton = ({
    className,
    children,
    onClick,
}: {
    className?: string;
    children?: React.ReactNode;
    onClick?: () => void;
}) => (
    <a className={classNames('action-button', className)} onClick={onClick}>
        {children}
    </a>
);
