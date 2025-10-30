import { useState, useRef } from 'react';
import { Upload, FileText, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (content: string, fileName: string) => void;
  isAnalyzing: boolean;
}

export function FileUpload({ onFileSelect, isAnalyzing }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    const validTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (!validTypes.includes(file.type) && !file.name.match(/\.(txt|pdf|docx)$/i)) {
      alert('Please upload a valid resume file (.txt, .pdf, or .docx)');
      return;
    }

    setSelectedFile(file);

    try {
      const content = await readFileContent(file);
      onFileSelect(content, file.name);
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Error reading file. Please try again.');
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };

      reader.onerror = () => reject(reader.error);

      reader.readAsText(file);
    });
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
            transition-all duration-200
            ${isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }
          `}
        >
          <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Upload Your Resume
          </h3>
          <p className="text-gray-500 mb-4">
            Drag and drop your resume here, or click to browse
          </p>
          <p className="text-sm text-gray-400">
            Supported formats: .txt, .pdf, .docx
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf,.docx"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      ) : (
        <div className="border-2 border-green-500 rounded-lg p-8 bg-green-50">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-10 h-10 text-green-600" />
              <div>
                <h4 className="font-semibold text-gray-800">{selectedFile.name}</h4>
                <p className="text-sm text-gray-600">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            {!isAnalyzing && (
              <button
                onClick={clearFile}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
          {isAnalyzing && (
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="text-sm text-gray-600">Analyzing your resume...</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
