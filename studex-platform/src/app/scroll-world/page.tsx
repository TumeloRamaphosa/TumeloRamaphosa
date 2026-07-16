'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/sections/Navbar';
import { Plus, Eye, Edit2, Trash2, Loader } from 'lucide-react';

interface ScrollWorldProject {
  id: string;
  name: string;
  company_name: string;
  status: 'draft' | 'generating' | 'completed' | 'published' | 'failed';
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
  published_url?: string;
}

export default function ScrollWorldDashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<ScrollWorldProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [workspaceId, setWorkspaceId] = useState<string>('');

  useEffect(() => {
    // In a real app, this would get the workspace from user context
    const fetchProjects = async () => {
      try {
        // TODO: Get workspace ID from auth context
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'generating':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'published':
        return 'bg-purple-100 text-purple-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Scroll-World Projects
            </h1>
            <p className="text-lg text-gray-600">
              Create and manage immersive 3D brand experiences
            </p>
          </div>
          <Link href="/scroll-world/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </Link>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : projects.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-gray-500 mb-4">
              <p className="text-lg font-medium mb-2">No projects yet</p>
              <p className="mb-6">
                Create your first scroll-world project to get started
              </p>
            </div>
            <Link href="/scroll-world/new">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Create Project
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Thumbnail */}
                {project.thumbnail_url && (
                  <img
                    src={project.thumbnail_url}
                    alt={project.name}
                    className="w-full h-48 object-cover"
                  />
                )}

                {/* Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-600">{project.company_name}</p>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-4">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {project.published_url && (
                      <a
                        href={project.published_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white text-sm flex items-center justify-center gap-2">
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                      </a>
                    )}
                    <Link href={`/scroll-world/${project.id}`} className="flex-1">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm flex items-center justify-center gap-2">
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm flex items-center justify-center gap-2"
                      onClick={() => {
                        // TODO: Implement delete with confirmation
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>

                  {/* Metadata */}
                  <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                    <p>
                      Created{' '}
                      {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
