'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { authService } from '@/services';
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '@/lib/api';

const roleColors: Record<string, string> = {
  super_admin: 'bg-red-100 text-red-700',
  admin: 'bg-orange-100 text-orange-700',
  marketing: 'bg-blue-100 text-blue-700',
  sales: 'bg-green-100 text-green-700',
  agent: 'bg-purple-100 text-purple-700',
  editor: 'bg-yellow-100 text-yellow-700',
  viewer: 'bg-gray-100 text-gray-600',
};

export function AdminUsersClient() {
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get('/auth/users/').then(r => r.data),
  });

  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm();

  const saveMutation = useMutation({
    mutationFn: (data: any) => editUser
      ? api.patch(`/auth/users/${editUser.id}/`, data)
      : api.post('/auth/users/', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(editUser ? 'User updated!' : 'User created!');
      setShowForm(false); setEditUser(null); reset();
    },
    onError: (err: any) => toast.error(err?.response?.data?.email?.[0] || 'Failed to save user.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/auth/users/${id}/`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); toast.success('User deleted.'); },
  });

  const openEdit = (user: any) => { setEditUser(user); reset({ ...user, password: '', confirm_password: '' }); setShowForm(true); };

  const fieldClass = 'input-luxury text-sm';
  const labelClass = 'label-luxury';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-luxury-black">Users</h1>
          <p className="text-gray-500 text-sm mt-1">{(data?.results || data || []).length} users</p>
        </div>
        <button onClick={() => { setEditUser(null); reset({}); setShowForm(true); }} className="btn-gold gap-2">
          <HiPlus className="w-5 h-5" /> Add User
        </button>
      </div>

      <div className="bg-white border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-luxury-light">
              {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => <tr key={i}>{Array.from({ length: 6 }).map((_, j) => <td key={j} className="px-6 py-4"><div className="h-4 bg-gray-100 animate-pulse rounded" /></td>)}</tr>)
              : (data?.results || data || []).map((user: any) => (
                  <tr key={user.id} className="hover:bg-luxury-light transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">{user.first_name?.[0] || user.email[0].toUpperCase()}</span>
                        </div>
                        <div className="font-medium text-sm">{user.full_name || `${user.first_name} ${user.last_name}`}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${roleColors[user.role] || 'bg-gray-100 text-gray-600'}`}>
                        {user.role?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {user.created_at ? format(new Date(user.created_at), 'MMM d, yyyy') : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(user)} className="p-1.5 text-gray-400 hover:text-gold transition-colors"><HiPencil className="w-4 h-4" /></button>
                        <button onClick={() => confirm(`Delete user "${user.email}"?`) && deleteMutation.mutate(user.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><HiTrash className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative bg-white w-full max-w-lg p-8 z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-xl">{editUser ? 'Edit User' : 'Add User'}</h3>
              <button onClick={() => setShowForm(false)}><HiX className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelClass}>First Name *</label><input {...register('first_name', { required: true })} className={fieldClass} /></div>
                <div><label className={labelClass}>Last Name *</label><input {...register('last_name', { required: true })} className={fieldClass} /></div>
              </div>
              <div><label className={labelClass}>Email *</label><input {...register('email', { required: true })} type="email" className={fieldClass} /></div>
              <div><label className={labelClass}>Username *</label><input {...register('username', { required: true })} className={fieldClass} /></div>
              <div><label className={labelClass}>Phone</label><input {...register('phone')} className={fieldClass} /></div>
              <div>
                <label className={labelClass}>Role *</label>
                <select {...register('role', { required: true })} className={`${fieldClass} appearance-none`}>
                  <option value="">Select Role</option>
                  {['super_admin', 'admin', 'marketing', 'sales', 'agent', 'editor', 'viewer'].map(r => (
                    <option key={r} value={r}>{r.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              {!editUser && (
                <>
                  <div><label className={labelClass}>Password *</label><input {...register('password', { required: !editUser })} type="password" className={fieldClass} /></div>
                  <div><label className={labelClass}>Confirm Password *</label><input {...register('confirm_password', { required: !editUser })} type="password" className={fieldClass} /></div>
                </>
              )}
              <label className="flex items-center gap-2 cursor-pointer">
                <input {...register('is_active')} type="checkbox" className="accent-gold" defaultChecked />
                <span className="text-sm">Active</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={isSubmitting} className="btn-gold flex-1 py-3 disabled:opacity-60">
                  {isSubmitting ? 'Saving...' : editUser ? 'Update User' : 'Create User'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline-gold px-6 py-3">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
