import React, { ReactNode } from 'react';
import classNames from 'classnames';

export const Subheader = ({
    className,
    children,
    description,
}: {
    className?: string;
    children?: ReactNode;
    description?: string;
}) => (
    <div className={classNames('subheader', className)}>
        <h2 className="subheader__title">{children}</h2>
        {description && <p className="subheader__description">{description}</p>}
    </div>
);
