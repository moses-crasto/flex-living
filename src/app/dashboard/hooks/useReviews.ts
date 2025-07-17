import { useEffect, useReducer } from 'react';

export type Review = {
  id: number;
  type: string;
  status: string;
  rating: number | null;
  publicReview: string;
  submittedAt: string;
  guestName: string;
  listingName: string;
  categories: Record<string, number>;
  approved?: boolean;
};

export type SortOption = '' | 'rating_asc' | 'rating_desc' | 'date_newest' | 'date_oldest';

type State = {
  reviews: Review[];
  filterProperty: string;
  filterGuest: string;
  filterCategories: string[];
  onlyApproved: boolean;
  sort: SortOption;
  loading: boolean;
  error: string | null;
  dateRange: { from: string; to: string | null };
};

const initialState: State = {
  reviews: [],
  filterProperty: '',
  filterGuest: '',
  filterCategories: [],
  onlyApproved: false,
  sort: '',
  loading: true,
  error: null,
  dateRange: { from: '', to: null },
};

type Action =
  | { type: 'SET_REVIEWS'; payload: Review[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_FILTER_PROPERTY'; payload: string }
  | { type: 'SET_FILTER_GUEST'; payload: string }
  | { type: 'SET_FILTER_CATEGORIES'; payload: string[] }
  | { type: 'SET_ONLY_APPROVED'; payload: boolean }
  | { type: 'SET_SORT'; payload: SortOption }
  | { type: 'TOGGLE_APPROVAL'; payload: number }
  | { type: 'SET_DATE_RANGE'; payload: { from: string; to: string | null } };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_REVIEWS':
      return { ...state, reviews: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_FILTER_PROPERTY':
      return { ...state, filterProperty: action.payload };
    case 'SET_FILTER_GUEST':
      return { ...state, filterGuest: action.payload };
    case 'SET_FILTER_CATEGORIES':
      return { ...state, filterCategories: action.payload };
    case 'SET_ONLY_APPROVED':
      return { ...state, onlyApproved: action.payload };
    case 'SET_SORT':
      return { ...state, sort: action.payload };
    case 'TOGGLE_APPROVAL': {
      const updatedReviews = state.reviews.map((r) =>
        r.id === action.payload ? { ...r, approved: !r.approved } : r
      );

      const updatedReview = updatedReviews.find(r => r.id === action.payload);
      if (updatedReview) {
        // Persist the change in the backend
        fetch(`/api/reviews/${updatedReview.id}/approve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ approved: updatedReview.approved })
        }).catch(err => console.error('Failed to persist approval', err));
      }

      const approvals = updatedReviews.reduce((acc, r) => {
        acc[r.id] = r.approved ?? false;
        return acc;
      }, {} as Record<number, boolean>);

      localStorage.setItem('approvedReviews', JSON.stringify(approvals));

      return { ...state, reviews: updatedReviews };
    }
    case 'SET_DATE_RANGE':
      return { ...state, dateRange: action.payload };
    default:
      return state;
  }
}

export function useReviews() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchReviews = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const res = await fetch('/api/reviews/hostaway');
        const data: { reviews: Review[] } = await res.json();

        let storedApprovals: Record<number, boolean> = {};
        try {
          storedApprovals = JSON.parse(localStorage.getItem('approvedReviews') || '{}');
        } catch {
          storedApprovals = {};
        }

        const reviewsWithApproval = data.reviews.map((r) => ({
          ...r,
          approved: storedApprovals[r.id] ?? false,
        }));

        dispatch({ type: 'SET_REVIEWS', payload: reviewsWithApproval });
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: (err as Error).message });
      }
    };

    fetchReviews();
  }, []);

  const {
    reviews,
    filterProperty,
    filterGuest,
    filterCategories,
    onlyApproved,
    sort,
    loading,
    error,
    dateRange
  } = state;

  const filteredReviews = reviews
    .filter((r) => {
      const normalizedProp = filterProperty.trim().toLowerCase();
      const normalizedGuest = filterGuest.trim().toLowerCase();
      const normalizedCategories = filterCategories.map(c => c.toLowerCase());

      const matchesProp =
        normalizedProp === '' || r.listingName.trim().toLowerCase().includes(normalizedProp);

      const matchesGuest =
        normalizedGuest === '' || r.guestName.trim().toLowerCase().includes(normalizedGuest);

      const matchesCategory =
        normalizedCategories.length === 0 ||
        Object.keys(r.categories).some(c => normalizedCategories.includes(c.toLowerCase()));

      const matchesApproval = !onlyApproved || r.approved;

      const matchesDate =
        (!dateRange.from || new Date(r.submittedAt) >= new Date(dateRange.from)) &&
        (!dateRange.to || new Date(r.submittedAt) <= new Date(dateRange.to));


      return matchesProp && matchesGuest && matchesCategory && matchesApproval && matchesDate;
    })

    .sort((a, b) => {
      switch (sort) {
        case 'rating_asc':
          return (a.rating ?? 0) - (b.rating ?? 0);
        case 'rating_desc':
          return (b.rating ?? 0) - (a.rating ?? 0);
        case 'date_newest':
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
        case 'date_oldest':
          return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
        default:
          return 0;
      }
    });

  const allCategories = Array.from(
    new Set(
      reviews.flatMap((r) => Object.keys(r.categories))
    )
  );

  return {
    reviews,
    filteredReviews,
    loading,
    error,
    allCategories,
    filterProperty,
    setFilterProperty: (v: string) => dispatch({ type: 'SET_FILTER_PROPERTY', payload: v }),
    filterGuest,
    setFilterGuest: (v: string) => dispatch({ type: 'SET_FILTER_GUEST', payload: v }),
    filterCategories,
    setFilterCategories: (v: string[]) => dispatch({ type: 'SET_FILTER_CATEGORIES', payload: v }),
    onlyApproved,
    setOnlyApproved: (v: boolean) => dispatch({ type: 'SET_ONLY_APPROVED', payload: v }),
    sort,
    setSort: (v: SortOption) => dispatch({ type: 'SET_SORT', payload: v }),
    toggleApproval: (id: number) => dispatch({ type: 'TOGGLE_APPROVAL', payload: id }),
    setDateRange: (v: { from: string; to: string | null }) =>  dispatch({ type: 'SET_DATE_RANGE', payload: v }),
  };
}
