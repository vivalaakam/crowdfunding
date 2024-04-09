import {useEffect, useRef} from "react";
import {CSSTransition} from "react-transition-group";
import {ReactPortal} from "../ReactPortal";
import styles from "./Modal.module.scss";

export type ModalProps = {
    children: React.ReactNode;
    isOpen: boolean;
    handleClose: () => void;
};

export function Modal({children, isOpen, handleClose}: ModalProps) {
    const nodeRef = useRef(null);
    useEffect(() => {
        const closeOnEscapeKey = (e) => (e.key === "Escape" ? handleClose() : null);
        document.body.addEventListener("keydown", closeOnEscapeKey);
        return () => {
            document.body.removeEventListener("keydown", closeOnEscapeKey);
        };
    }, [handleClose]);

    console.log('isOpen', isOpen)

    return (
        <ReactPortal wrapperId="react-portal-modal-container">
            <CSSTransition
                in={isOpen}
                timeout={{entry: 0, exit: 300}}
                unmountOnExit
                classNames={{
                    enterDone: styles.modalEnterDone,
                    exit: styles.modalExit,
                }}
                nodeRef={nodeRef}
            >
                <div className={styles.modal} ref={nodeRef}>
                    <button onClick={handleClose} className="close-btn">
                        Close
                    </button>
                    <div className={styles.modalContent}>{children}</div>
                </div>
            </CSSTransition>
        </ReactPortal>
    );
}