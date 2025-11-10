

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-50">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your account preferences</p>
      </div>

      {/* Security Settings */}
      <div className="bg-slate-800 border-slate-700 p-6">
        <h2 className="text-xl font-bold text-slate-50 mb-4">Security</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700">
            <label className="text-slate-200">Two-Factor Authentication</label>
            {/* <Switch defaultChecked /> */}
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700">
            <label className="text-slate-200">Email Notifications</label>
            {/* <Switch defaultChecked /> */}
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700">
            <label className="text-slate-200">Real-time Alerts</label>
            {/* <Switch defaultChecked /> */}
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-slate-800 border-slate-700 p-6">
        <h2 className="text-xl font-bold text-slate-50 mb-4">Privacy</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700">
            <label className="text-slate-200">Share Anonymous Data</label>
            {/* <switch /> */}
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700">
            <label className="text-slate-200">Product Improvements</label>
            {/* <Switch defaultChecked /> */}
          </div>
        </div>
      </div>

      <div className="bg-red-950/20 border-red-900/50 p-6">
        <h2 className="text-xl font-bold text-red-400 mb-4">Danger Zone</h2>
        <div className="space-y-3">
          <button  className="w-full border-red-700 text-red-400 hover:bg-red-950/50 bg-transparent">
            Reset All Settings
          </button>
          <button  className="w-full border-red-700 text-red-400 hover:bg-red-950/50 bg-transparent">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
