import { Review } from '../types/review';

export const useChartData = (reviews: Review[]) => {
  const getRatingOverTime = () => {
    const grouped: Record<string, { total: number; count: number }> = {};
    reviews.forEach((r) => {
      const date = new Date(r.submittedAt).toLocaleDateString();
      if (!grouped[date]) grouped[date] = { total: 0, count: 0 };
      grouped[date].total += r.rating ?? 0;
      grouped[date].count += 1;
    });
    return Object.entries(grouped).map(([date, { total, count }]) => ({
      date,
      avgRating: (total / count).toFixed(2),
    }));
  };

  const getApprovedVsNotApproved = () => {
    const approved = reviews.filter((r) => r.approved).length;
    const notApproved = reviews.length - approved;
    return [
      { name: 'Approved', value: approved },
      { name: 'Not Approved', value: notApproved },
    ];
  };

  const getRatingDistribution = () => {
    const counts: Record<number, number> = {};

    reviews.forEach((r) => {
      if (r.rating !== null && r.rating !== undefined) {
        counts[r.rating] = (counts[r.rating] || 0) + 1;
      }
    });

    // convert to array for recharts
    return Object.entries(counts).map(([rating, count]) => ({
      rating: Number(rating),
      count,
    })).sort((a, b) => a.rating - b.rating);
  };

  const getTopProperties = () => {
    const propertyMap: Record<string, { total: number, count: number }> = {};

    reviews.forEach((r) => {
      if (!r.rating || !r.listingName) return;

      if (!propertyMap[r.listingName]) {
        propertyMap[r.listingName] = { total: 0, count: 0 };
      }

      propertyMap[r.listingName].total += r.rating;
      propertyMap[r.listingName].count += 1;
    });

    return Object.entries(propertyMap).map(([property, { total, count }]) => ({
      property,
      averageRating: (total / count).toFixed(2)
    })).sort((a, b) => b.averageRating - a.averageRating);
  };

return {
    getRatingOverTime,
    getApprovedVsNotApproved,
    getRatingDistribution,
    getTopProperties
  };
};
