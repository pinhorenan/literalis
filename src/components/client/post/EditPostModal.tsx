// src/components/client/post/EditPostModal.tsx
'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { updatePostRequest } from '@services/client/post.service';
import type { UpdatePostDTO } from '@/src/models/post.model';

interface Props {
  postId: string;
  initialContent: string;
  initialProgress: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditPostModal({
  postId,
  initialContent,
  initialProgress,
  onClose,
  onSuccess,
}: Props) {
  const [content, setContent] = useState(initialContent);
  const [progress, setProgress] = useState(initialProgress);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    try {
      const data: UpdatePostDTO = { content, progress };
      await updatePostRequest(postId, data);
      onSuccess();
      onClose();
    } catch (err) {
      alert('Erro ao atualizar post');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded p-6 w-full max-w-md">
          <Dialog.Title className="text-lg font-bold mb-4">Editar post</Dialog.Title>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full border rounded p-2 mb-4"
          />
          <input
            type="number"
            value={progress}
            onChange={e => setProgress(Number(e.target.value))}
            min={0}
            max={100}
            className="w-full border rounded p-2 mb-4"
          />
          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="text-sm text-gray-500">Cancelar</button>
            <button onClick={handleSave} disabled={loading} className="text-sm font-semibold text-white bg-blue-600 px-4 py-2 rounded">
              Salvar
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
