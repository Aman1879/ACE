import React, { useState } from 'react';
import { changePassword } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/common/Modal';
import {
  KeyRound,
  Shield,
  Bell,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, logout } = useAuth();

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  // Danger zone modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    try {
      setPassLoading(true);
      await changePassword({ currentPassword, newPassword });
      toast.success('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="page-header">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B1B]">Account Settings</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Manage your credentials, notification preferences, and account security.
          </p>
        </div>
      </div>

      {/* Account Info */}
      <div className="card p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-[#1B1B1B] pb-3 border-b border-[#EAEAEA]">
          Account Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[#6B7280] block mb-1">Email Address</span>
            <span className="font-bold text-[#1B1B1B] text-sm">{user?.email}</span>
          </div>
          <div>
            <span className="text-[#6B7280] block mb-1">Username / Slug</span>
            <span className="font-bold text-[#1B1B1B] text-sm">@{user?.username}</span>
          </div>
          <div>
            <span className="text-[#6B7280] block mb-1">Account Role</span>
            <span className="font-bold text-[#57C76F] uppercase text-xs">{user?.role}</span>
          </div>
          <div>
            <span className="text-[#6B7280] block mb-1">Student Status</span>
            <span className="font-bold text-[#57C76F] text-xs">Active Scholar</span>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="card p-6 sm:p-8">
        <h3 className="text-base font-bold text-[#1B1B1B] pb-3 border-b border-[#EAEAEA] mb-6 flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-[#FF6B00]" />
          Change Password
        </h3>

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="label">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="input-field pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="label">New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 6 characters"
              className="input-field"
            />
          </div>

          <div>
            <label className="label">Confirm New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="input-field"
            />
          </div>

          <button
            type="submit"
            disabled={passLoading}
            className="btn-primary !py-2.5 !px-6 !text-xs !mt-4"
          >
            {passLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="card p-6 sm:p-8 border-red-200 bg-red-50/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Danger Zone
            </h3>
            <p className="text-xs text-[#6B7280] mt-1">
              Delete your account and all associated projects, certificates, and gamification
              records permanently.
            </p>
          </div>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="btn-danger !py-2.5 !px-5 !text-xs whitespace-nowrap self-start sm:self-auto"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Account Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Account Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#6B7280]">
            Are you sure you want to delete your ACE student account? All your earned XP, streak
            records, badges, and public portfolio will be permanently deleted.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#EAEAEA]">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="btn-secondary !py-2.5 !px-5 !text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.success('Account deletion requested. Please contact support.');
                setIsDeleteModalOpen(false);
              }}
              className="btn-danger !py-2.5 !px-5 !text-sm"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

