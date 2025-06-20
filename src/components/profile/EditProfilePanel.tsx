// File: src/components/profile/EditProfilePanel.tsx
'use client';

import React, { FormEvent } from 'react';
import Image from 'next/image';
import { Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@components/ui/Buttons';
import { on } from 'events';

interface Props {
    isOpen: boolean;
    editName: string;
    editBio: string;
    editAvatar: string
    onNameChange: (name: string) => void;
    onBioChange: (bio: string) => void;
    onAvatarChange: (file: File) => void;
    onSave: (e: FormEvent) => void;
    onCancel: () => void;
}

export default function EditProfilePanel({
    isOpen,
    editName,
    editBio,
    editAvatar,
    onNameChange,
    onBioChange,
    onAvatarChange,
    onSave,
    onCancel,
}: Props) {
    return (
        <AnimatePresence initial={false}>
            {isOpen && (
                <>
                    <motion.div
                        key="backdrop"
                        className="fixed inset-0 z-20 bg-black/40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onCancel}
                    />

                    <motion.div
                        key="panel"
                        className="
                            fixed top-0 right-0 z-30
                            h-full w-full sm:w-80 md:w-96
                            bg-[var(--surface-bg)] p-6 overflow-auto shadow-lg
                        "
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                    >
                        <h2 className="text-xl font-semibold mb-4">Editar Perfil</h2>
                        <form onSubmit={onSave} className="space-y-6">
                            <div className="flex items-center gap-4">
                                <label
                                    htmlFor="avatar-upload"
                                    className="relative cursor-pointer"
                                    title="Clique para alterar a foto do perfil"
                                >
                                    <Image
                                        src={editAvatar}
                                        alt="Avatar"
                                        width={64}
                                        height={64}
                                        className="rounded-full border"
                                    />
                                    <div className="
                                        absolute inset-0 bg-black/20
                                        opacity-0 hover:opacity-100
                                        rounded-full flex items-center justify-center
                                    ">
                                        <span className="text-[var(--text-primary)] text-sm"><Upload /></span>
                                    </div>
                                </label>
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) onAvatarChange(file);
                                    }}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Nome</label>
                                <input 
                                    type="text" 
                                    value={editName}
                                    onChange={e => onNameChange(e.target.value)}
                                    className="w-full rounded border px-3 py-2 bg-[var(--surface-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Biografia</label>
                                <textarea 
                                    rows={3}
                                    value={editBio}
                                    onChange={e => onBioChange(e.target.value)}
                                    className="w-full rounded border px-3 py-2 bg-[var(--surface-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={onCancel}>Cancelar</Button>
                                <Button type="submit">Salvar</Button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}