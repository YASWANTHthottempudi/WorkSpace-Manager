import Button from '@/components/ui/Button';

export default function EmptyWorkspace({ onCreateWorkspace }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <img 
        src="/images/placeholders/empty-workspace.svg"
        alt="No workspaces yet"
        className="w-80 h-60 mb-6"
      />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        No Workspaces Yet
      </h3>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Create your first workspace to start organizing your knowledge and collaborating with your team
      </p>
      <Button
        variant="primary"
        size="lg"
        onClick={onCreateWorkspace}
      >
        Create Your First Workspace
      </Button>
    </div>
  );
}