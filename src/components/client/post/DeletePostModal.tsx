// src/components/client/post/DeletePostModal.tsx
'use client';

import { Dialog } from '@headlessui/react';

interface Props {
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeletePostModal({ onClose, onConfirm }: Props) {
  return (
    <Dialog open onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded p-6 w-full max-w-sm">
          <Dialog.Title className="text-lg font-bold mb-4">Remover post</Dialog.Title>
          <p className="text-sm text-gray-700 mb-6">
            Tem certeza que deseja remover este post? Esta ação não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="text-sm text-gray-500">Cancelar</button>
            <button
              onClick={onConfirm}
              className="text-sm font-semibold text-white bg-red-600 px-4 py-2 rounded"
            >
              Remover
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
