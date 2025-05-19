import React from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  photo?: string;
}

export default function UserMetaCard({ user }: { user: User }) {
  return (
    <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm 
                    dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        User Metadata
      </h4>
      <div className="space-y-2 text-gray-700 dark:text-gray-300">
        <p>
          <span className="font-medium">ID:</span> <span>{user.id}</span>
        </p>
        <p>
          <span className="font-medium">Role:</span> 
          <span className={`ml-2 inline-block px-2 py-1 text-xs font-semibold rounded 
            ${
              user.role === 'admin'
                ? 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100'
                : user.role === 'user'
                ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}>
            {user.role}
          </span>
        </p>
        <p>
          <span className="font-medium">Email:</span> <span>{user.email}</span>
        </p>
      </div>
    </div>
  );
}
