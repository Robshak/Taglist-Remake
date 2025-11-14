import { AnimatePresence, motion } from 'motion/react';
import { memo } from 'react';

import s from './CreateTagForm.module.scss';

interface ICreateTagFormProps {
  newTagName: string;
  onNewTagNameChange: (value: string) => void;
  onSubmit: () => void;
  tagError: string | null;
  onClearError: () => void;
  placeholder: string;
  submitButtonText: string;
}

export const CreateTagForm = memo(
  ({
    newTagName,
    onNewTagNameChange,
    onSubmit,
    tagError,
    onClearError,
    placeholder,
    submitButtonText,
  }: ICreateTagFormProps) => {
    return (
      <motion.div
        className={s.createFormWrapper}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      >
        <div className={s.createForm}>
          <div className={s.createFields}>
            <input
              type="text"
              placeholder={placeholder}
              value={newTagName}
              onChange={(e) => {
                onNewTagNameChange(e.target.value);
                if (tagError) onClearError();
              }}
              onKeyPress={(e) => e.key === 'Enter' && onSubmit()}
              autoFocus
              className={tagError ? s.hasError : ''}
            />
            <button onClick={onSubmit} disabled={!newTagName.trim()}>
              {submitButtonText}
            </button>
          </div>
          <AnimatePresence>
            {tagError && (
              <motion.div
                className={s.error}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                {tagError}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }
);

CreateTagForm.displayName = 'CreateTagForm';
