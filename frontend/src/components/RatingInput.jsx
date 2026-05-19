import { useState } from 'react';

export default function RatingInput({ value, onChange, max = 5 }) {
    const [hover, setHover] = useState(0);

    return (
        <div className="d-flex gap-1 rating-input">
            {[...Array(max)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <button
                        key={starValue}
                        type="button"
                        className="btn btn-link p-0 text-decoration-none"
                        style={{ fontSize: '1.5rem', color: starValue <= (hover || value) ? '#ffc107' : '#e4e5e9' }}
                        onMouseEnter={() => setHover(starValue)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => onChange(starValue)}
                    >
                        ★
                    </button>
                );
            })}
        </div>
    );
}
