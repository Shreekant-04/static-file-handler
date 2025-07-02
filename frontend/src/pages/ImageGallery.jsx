  import React, { useState } from "react";
  import {
    ClipboardCopy,
    Trash,
    File,
    FileText,
    FileImage,
    FileArchive,
    Eye,
  } from "lucide-react";
  import { toast } from "react-toastify";
  import Pagination from "../components/Pagination";
  import { useSelector } from "react-redux";

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
  const ImageGallery = ({ files, handleDelete, setpage }) => {
    const { pagination } = useSelector((state) => state.uploader);

    const copyToClipboard = (url) => {
      navigator.clipboard.writeText(url);
      toast.success("File URL copied to clipboard!");
    };

    const handlenavigate = (url) => {
      window.open(url, "_blank");
    };

    return (
      <>
        <div className="flex flex-wrap gap-4 p-4 justify-center">
          {files.map((file, index) => {
            const fileType = getFileType(file.contentType);

            return (
              <div
                key={index}
                className="rounded-2xl w-[290px] h-[250px] shadow-lg p-2 flex flex-col items-center justify-between relative bg-white"
              >
                {/* Preview Area (fixed size) */}
                <div className="w-full h-[200px] flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden mb-4">
                  {fileType === "image" ? (
                    <img
                      src={file.url}
                      alt={file.filename}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
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
                </div>

                {/* File Info */}
                <div className="text-center mb-2 px-2">
                  <h2 className="text-base font-semibold truncate max-w-[220px] mb-1">
                    {file?.originalname || file.filename}
                  </h2>
                  <p className="text-gray-600 text-xs">
                    Uploaded: {new Date(file.uploadDate).toLocaleString()}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 absolute top-3 right-2">
                  <Eye
                    onClick={() => handlenavigate(file.url)}
                    className="text-blue-300 hover:text-blue-500 cursor-pointer duration-150"
                  />
                  <ClipboardCopy
                    onClick={() => copyToClipboard(file.url)}
                    className="text-blue-300 hover:text-blue-500 transition-all duration-150 cursor-pointer"
                  />
                  <Trash
                    onClick={() => handleDelete(file)}
                    className="text-red-300 hover:text-red-500 transition-all duration-150 cursor-pointer"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {pagination?.totalPages > 1 && (
          <Pagination
            totalPage={pagination.totalPages}
            page={pagination.currentPage}
            setpage={(p) => setpage(p)}
          />
        )}
      </>
    );
  };

  export default ImageGallery;
