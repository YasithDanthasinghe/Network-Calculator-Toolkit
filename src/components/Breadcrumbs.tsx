import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbProps {
  items: {
    name: string;
    href?: string;
  }[];
}

export default function Breadcrumbs({ items }: BreadcrumbProps) {
  return (
    <nav className="flex px-5 py-3 text-slate-500 dark:text-slate-400 mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <a href="/" className="inline-flex items-center text-sm font-medium hover:text-network-teal transition-colors">
            <Home className="w-4 h-4 mr-2" />
            Home
          </a>
        </li>
        {items.map((item, index) => (
          <li key={index}>
            <div className="flex items-center">
              <ChevronRight className="w-4 h-4 mx-1" />
              {item.href ? (
                <a 
                  href={item.href} 
                  className="ml-1 text-sm font-medium hover:text-network-teal md:ml-2 transition-colors"
                >
                  {item.name}
                </a>
              ) : (
                <span className="ml-1 text-sm font-medium text-slate-400 md:ml-2">
                  {item.name}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
