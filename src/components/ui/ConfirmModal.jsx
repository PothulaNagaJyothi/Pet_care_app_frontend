import Modal from "./Modal";
import Button from "./Button";

function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <Modal onClose={onCancel}>
      <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
        {title}
      </h2>

      <p className="text-slate-600 dark:text-slate-400 mb-8">
        {message}
      </p>

      <div className="flex justify-end gap-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>

        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}

export default ConfirmModal;