// import * as React from 'react';
// import * as _ from 'lodash';

// import { I18n, Localization } from 'ib-i18n';
// import { Modal } from 'ib-modals';

// import deleteIcon from '../../../assets/img/close.svg';

// const __: Localization = _.partial(I18n.__, 'Modals');

// interface Props {
//     isOpen: boolean;
//     onClose: () => void;
//     onConfirm: () => void;
// }

// export const EditFlowModal = React.memo(({ isOpen, onClose, onConfirm }: Props) => {
//     const handleConfirm = React.useCallback(() => {
//         onConfirm();
//         onClose();
//     }, [onClose, onConfirm]);

//     return (
//         <Modal className="edit-flow-modal" isOpen={isOpen} onClose={onClose}>
//             <div className="modal-exit" onClick={onClose}>
//                 <img src={deleteIcon} width="20" height="20" />
//             </div>
//             <Modal.Header>
//                 <h1 className="modal-title">{__('Edit flow')}</h1>
//             </Modal.Header>
//             <Modal.Body>
//                 <p>
//                     {__(
//                         'In order to protect your audience, we’ll create a new version that you can edit. When you’re ready, you can launch your new edited version to replace the current version.',
//                     )}
//                 </p>
//             </Modal.Body>
//             <Modal.Footer>
//                 <div>
//                     <button className="btn-modal btn-cancel text-uppercase" onClick={onClose}>
//                         {__('cancel')}
//                     </button>
//                     <button className="btn-modal btn-confirm text-uppercase" onClick={handleConfirm}>
//                         {__('create new version')}
//                     </button>
//                 </div>
//             </Modal.Footer>
//         </Modal>
//     );
// });

// EditFlowModal.displayName = 'EditFlowModal';
