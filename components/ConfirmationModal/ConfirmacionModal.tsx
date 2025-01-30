// components/ConfirmationModal.tsx
'use client';

import { useState } from 'react';

interface ConfirmationModalProps {
	isOpen: boolean;
	title: string;
	description: string;
	onConfirm: () => void;
	onCancel: () => void;
}

export function ConfirmationModal({
	isOpen,
	title,
	description,
	onConfirm,
	onCancel,
}: ConfirmationModalProps) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
			<div className="bg-white rounded-lg shadow-lg p-6 w-96">
				<h2 className="text-lg font-semibold mb-4">{title}</h2>
				<p className="text-gray-700 mb-6">{description}</p>
				<div className="flex justify-end gap-4">
					<button
						onClick={onCancel}
						className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded"
					>
						Cancelar
					</button>
					<button
						onClick={onConfirm}
						className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
					>
						Confirmar
					</button>
				</div>
			</div>
		</div>
	);
}
