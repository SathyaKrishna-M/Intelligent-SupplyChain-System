import AppRouter from './router/AppRouter';
import { ToastProvider } from './contexts/ToastContext';

function App() {
  return (
    <div className="antialiased text-slate-900 min-h-screen bg-slate-50">
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </div>
  );
}

export default App;
