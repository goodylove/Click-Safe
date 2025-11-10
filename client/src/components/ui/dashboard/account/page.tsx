export default function AccountPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-50">Account</h1>
        <p className="text-slate-400 mt-1">Manage your account information</p>
      </div>

      {/* Profile */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-bold text-slate-50 mb-6">Profile Information</h2>
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
            <div className="text-xl font-bold text-white">LH</div>
          </div>
          <div>
            <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2 rounded-md transition-colors">
              Change Avatar
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-slate-300 block mb-2">Full Name</label>
            <input 
              defaultValue="Lawal Halima" 
              className="w-full mt-2 bg-slate-900 border border-slate-700 text-slate-50 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500" 
            />
          </div>
          <div>
            <label className="text-slate-300 block mb-2">Email</label>
            <input
              defaultValue="lawal.halima@example.com"
              className="w-full mt-2 bg-slate-900 border border-slate-700 text-slate-50 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="text-slate-300 block mb-2">Organization</label>
            <input 
              defaultValue="Clicksafe" 
              className="w-full mt-2 bg-slate-900 border border-slate-700 text-slate-50 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500" 
            />
          </div>
          <button className="mt-6 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2 rounded-md transition-colors">
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-bold text-slate-50 mb-4">API Keys</h2>
        <p className="text-slate-400 text-sm mb-4">Manage your API keys for integration</p>
        <button className="border border-slate-600 text-cyan-400 hover:bg-slate-700 bg-transparent px-4 py-2 rounded-md transition-colors">
          Generate New Key
        </button>
      </div>
    </div>
  )
}