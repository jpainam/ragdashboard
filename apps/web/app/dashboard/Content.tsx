"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Progress } from "@workspace/ui/components/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import {
  BarChart3,
  Download,
  FileText,
  Folder,
  FolderPlus,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { useState } from "react";

interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

interface FolderData {
  id: string;
  name: string;
  description: string;
  documents: Document[];
  createdAt: Date;
  totalSize: number;
  documentCount: number;
}

export function DocumentManager() {
  const [folders, setFolders] = useState<FolderData[]>([
    {
      id: "1",
      name: "HR Policies",
      description: "Human resources policies and procedures",
      documents: [
        {
          id: "1",
          name: "Employee Handbook.pdf",
          size: 2500000,
          type: "pdf",
          uploadedAt: new Date("2024-01-15"),
        },
        {
          id: "2",
          name: "Leave Policy.docx",
          size: 850000,
          type: "docx",
          uploadedAt: new Date("2024-01-20"),
        },
      ],
      createdAt: new Date("2024-01-10"),
      totalSize: 3350000,
      documentCount: 2,
    },
    {
      id: "2",
      name: "Technical Documentation",
      description: "API docs, system architecture, and technical guides",
      documents: [
        {
          id: "3",
          name: "API Documentation.md",
          size: 450000,
          type: "md",
          uploadedAt: new Date("2024-01-25"),
        },
      ],
      createdAt: new Date("2024-01-12"),
      totalSize: 450000,
      documentCount: 1,
    },
  ]);

  const [selectedFolder, setSelectedFolder] = useState<FolderData | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderDescription, setNewFolderDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const getFileTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return "bg-red-100 text-red-800";
      case "docx":
      case "doc":
        return "bg-blue-100 text-blue-800";
      case "txt":
      case "md":
        return "bg-gray-100 text-gray-800";
      case "xlsx":
      case "xls":
        return "bg-green-100 text-green-800";
      default:
        return "bg-purple-100 text-purple-800";
    }
  };

  const createFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: FolderData = {
        id: Date.now().toString(),
        name: newFolderName,
        description: newFolderDescription,
        documents: [],
        createdAt: new Date(),
        totalSize: 0,
        documentCount: 0,
      };
      setFolders([...folders, newFolder]);
      setNewFolderName("");
      setNewFolderDescription("");
      setIsCreateFolderOpen(false);
    }
  };

  const handleFileUpload = (folderId: string, files: FileList) => {
    const folder = folders.find((f) => f.id === folderId);
    if (!folder) return;

    const newDocuments: Document[] = Array.from(files).map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.name.split(".").pop() || "unknown",
      uploadedAt: new Date(),
    }));

    const updatedFolders = folders.map((f) => {
      if (f.id === folderId) {
        const updatedDocuments = [...f.documents, ...newDocuments];
        return {
          ...f,
          documents: updatedDocuments,
          documentCount: updatedDocuments.length,
          totalSize: updatedDocuments.reduce((sum, doc) => sum + doc.size, 0),
        };
      }
      return f;
    });

    setFolders(updatedFolders);
    setSelectedFolder(updatedFolders.find((f) => f.id === folderId) || null);
  };

  const filteredFolders = folders.filter(
    (folder) =>
      folder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      folder.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDocuments = folders.reduce(
    (sum, folder) => sum + folder.documentCount,
    0
  );
  const totalSize = folders.reduce((sum, folder) => sum + folder.totalSize, 0);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Document Management
          </h1>
          <p className="text-gray-600">
            Organize your documents for AI-powered retrieval and analysis
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Folders
              </CardTitle>
              <Folder className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{folders.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Documents
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDocuments}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Storage Used
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatFileSize(totalSize)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Storage Limit
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">10 GB</div>
              <Progress
                value={(totalSize / (10 * 1024 * 1024 * 1024)) * 100}
                className="mt-2"
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Folders Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Folders</CardTitle>
                  <Dialog
                    open={isCreateFolderOpen}
                    onOpenChange={setIsCreateFolderOpen}
                  >
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <FolderPlus className="h-4 w-4 mr-2" />
                        New Folder
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Folder</DialogTitle>
                        <DialogDescription>
                          Create a new folder to organize your documents.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="folder-name">Folder Name</Label>
                          <Input
                            id="folder-name"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            placeholder="Enter folder name"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="folder-description">
                            Description
                          </Label>
                          <Input
                            id="folder-description"
                            value={newFolderDescription}
                            onChange={(e) =>
                              setNewFolderDescription(e.target.value)
                            }
                            placeholder="Enter folder description"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={createFolder}>Create Folder</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search folders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {filteredFolders.map((folder) => (
                    <div
                      key={folder.id}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedFolder?.id === folder.id
                          ? "bg-blue-50 border-blue-200"
                          : ""
                      }`}
                      onClick={() => setSelectedFolder(folder)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {folder.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {folder.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-gray-400">
                              {folder.documentCount} documents
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatFileSize(folder.totalSize)}
                            </span>
                          </div>
                        </div>
                        <Folder className="h-5 w-5 text-gray-400 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Panel */}
          <div className="lg:col-span-2">
            {selectedFolder ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedFolder.name}</CardTitle>
                      <CardDescription>
                        {selectedFolder.description}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.multiple = true;
                          input.accept = ".pdf,.doc,.docx,.txt,.md,.xlsx,.xls";
                          input.onchange = (e) => {
                            const files = (e.target as HTMLInputElement).files;
                            if (files) {
                              handleFileUpload(selectedFolder.id, files);
                            }
                          };
                          input.click();
                        }}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Files
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="documents" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="documents">Documents</TabsTrigger>
                      <TabsTrigger value="stats">Statistics</TabsTrigger>
                    </TabsList>

                    <TabsContent value="documents" className="mt-6">
                      {selectedFolder.documents.length === 0 ? (
                        <div className="text-center py-12">
                          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No documents yet
                          </h3>
                          <p className="text-gray-500 mb-4">
                            Upload your first document to get started
                          </p>
                          <Button
                            onClick={() => {
                              const input = document.createElement("input");
                              input.type = "file";
                              input.multiple = true;
                              input.accept =
                                ".pdf,.doc,.docx,.txt,.md,.xlsx,.xls";
                              input.onchange = (e) => {
                                const files = (e.target as HTMLInputElement)
                                  .files;
                                if (files) {
                                  handleFileUpload(selectedFolder.id, files);
                                }
                              };
                              input.click();
                            }}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Documents
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {selectedFolder.documents.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                            >
                              <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-gray-400" />
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {doc.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {formatFileSize(doc.size)} • Uploaded{" "}
                                    {doc.uploadedAt.toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="secondary"
                                  className={getFileTypeColor(doc.type)}
                                >
                                  {doc.type.toUpperCase()}
                                </Badge>
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="stats" className="mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">
                              Folder Statistics
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Total Documents:
                              </span>
                              <span className="font-medium">
                                {selectedFolder.documentCount}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total Size:</span>
                              <span className="font-medium">
                                {formatFileSize(selectedFolder.totalSize)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Created:</span>
                              <span className="font-medium">
                                {selectedFolder.createdAt.toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Average File Size:
                              </span>
                              <span className="font-medium">
                                {selectedFolder.documentCount > 0
                                  ? formatFileSize(
                                      selectedFolder.totalSize /
                                        selectedFolder.documentCount
                                    )
                                  : "0 Bytes"}
                              </span>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">
                              File Types
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {selectedFolder.documents.length > 0 ? (
                              <div className="space-y-3">
                                {Object.entries(
                                  selectedFolder.documents.reduce(
                                    (acc, doc) => {
                                      acc[doc.type] = (acc[doc.type] || 0) + 1;
                                      return acc;
                                    },
                                    {} as Record<string, number>
                                  )
                                ).map(([type, count]) => (
                                  <div
                                    key={type}
                                    className="flex items-center justify-between"
                                  >
                                    <div className="flex items-center gap-2">
                                      <Badge
                                        variant="secondary"
                                        className={getFileTypeColor(type)}
                                      >
                                        {type.toUpperCase()}
                                      </Badge>
                                    </div>
                                    <span className="text-sm text-gray-600">
                                      {count} files
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 text-center py-4">
                                No files to analyze
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Select a folder
                    </h3>
                    <p className="text-gray-500">
                      Choose a folder from the left panel to view its contents
                      and statistics
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
