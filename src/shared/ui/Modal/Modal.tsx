import { AnimatePresence, motion, type MotionProps } from 'motion/react';
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  overlayClassName?: string;
  contentClassName?: string;
  closeOnOverlayClick?: boolean;
  contentMotionProps?: MotionProps;
  overlayMotionProps?: MotionProps;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  overlayClassName,
  contentClassName,
  closeOnOverlayClick = true,
  contentMotionProps,
  overlayMotionProps,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={overlayClassName}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeOnOverlayClick ? onClose : undefined}
          {...overlayMotionProps}
        >
          <motion.div
            className={contentClassName}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            {...contentMotionProps}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
