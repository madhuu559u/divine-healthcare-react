import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/shared/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold mb-4" style={{ color: 'var(--primary)' }}>404</h1>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-main)' }}>Page Not Found</h2>
        <p className="mb-8" style={{ color: 'var(--text-light-color)' }}>The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex justify-center gap-4">
          <Button to="/" size="lg"><Home size={18} /> Return Home</Button>
          <Button onClick={() => window.history.back()} variant="outline" size="lg"><ArrowLeft size={18} /> Go Back</Button>
        </div>
      </div>
    </div>
  );
}
