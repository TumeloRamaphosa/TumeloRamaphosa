'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/sections/Navbar';
import { ArrowLeft, Plus, Trash2, Zap, Eye } from 'lucide-react';

interface Scene {
  id: string;
  order: number;
  title: string;
  description: string;
  briefing: string;
  aspect_ratio: '16:9' | '9:16';
  transition_duration: number;
  diorama_style?: string;
}

interface Project {
  id: string;
  name: string;
  company_name: string;
  description: string;
  status: 'draft' | 'generating' | 'completed' | 'published' | 'failed';
  brand_color: string;
  brand_accent_color: string;
  scenes?: Scene[];
  published_url?: string;
}

export default function ProjectDetail() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [project, setProject] = useState<Project | null>(null);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showAddScene, setShowAddScene] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [newScene, setNewScene] = useState({
    title: '',
    description: '',
    briefing: '',
    aspect_ratio: '16:9' as const,
    diorama_style: '',
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        // TODO: Fetch project from API
        setLoading(false);
      } catch (error) {
        console.error('Error fetching project:', error);
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleAddScene = async () => {
    if (!newScene.title) return;

    // TODO: Add scene via API
    setScenes([
      ...scenes,
      {
        id: Math.random().toString(),
        order: scenes.length,
        ...newScene,
        transition_duration: 500,
      },
    ]);

    setNewScene({
      title: '',
      description: '',
      briefing: '',
      aspect_ratio: '16:9',
      diorama_style: '',
    });
    setShowAddScene(false);
  };

  const handleDeleteScene = (sceneId: string) => {
    // TODO: Delete scene via API
    setScenes(scenes.filter((s) => s.id !== sceneId));
  };

  const handleGenerate = async () => {
    if (scenes.length === 0) {
      alert('Please add at least one scene before generating');
      return;
    }

    setGenerating(true);
    try {
      // TODO: Call generate API
      // await fetch(`/api/scroll-world/generate`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     project_id: projectId,
      //     scene_ids: scenes.map(s => s.id),
      //   }),
      // });

      alert('Generation started! Check back soon for your scroll-world.');
    } catch (error) {
      alert('Failed to start generation');
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <p className="text-red-600">Project not found</p>
          <Link href="/scroll-world">
            <Button className="mt-4">Back to Projects</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <Link
          href="/scroll-world"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {project.name}
            </h1>
            <p className="text-gray-600">{project.company_name}</p>
          </div>
          <div className="flex gap-2">
            {project.published_url && (
              <a href={project.published_url} target="_blank" rel="noopener noreferrer">
                <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  View Published
                </Button>
              </a>
            )}
            <Button
              onClick={handleGenerate}
              disabled={generating || scenes.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              {generating ? 'Generating...' : 'Generate World'}
            </Button>
          </div>
        </div>

        {/* Status */}
        <Card className="mb-8 p-4 bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Status:</strong> {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </p>
        </Card>

        <div className="grid grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="col-span-2">
            {/* Scenes */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Scenes</h2>
                {!showAddScene && (
                  <Button
                    onClick={() => setShowAddScene(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Scene
                  </Button>
                )}
              </div>

              {/* Add Scene Form */}
              {showAddScene && (
                <Card className="p-6 mb-6 bg-blue-50 border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    New Scene
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        Title
                      </label>
                      <Input
                        type="text"
                        value={newScene.title}
                        onChange={(e) =>
                          setNewScene({ ...newScene, title: e.target.value })
                        }
                        placeholder="e.g., Product Showcase"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        Description
                      </label>
                      <textarea
                        value={newScene.description}
                        onChange={(e) =>
                          setNewScene({ ...newScene, description: e.target.value })
                        }
                        placeholder="What happens in this scene?"
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        Briefing (for AI generation)
                      </label>
                      <textarea
                        value={newScene.briefing}
                        onChange={(e) =>
                          setNewScene({ ...newScene, briefing: e.target.value })
                        }
                        placeholder="Detailed instructions for the AI to generate this scene..."
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          Aspect Ratio
                        </label>
                        <select
                          value={newScene.aspect_ratio}
                          onChange={(e) =>
                            setNewScene({
                              ...newScene,
                              aspect_ratio: e.target.value as '16:9' | '9:16',
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="16:9">Landscape (16:9)</option>
                          <option value="9:16">Portrait (9:16)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          Style
                        </label>
                        <Input
                          type="text"
                          value={newScene.diorama_style}
                          onChange={(e) =>
                            setNewScene({ ...newScene, diorama_style: e.target.value })
                          }
                          placeholder="e.g., modern, vintage, futuristic"
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={() => setShowAddScene(false)}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddScene}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Add Scene
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Scenes List */}
              <div className="space-y-4">
                {scenes.length === 0 ? (
                  <Card className="p-8 text-center text-gray-500">
                    <p className="font-medium mb-2">No scenes yet</p>
                    <p className="text-sm">Add scenes to start building your scroll-world</p>
                  </Card>
                ) : (
                  scenes.map((scene, index) => (
                    <Card key={scene.id} className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="inline-block bg-blue-600 text-white w-8 h-8 rounded-full text-center leading-8 font-semibold">
                              {index + 1}
                            </span>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {scene.title}
                            </h3>
                          </div>
                          <p className="text-gray-600 text-sm">{scene.description}</p>
                        </div>
                        <Button
                          onClick={() => handleDeleteScene(scene.id)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {scene.briefing && (
                        <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 mb-3">
                          <strong>AI Briefing:</strong> {scene.briefing}
                        </div>
                      )}

                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>📐 {scene.aspect_ratio}</span>
                        {scene.diorama_style && <span>🎨 {scene.diorama_style}</span>}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Brand Colors */}
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Brand Colors
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600 mb-2">Primary</p>
                  <div className="flex gap-2 items-center">
                    <div
                      className="w-8 h-8 rounded border border-gray-300"
                      style={{ backgroundColor: project.brand_color }}
                    />
                    <span className="text-sm text-gray-700">{project.brand_color}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-2">Accent</p>
                  <div className="flex gap-2 items-center">
                    <div
                      className="w-8 h-8 rounded border border-gray-300"
                      style={{ backgroundColor: project.brand_accent_color }}
                    />
                    <span className="text-sm text-gray-700">
                      {project.brand_accent_color}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Project Info
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600 font-medium">Scenes</p>
                  <p className="text-gray-900">{scenes.length}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Status</p>
                  <p className="text-gray-900 capitalize">{project.status}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
