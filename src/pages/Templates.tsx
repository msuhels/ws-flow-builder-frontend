import React, { useState, useEffect } from 'react';
import { Plus, Send, RefreshCw, CheckCircle, XCircle, Clock, Trash2, Edit } from 'lucide-react';
import api from '../lib/axios';

interface Template {
  id: string;
  name: string;
  language: string;
  category: string;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
  components: any[];
  createdAt: string;
  updatedAt: string;
}

const Templates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(false);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    language: 'en',
    category: 'MARKETING',
    headerType: 'TEXT' as 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT',
    headerText: '',
    headerMediaUrl: '',
    bodyText: '',
    footerText: '',
    buttons: [] as { type: string; text: string }[],
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
  };

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await api.get('/templates');
      setTemplates(response.data.data || []);
    } catch (error: any) {
      console.error('Failed to fetch templates:', error);
      showToast('error', error.response?.data?.error || 'Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/templates', formData);
      setShowCreateModal(false);
      fetchTemplates();
      resetForm();
      showToast('success', 'Template created successfully');
    } catch (error: any) {
      console.error('Failed to create template:', error);
      showToast('error', error.response?.data?.error || 'Failed to create template');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTemplate = (template: Template) => {
    if (template.status !== 'DRAFT') {
      showToast('error', 'Only DRAFT templates can be edited');
      return;
    }

    setEditingTemplate(template);
    
    // Extract data from components
    const headerComp = template.components.find((c: any) => c.type === 'HEADER');
    const bodyComp = template.components.find((c: any) => c.type === 'BODY');
    const footerComp = template.components.find((c: any) => c.type === 'FOOTER');
    const buttonsComp = template.components.find((c: any) => c.type === 'BUTTONS');

    setFormData({
      name: template.name,
      language: template.language,
      category: template.category,
      headerType: headerComp?.format || 'TEXT',
      headerText: headerComp?.text || '',
      headerMediaUrl: headerComp?.example?.header_handle?.[0] || '',
      bodyText: bodyComp?.text || '',
      footerText: footerComp?.text || '',
      buttons: buttonsComp?.buttons || [],
    });
    
    setShowEditModal(true);
  };

  const handleUpdateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;
    
    setLoading(true);
    try {
      await api.put(`/templates/${editingTemplate.id}`, formData);
      setShowEditModal(false);
      setEditingTemplate(null);
      fetchTemplates();
      resetForm();
      showToast('success', 'Template updated successfully');
    } catch (error: any) {
      console.error('Failed to update template:', error);
      showToast('error', error.response?.data?.error || 'Failed to update template');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitToMeta = async (templateId: string) => {
    setSubmittingId(templateId);
    try {
      const response = await api.post(`/templates/${templateId}/submit`);
      fetchTemplates();
      
      // Show appropriate message based on the returned status
      const status = response.data.data?.status;
      if (status === 'APPROVED') {
        showToast('success', 'Template approved by Meta and ready to use!');
      } else if (status === 'REJECTED') {
        showToast('error', 'Template was rejected by Meta. Please review and create a new one.');
      } else {
        showToast('success', 'Template submitted to Meta for approval');
      }
    } catch (error: any) {
      console.error('Failed to submit template:', error);
      showToast('error', error.response?.data?.error || 'Failed to submit template to Meta');
    } finally {
      setSubmittingId(null);
    }
  };

  const handleSyncStatus = async (templateId: string) => {
    setSyncingId(templateId);
    try {
      const response = await api.get(`/templates/${templateId}/sync`);
      fetchTemplates();
      
      // Show appropriate message based on the synced status
      const status = response.data.data?.status;
      if (status === 'APPROVED') {
        showToast('success', 'Template is approved and ready to use!');
      } else if (status === 'REJECTED') {
        showToast('error', 'Template was rejected by Meta');
      } else if (status === 'PENDING') {
        showToast('success', 'Template is still pending approval');
      } else {
        showToast('success', 'Template status synced from Meta');
      }
    } catch (error: any) {
      console.error('Failed to sync template:', error);
      showToast('error', error.response?.data?.error || 'Failed to sync template status');
    } finally {
      setSyncingId(null);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    setLoading(true);
    try {
      await api.delete(`/templates/${templateId}`);
      fetchTemplates();
      showToast('success', 'Template deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete template:', error);
      showToast('error', error.response?.data?.error || 'Failed to delete template');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      language: 'en',
      category: 'MARKETING',
      headerType: 'TEXT',
      headerText: '',
      headerMediaUrl: '',
      bodyText: '',
      footerText: '',
      buttons: [],
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const renderTemplateForm = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Template Name
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          placeholder="e.g., welcome_message"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Language
          </label>
          <select
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="MARKETING">Marketing</option>
            <option value="UTILITY">Utility</option>
            <option value="AUTHENTICATION">Authentication</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Header Type (Optional)
        </label>
        <select
          value={formData.headerType}
          onChange={(e) => setFormData({ ...formData, headerType: e.target.value as any })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        >
          <option value="TEXT">Text</option>
          <option value="IMAGE">Image</option>
          <option value="VIDEO">Video</option>
          <option value="DOCUMENT">Document</option>
        </select>
      </div>

      {formData.headerType === 'TEXT' ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Header Text
          </label>
          <input
            type="text"
            value={formData.headerText}
            onChange={(e) => setFormData({ ...formData, headerText: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="Header text"
          />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Media URL ({formData.headerType})
          </label>
          <input
            type="url"
            value={formData.headerMediaUrl}
            onChange={(e) => setFormData({ ...formData, headerMediaUrl: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder={`Enter ${formData.headerType.toLowerCase()} URL`}
          />
          <p className="text-xs text-gray-500 mt-1">
            Provide a publicly accessible URL for the {formData.headerType.toLowerCase()}
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Body Text
        </label>
        <textarea
          required
          value={formData.bodyText}
          onChange={(e) => setFormData({ ...formData, bodyText: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          rows={4}
          placeholder="Message body text"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Footer Text (Optional)
        </label>
        <input
          type="text"
          value={formData.footerText}
          onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          placeholder="Footer text"
        />
      </div>
    </>
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">WhatsApp Templates</h1>
          <p className="text-gray-600 mt-1">Create and manage message templates for WhatsApp</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchTemplates}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Template
          </button>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{template.name}</h3>
                <p className="text-sm text-gray-500">{template.category}</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(template.status)}
                <span className="text-sm font-medium">{template.status}</span>
              </div>
            </div>

            <div className="text-sm text-gray-600 space-y-2">
              {template.components.map((comp: any, idx: number) => (
                <div key={idx}>
                  {comp.type === 'BODY' && <p className="line-clamp-3">{comp.text}</p>}
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2 border-t">
              {template.status === 'APPROVED' ? (
                <span className="text-sm text-green-600 flex items-center gap-1 flex-1">
                  <CheckCircle className="w-4 h-4" />
                  Ready to use
                </span>
              ) : template.status === 'PENDING' ? (
                <>
                  <span className="text-sm text-yellow-600 flex-1">Awaiting approval</span>
                  <button
                    onClick={() => handleSyncStatus(template.id)}
                    disabled={syncingId === template.id}
                    className="px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 flex items-center gap-2 disabled:opacity-50"
                    title="Sync status from Meta"
                  >
                    <RefreshCw className={`w-4 h-4 ${syncingId === template.id ? 'animate-spin' : ''}`} />
                  </button>
                </>
              ) : template.status === 'REJECTED' ? (
                <>
                  <span className="text-sm text-red-600 flex-1">Rejected by Meta</span>
                  <button
                    onClick={() => handleDeleteTemplate(template.id)}
                    disabled={loading}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 text-sm"
                    title="Delete and create new"
                  >
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleEditTemplate(template)}
                    disabled={loading}
                    className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleSubmitToMeta(template.id)}
                    disabled={submittingId === template.id}
                    className="flex-1 px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submittingId === template.id ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit
                      </>
                    )}
                  </button>
                </>
              )}
              <button
                onClick={() => handleDeleteTemplate(template.id)}
                disabled={loading}
                className="px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {templates.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">No templates yet. Create your first template!</p>
        </div>
      )}

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create New Template</h2>
            <form onSubmit={handleCreateTemplate} className="space-y-4">
              {renderTemplateForm()}

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Template Modal */}
      {showEditModal && editingTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Template</h2>
            <form onSubmit={handleUpdateTemplate} className="space-y-4">
              {renderTemplateForm()}

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingTemplate(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
          <div
            className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg ${
              toast.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 hover:opacity-80"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Templates;
