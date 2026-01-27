import React from 'react';
import Button from './Button';
import { AlertCircle, X } from 'lucide-react';
import './ConfirmDialog.css';

/**
 * 确认对话框组件
 * 用于需要用户确认的操作（如：退出、删除等）
 */
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = '确认操作',
  message = '确定要继续吗？',
  confirmText = '确定',
  cancelText = '取消',
  variant = 'warning' // warning, danger, info
}) => {
  if (!isOpen) return null;
  
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div className="confirm-dialog-backdrop" onClick={handleBackdropClick}>
      <div className="confirm-dialog">
        <button className="confirm-dialog__close" onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className={`confirm-dialog__icon confirm-dialog__icon--${variant}`}>
          <AlertCircle size={48} />
        </div>
        
        <h3 className="confirm-dialog__title">{title}</h3>
        <p className="confirm-dialog__message">{message}</p>
        
        <div className="confirm-dialog__actions">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="confirm-dialog__cancel"
          >
            {cancelText}
          </Button>
          <Button 
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="confirm-dialog__confirm"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
