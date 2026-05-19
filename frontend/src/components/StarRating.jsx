import React from 'react';

export default function StarRating({ rating = 0, count, showNumber = true }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="star-rating d-inline-flex align-items-center gap-1">
      {showNumber && <span className="rating-value fw-bold text-accent-gold me-1">{rating.toFixed(1)}</span>}
      <div className="stars-container d-flex">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="star filled">★</span>
        ))}
        {hasHalfStar && <span className="star half">★</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="star empty">★</span>
        ))}
      </div>
      {count !== undefined && (
        <span className="rating-count text-muted small ms-1">({count.toLocaleString()})</span>
      )}
    </div>
  );
}
