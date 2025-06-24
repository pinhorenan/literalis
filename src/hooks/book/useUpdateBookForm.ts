// src/hooks/book/useUpdateBookForm.ts
'use client';

import { useState } from 'react';
import type { BookDTO } from '@/src/models/book.model';
import { useUpdateBookMutation } from '@hooks/book/useUpdateBookMutation';

export function useUpdateBookForm(initialBook: BookDTO) {
  const [book, setBook] = useState<BookDTO>(initialBook);
  const [editTitle, setEditTitle] = useState(initialBook.title);
  const [editAuthor, setEditAuthor] = useState(initialBook.author);
  const [editCoverUrl, setEditCoverUrl] = useState(initialBook.coverUrl);
  const [isEditing, setIsEditing] = useState(false);

  const { updateBook, loading, error } = useUpdateBookMutation();

  function startEditing() {
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
    setEditTitle(book.title);
    setEditAuthor(book.author);
    setEditCoverUrl(book.coverUrl);
  }

  function handleTitleChange(value: string) {
    setEditTitle(value);
  }

  function handleAuthorChange(value: string) {
    setEditAuthor(value);
  }

  function handleCoverUpload(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setEditCoverUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  async function saveBook() {
    const updated = await updateBook(book.isbn, {
      title: editTitle,
      author: editAuthor,
      coverUrl: editCoverUrl,
    });

    if (updated) {
      setBook(updated);
      setIsEditing(false);
    }
  }

  return {
    book,
    isEditing,
    editTitle,
    editAuthor,
    editCoverUrl,
    loading,
    error,
    startEditing,
    cancelEditing,
    handleTitleChange,
    handleAuthorChange,
    handleCoverUpload,
    saveBook,
  };
}
