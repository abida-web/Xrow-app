import { FolderOpen, Plus } from "lucide-react";
import React from "react";

const CollectionsPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center max-w-md">
        {/* Empty state illustration/icon */}
        <div className="mb-6 inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800">
          <FolderOpen className="w-12 h-12 text-gray-400 dark:text-gray-500" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          No collections yet
        </h2>

        {/* Description */}
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Create your first collection to start organizing and saving your
          favorite items.
        </p>

        {/* CTA Button */}
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#06102c] hover:bg-[#020819] text-white font-medium rounded-lg transition-colors duration-200">
          <Plus className="w-5 h-5" />
          Create your first collection
        </button>
      </div>
    </div>
  );
};

export default CollectionsPage;
