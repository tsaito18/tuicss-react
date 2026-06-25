import type { ComponentPropsWithoutRef, Ref } from 'react';
import { cx } from '../../utils/cx';

export interface TextareaProps extends ComponentPropsWithoutRef<'textarea'> {
  ref?: Ref<HTMLTextAreaElement>;
}

export function Textarea({ className, ref, ...props }: TextareaProps) {
  return <textarea ref={ref} className={cx('tui-textarea', className)} {...props} />;
}
