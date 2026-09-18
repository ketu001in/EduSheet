import { create } from 'zustand';
import { api } from '@/lib/api';
import type { SavedSection } from '@/lib/worksheet';

export type { SavedQuestion, SavedSection } from '@/lib/worksheet';

export interface SavedWorksheet {
  id: string;
  title: string;
  board: string;
  class: string;
  subject: string;
  chapter: string;
  topics: string[];
  difficulty: string;
  questionCount: number;
  totalMarks: number;
  timeLimitMinutes?: number;
  sections?: SavedSection[];
  createdAt: string;
  isFavorite?: boolean;
  favoriteId?: string;
}

export type UserRole = 'student' | 'parent' | 'teacher' | 'admin';

export interface UserProfile {
  name: string;
  email: string;
  board: string;
  grade: string;
  avatarUrl?: string;
  // The real public.users.role, fetched from the backend (not from Supabase
  // Auth user_metadata, which only reflects the role picked at signup and
  // goes stale the moment a user self-changes their role -- see Header.tsx).
  // Undefined until that fetch completes; defaults to 'student' everywhere
  // it's used for gating so an unloaded role never accidentally unlocks
  // teacher/parent-only features.
  role?: UserRole;
}

interface RawWorksheetRow {
  id: string;
  title: string;
  difficulty: string;
  question_count: number;
  total_marks: number;
  time_limit_minutes: number | null;
  created_at: string;
  classes?: { name: string } | null;
  subjects?: { name: string } | null;
  chapters?: { title: string } | null;
  settings?: { board?: string; topics?: string[]; isCustom?: boolean; className?: string; subjectName?: string; topic?: string } | null;
}

function mapRowToSummary(row: RawWorksheetRow): SavedWorksheet {
  return {
    id: row.id,
    title: row.title,
    board: row.settings?.board || 'CBSE',
    class: row.classes?.name || row.settings?.className || '',
    subject: row.subjects?.name || row.settings?.subjectName || '',
    chapter: row.chapters?.title || row.settings?.topic || '',
    topics: row.settings?.topics || [],
    difficulty: row.difficulty,
    questionCount: row.question_count,
    totalMarks: row.total_marks,
    timeLimitMinutes: row.time_limit_minutes || undefined,
    createdAt: row.created_at,
  };
}

interface WorksheetState {
  worksheets: SavedWorksheet[];
  userProfile: UserProfile;
  searchQuery: string;
  isLoading: boolean;
  hasLoaded: boolean;
  hasLoadedProfile: boolean;

  fetchWorksheets: () => Promise<void>;
  addWorksheet: (worksheet: SavedWorksheet) => void;
  deleteWorksheet: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => void;
  setSearchQuery: (query: string) => void;
  /** Clears all per-user state. Call on logout so a different account never
   *  briefly sees the previous user's cached worksheets/profile in the same tab. */
  resetSession: () => void;
}

const defaultProfile: UserProfile = {
  name: 'Student User',
  email: 'student@edusheets.com',
  board: 'CBSE',
  grade: 'Class 8',
  role: 'student',
};

export const useWorksheetStore = create<WorksheetState>((set, get) => ({
  worksheets: [],
  userProfile: defaultProfile,
  searchQuery: '',
  isLoading: false,
  hasLoaded: false,
  hasLoadedProfile: false,

  fetchWorksheets: async () => {
    set({ isLoading: true });
    try {
      const [worksheetsRes, favoritesRes] = await Promise.all([
        api.get<{ success: boolean; data: RawWorksheetRow[] }>('/api/worksheets'),
        api.get<{ success: boolean; data: { id: string; entity_type: string; entity_id: string }[] }>('/api/favorites'),
      ]);

      const favoriteMap = new Map(
        favoritesRes.data.filter((f) => f.entity_type === 'worksheet').map((f) => [f.entity_id, f.id])
      );

      const worksheets = worksheetsRes.data.map((row) => {
        const summary = mapRowToSummary(row);
        const favoriteId = favoriteMap.get(row.id);
        return { ...summary, isFavorite: !!favoriteId, favoriteId };
      });

      set({ worksheets, isLoading: false, hasLoaded: true });
    } catch (err) {
      console.error('Failed to fetch worksheets:', err);
      set({ isLoading: false, hasLoaded: true });
    }
  },

  addWorksheet: (worksheet) => {
    set((state) => ({ worksheets: [worksheet, ...state.worksheets] }));
  },

  deleteWorksheet: async (id) => {
    const previous = get().worksheets;
    set((state) => ({ worksheets: state.worksheets.filter((w) => w.id !== id) }));
    try {
      await api.del(`/api/worksheets/${id}`);
    } catch (err) {
      console.error('Failed to delete worksheet:', err);
      set({ worksheets: previous });
      throw err;
    }
  },

  toggleFavorite: async (id) => {
    const worksheet = get().worksheets.find((w) => w.id === id);
    if (!worksheet) return;

    const wasFavorite = worksheet.isFavorite;
    set((state) => ({
      worksheets: state.worksheets.map((w) => (w.id === id ? { ...w, isFavorite: !wasFavorite } : w)),
    }));

    try {
      if (wasFavorite && worksheet.favoriteId) {
        await api.del(`/api/favorites/${worksheet.favoriteId}`);
        set((state) => ({
          worksheets: state.worksheets.map((w) => (w.id === id ? { ...w, favoriteId: undefined } : w)),
        }));
      } else {
        const res = await api.post<{ success: boolean; data: { id: string } }>('/api/favorites', {
          entity_type: 'worksheet',
          entity_id: id,
        });
        set((state) => ({
          worksheets: state.worksheets.map((w) => (w.id === id ? { ...w, favoriteId: res.data.id } : w)),
        }));
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      set((state) => ({
        worksheets: state.worksheets.map((w) => (w.id === id ? { ...w, isFavorite: wasFavorite } : w)),
      }));
    }
  },

  updateProfile: (profileData) => {
    set((state) => ({ userProfile: { ...state.userProfile, ...profileData }, hasLoadedProfile: true }));
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  resetSession: () => {
    set({
      worksheets: [],
      userProfile: defaultProfile,
      searchQuery: '',
      isLoading: false,
      hasLoaded: false,
      hasLoadedProfile: false,
    });
  },
}));
