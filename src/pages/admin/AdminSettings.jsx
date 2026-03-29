import { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabase';
import { Save, User, Database, Shield, HardDrive, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const { user } = useAuth();
  const [changingPassword, setChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [storageStatus, setStorageStatus] = useState(null);
  const [checkingStorage, setCheckingStorage] = useState(false);

  const handlePasswordChange = async () => {
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setChangingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) toast.error(error.message);
    else { toast.success('Password updated successfully'); setNewPassword(''); }
    setChangingPassword(false);
  };

  const checkStorage = async () => {
    setCheckingStorage(true);
    try {
      const { data, error } = await supabase.storage.getBucket('documents');
      if (error) setStorageStatus({ ok: false, message: 'Bucket "documents" not found. Create it in Supabase Dashboard → Storage → New Bucket → name: documents → Public: ON' });
      else setStorageStatus({ ok: true, message: `Bucket "${data.name}" exists (public: ${data.public})` });
    } catch (e) {
      setStorageStatus({ ok: false, message: e.message });
    }
    setCheckingStorage(false);
  };

  const cardStyle = { background: 'var(--white)', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' };
  const labelStyle = { color: 'var(--text-light-color)', fontSize: 13, marginBottom: 4, display: 'block' };
  const valueStyle = { color: 'var(--text-main)', fontSize: 15, fontWeight: 500 };
  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--bg-alt)', fontSize: 14, outline: 'none', color: 'var(--text-main)', background: 'var(--bg)' };
  const btnStyle = { padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8 };

  return (
    <div style={{ maxWidth: 800 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 24 }}>Settings</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Account Info */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <User size={20} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>Account</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div><span style={labelStyle}>Email</span><span style={valueStyle}>{user?.email}</span></div>
            <div><span style={labelStyle}>User ID</span><span style={{ ...valueStyle, fontSize: 12, fontFamily: 'monospace' }}>{user?.id}</span></div>
            <div><span style={labelStyle}>Last Sign In</span><span style={valueStyle}>{user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}</span></div>
            <div><span style={labelStyle}>Role</span><span style={valueStyle}>Admin</span></div>
          </div>
        </div>

        {/* Change Password */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Shield size={20} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>Change Password</h2>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>New Password</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                style={inputStyle} placeholder="Min 6 characters" />
            </div>
            <button onClick={handlePasswordChange} disabled={changingPassword}
              style={{ ...btnStyle, background: 'var(--primary)', color: 'white', opacity: changingPassword ? 0.6 : 1 }}>
              <Save size={16} /> {changingPassword ? 'Saving...' : 'Update'}
            </button>
          </div>
        </div>

        {/* System Status */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Database size={20} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>System Status</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div><span style={labelStyle}>Supabase Project</span><span style={{ ...valueStyle, fontSize: 12, fontFamily: 'monospace' }}>{import.meta.env.VITE_SUPABASE_URL?.replace('https://', '').replace('.supabase.co', '')}</span></div>
            <div><span style={labelStyle}>API Status</span><span style={{ ...valueStyle, color: 'var(--primary)' }}>Connected</span></div>
          </div>

          <div style={{ borderTop: '1px solid var(--bg-alt)', paddingTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <HardDrive size={16} style={{ color: 'var(--text-light-color)' }} />
              <span style={{ ...labelStyle, margin: 0 }}>Document Storage Bucket</span>
              <button onClick={checkStorage} disabled={checkingStorage}
                style={{ ...btnStyle, background: 'var(--bg-alt)', color: 'var(--text-main)', padding: '6px 12px', fontSize: 12 }}>
                <RefreshCw size={14} className={checkingStorage ? 'animate-spin' : ''} /> Check
              </button>
            </div>
            {storageStatus && (
              <div style={{
                padding: '10px 14px', borderRadius: 10, fontSize: 13,
                background: storageStatus.ok ? 'rgba(124, 154, 130, 0.1)' : 'rgba(220, 60, 60, 0.1)',
                color: storageStatus.ok ? 'var(--primary-dark)' : '#c0392b'
              }}>
                {storageStatus.ok ? '✓' : '✗'} {storageStatus.message}
              </div>
            )}
          </div>
        </div>

        {/* Configuration Info */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Database size={20} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>Configuration</h2>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-light-color)', lineHeight: 1.6 }}>
            To switch Supabase projects, update <code style={{ background: 'var(--bg-alt)', padding: '2px 6px', borderRadius: 4 }}>.env</code> with new <code style={{ background: 'var(--bg-alt)', padding: '2px 6px', borderRadius: 4 }}>VITE_SUPABASE_URL</code> and <code style={{ background: 'var(--bg-alt)', padding: '2px 6px', borderRadius: 4 }}>VITE_SUPABASE_ANON_KEY</code>, run the SQL migration on the new project, create the <code style={{ background: 'var(--bg-alt)', padding: '2px 6px', borderRadius: 4 }}>documents</code> storage bucket, and redeploy.
          </p>
        </div>
      </div>
    </div>
  );
}
