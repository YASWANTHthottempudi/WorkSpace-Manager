import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Fixed Background */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: 'url(/images/backgrounds/start-background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Optional: Dark overlay for better text readability */}
      <div className="fixed inset-0 -z-10 bg-black/20" />

      {/* Content Container */}
      <div className="relative">
        {/* Navigation */}
        <nav className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <img src="/images/icons/logo.svg" alt="AI Workspace" className="h-8" />
              </div>
              <div className="flex items-center gap-4">
                <Link href="/auth/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="primary">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <img 
              src="/images/placeholders/ai-sparkle.svg" 
              alt="AI" 
              className="w-24 h-24 mx-auto mb-8"
            />
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              AI Knowledge Workspace
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              A collaborative editor with AI superpowers
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/auth/signup">
                <Button variant="primary" size="lg">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="secondary" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="max-w-4xl mx-auto mt-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h2 className="text-xl font-semibold mb-2 text-black">Create Workspaces</h2>
                <p className="text-gray-600 mb-4">
                  Organize your knowledge with collaborative workspaces
                </p>
              </Card>
              
              <Card>
                <h2 className="text-xl font-semibold mb-2 text-black">AI-Powered</h2>
                <p className="text-gray-600 mb-4">
                  Summarize, rewrite, and query your content with AI
                </p>
              </Card>

              <Card>
                <h2 className="text-xl font-semibold mb-2 text-black">Real-time Collaboration</h2>
                <p className="text-gray-600 mb-4">
                  Work together with your team in real-time
                </p>
              </Card>

              <Card>
                <h2 className="text-xl font-semibold mb-2 text-black">Markdown Support</h2>
                <p className="text-gray-600 mb-4">
                  Write with markdown and see instant previews
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}