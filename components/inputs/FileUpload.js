import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";

export const FileUpload = ({
  label,
  accept = "",
  multiple = false,
  onFileSelect = () => {},
  maxSize = 10 * 1024 * 1024,
  showPreview = true,
  required = false,
  disabled = false,
}) => {
  const [files, setFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = (fileList) => {
    const validFiles = Array.from(fileList).filter((file) => {
      if (file.size > maxSize) {
        alert(
          `File ${file.name} is too large. Max size is ${
            maxSize / 1024 / 1024
          }MB`
        );
        return false;
      }
      return true;
    });

    setFiles((prev) => [...prev, ...validFiles]);
    onFileSelect(validFiles);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex flex-row justify-between items-end">
          {label && (
            <label
              className={`block text-xs lg:text-sm dm-sans-regular mb-1.5`}
            >
              {label}
              {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
          )}
        </div>
      )}

      <div
        className={`
          group bg-white dark:bg-darkBG3 dark:text-white transition-colors border border-stone-200 dark:border-stone-800 hover:border-black hover:dark:stone-500 rounded-lg p-6 text-center cursor-pointer transition-all duration-500 ease-in-out
          ${
            isDragOver
              ? `border-blue-500 bg-blue-50 dark:bg-blue-900/20`
              : "border-stone-300 dark:border-stone-600"
          }
        `}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-8 h-8 group-hover:text-blue-500 mx-auto mb-2 text-stone-400 transition-all duration-700 ease-in-out" />
        <p className="text-sm text-stone-600 dm-sans-regular dark:text-stone-400">
          Drop files here or click to browse
        </p>
        <p className="text-xs text-stone-500 dm-sans-regular mt-1">
          Max file size: {maxSize / 1024 / 1024}MB
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {showPreview && files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className={`
              flex items-center bg-transparent border-black justify-between px-3 py-2 rounded-lg border bg-stone-50 border-stone-200
            `}
            >
              <span className="text-sm truncate dm-sans-regular text-black dark:text-white">
                {file.name}
              </span>
              <button
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-black transition-all duration-300 ease-in-out flex flex-row gap-1 items-center dm-sans-light text-sm"
              >
                Remove
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
