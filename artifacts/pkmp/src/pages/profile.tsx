import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useUpdateProfile, getGetMeQueryKey, type ProfileUpdate } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { PageTransition } from '@/components/shared/PageTransition';
import { Loader2, User, Heart, Settings } from 'lucide-react';

const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').optional().or(z.literal('')),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  avatarUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

export default function Profile() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const updateProfile = useUpdateProfile();

  const form = useForm<ProfileUpdate>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: '',
      email: '',
      avatarUrl: '',
    },
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, isLoading, setLocation]);

  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl || '',
      });
    }
  }, [user, form]);

  const onSubmit = (data: ProfileUpdate) => {
    // Clean up empty strings to undefined
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== '')
    );
    
    updateProfile.mutate({ data: cleanData as ProfileUpdate }, {
      onSuccess: () => {
        toast.success("Profile Updated", {
          description: "Your profile has been updated successfully.",
        });
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      },
      onError: (error: any) => {
        toast.error("Update Failed", {
          description: error.response?.data?.message || "Could not update profile.",
        });
      }
    });
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <PageTransition className="space-y-8 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-4xl font-heading font-bold text-white mb-2 flex items-center gap-3">
          <Settings className="text-primary" size={32} />
          Trainer Profile
        </h1>
        <p className="text-muted-foreground">Manage your account and view your stats.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Stats & ID Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-white/10 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary/20 to-transparent" />
            
            <div className="w-32 h-32 mx-auto rounded-full border-4 border-black bg-black/50 overflow-hidden relative z-10 mb-4 shadow-xl">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <User size={48} />
                </div>
              )}
            </div>
            
            <h2 className="text-2xl font-heading font-bold text-white relative z-10">{user.username}</h2>
            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-muted-foreground uppercase tracking-wider relative z-10">
              Role: <span className={user.role === 'admin' ? "text-primary" : "text-white"}>{user.role}</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10">
            <h3 className="font-heading font-bold text-lg text-white mb-4">Trainer Stats</h3>
            <div className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Heart size={20} className="text-primary" />
                <span>Favorites</span>
              </div>
              <span className="text-xl font-bold text-white">{user.favoriteCount || 0}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5 mt-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <User size={20} />
                <span>Member Since</span>
              </div>
              <span className="text-sm font-medium text-white">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="md:col-span-2">
          <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/10 h-full">
            <h3 className="font-heading font-bold text-2xl text-white mb-6">Edit Details</h3>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Username</label>
                <input
                  {...form.register('username')}
                  type="text"
                  className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-primary transition-colors"
                />
                {form.formState.errors.username && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Email</label>
                <input
                  {...form.register('email')}
                  type="email"
                  className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-primary transition-colors"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Avatar URL</label>
                <input
                  {...form.register('avatarUrl')}
                  type="url"
                  className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="https://example.com/avatar.png"
                />
                {form.formState.errors.avatarUrl && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.avatarUrl.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={updateProfile.isPending || !form.formState.isDirty}
                className="w-full md:w-auto px-8 h-12 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(255,204,0,0.2)]"
              >
                {updateProfile.isPending && <Loader2 className="animate-spin" size={20} />}
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
