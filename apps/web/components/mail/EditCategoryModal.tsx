import { useCategoryStore, useUIStore } from "@repo/store";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string;
  initialName: string;
  initialDescription: string;
}

export const EditCategoryModal = ({
  isOpen,
  onClose,
  categoryId,
  initialName,
  initialDescription,
}: EditCategoryModalProps) => {
  const { updateCategory } = useCategoryStore();
  const { loading } = useUIStore();

  const [name, setName] = useState<string>(initialName);
  const [description, setDescription] = useState<string>(initialDescription);

  useEffect(() => {
    if (!isOpen) return;
    setName(initialName);
    setDescription(initialDescription);
  }, [isOpen, initialName, initialDescription]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCategory(categoryId, {
      name: name.trim(),
      description: description.trim(),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-xl border border-[#363636] bg-[#171717] p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-100">Edit Category</h3>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-md p-1 text-gray-500 transition hover:bg-[#242424] hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="edit-name"
              className="mb-1 block text-sm font-medium text-gray-300"
            >
              Category Name
            </label>
            <input
              id="edit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-[#353535] bg-[#111111] px-3 py-2 text-gray-100 placeholder-gray-500 outline-none transition focus:border-[#525252] focus:ring-1 focus:ring-[#525252]"
              placeholder="Enter category name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="edit-description"
              className="mb-1 block text-sm font-medium text-gray-300"
            >
              Description
            </label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-[#353535] bg-[#111111] px-3 py-2 text-gray-100 placeholder-gray-500 outline-none transition focus:border-[#525252] focus:ring-1 focus:ring-[#525252]"
              placeholder="Enter category description"
              rows={3}
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-[#343434] px-4 py-2 text-gray-300 transition hover:bg-[#232323]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim() || !description.trim()}
              className="rounded-md bg-[#2b2b2b] px-4 py-2 text-white transition hover:bg-[#3a3a3a] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
