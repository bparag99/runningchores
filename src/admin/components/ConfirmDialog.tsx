import { Modal } from './ui/Modal'
import { Button } from './ui/Button'

type ConfirmDialogProps = {
    isOpen: boolean
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    destructive?: boolean
    onConfirm: () => void
    onClose: () => void
}

export function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    destructive = false,
    onConfirm,
    onClose,
}: ConfirmDialogProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>
                        {cancelLabel}
                    </Button>
                    <Button
                        variant={destructive ? 'danger' : 'primary'}
                        onClick={() => {
                            onConfirm()
                            onClose()
                        }}
                    >
                        {confirmLabel}
                    </Button>
                </>
            }
        >
            <p className="text-sm leading-6 text-slate-600">{message}</p>
        </Modal>
    )
}
