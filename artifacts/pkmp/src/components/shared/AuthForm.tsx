import React, { useState, FormEvent } from 'react';
import { cn } from '@/lib/utils';

interface AuthFormProps {
  onSubmit: (data: Record<string, string>) => Promise<void>;
  fields: { name: string; label: string; type?: string; placeholder?: string }[];
  submitLabel: string;
  error?: string;
}

export function AuthForm({ onSubmit, fields, submitLabel, error }: AuthFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto">
      {error && (
        <div className="p-2 bg-red-600/20 text-red-200 rounded">
          {error}
        </div>
      )}
      {fields.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-muted-foreground mb-1" htmlFor={field.name}>
            {field.label}
          </label>
          <input
            id={field.name}
            name={field.name}
            type={field.type ?? 'text'}
            placeholder={field.placeholder}
            value={formData[field.name] ?? ''}
            onChange={handleChange}
            required
            className={cn(
              'w-full h-10 bg-black/40 border border-white/10 rounded-full px-3 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all',
              loading && 'opacity-50 cursor-not-allowed'
            )}
          />
        </div>
      ))}
      <button
        type="submit"
        disabled={loading}
        className={cn(
          'w-full h-10 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/80 transition-colors',
          loading && 'opacity-70 cursor-wait'
        )}
      >
        {loading ? 'Processing…' : submitLabel}
      </button>
    </form>
  );
}
