import React from "react";
import {
  ClipboardCopy,
  Trash,
  File,
  FileText,
  FileImage,
  FileArchive,
} from "lucide-react";
import { toast } from "react-toastify";

// Helper to determine the file display type
const getFileType = (contentType) => {
  if (contentType.startsWith("image/")) return "image";
  if (contentType === "application/pdf") return "pdf";
  if (
    contentType === "application/msword" ||
    contentType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return "doc";
  return "other";
};

const ImageGallery = ({ files, handleDelete }) => {
  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("File URL copied to clipboard!");
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 justify-center ">
      {files.map((file, index) => {
        const fileType = getFileType(file.contentType);

        return (
          <div
            key={index}
            className="rounded-2xl max-w-[350px] shadow-lg p-2 flex flex-col items-center justify-center relative bg-white"
          >
            {/* Display Image Preview */}
            {fileType === "image" ? (
              <img
                src={file.url}
                alt={file.filename}
                className="w-full h-40 object-contain rounded-xl mb-4"
              />
            ) : (
              // Display File Icon for non-images
              <div className="flex flex-col items-center justify-center w-full h-40 bg-gray-100 rounded-xl mb-4">
                {fileType === "pdf" && (
                  <FileText className="w-12 h-12 text-red-500 mb-2" />
                )}
                {fileType === "doc" && (
                  <FileText className="w-12 h-12 text-blue-500 mb-2" />
                )}
                {fileType === "other" && (
                  <File className="w-12 h-12 text-gray-500 mb-2" />
                )}
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm hover:underline"
                >
                  {fileType === "other"
                    ? "Download"
                    : `View ${fileType.toUpperCase()}`}
                </a>
              </div>
            )}

            <div className="text-center mb-4 px-4">
              <h2 className="text-lg font-semibold mb-2 truncate max-w-[300px]">
                {file.filename}
              </h2>
              <p className="text-gray-600 text-sm">
                Uploaded: {new Date(file.uploadDate).toLocaleString()}
              </p>
            </div>

            <div className="flex gap-2 absolute top-4 right-4">
              <ClipboardCopy
                onClick={() => copyToClipboard(file.url)}
                className="text-blue-500 hover:text-blue-950 transition-all duration-150 cursor-pointer"
              />
              <Trash
                onClick={() => handleDelete(file)}
                className="text-red-500 hover:text-red-950 transition-all duration-150 cursor-pointer"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ImageGallery;
