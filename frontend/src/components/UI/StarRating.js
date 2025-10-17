import React from 'react';

const Star = ({ filled, onClick, onMouseEnter, onMouseLeave }) => (
    <span
        style={{ cursor: 'pointer', color: filled ? '#ffc107' : '#e4e5e9', fontSize: '1.4rem', marginRight: 4 }}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
    >
        ★
    </span>
);

const StarRating = ({ value = 0, onChange, readOnly = false }) => {
    const [hover, setHover] = React.useState(0);

    return (
        <div>
            {[1,2,3,4,5].map(i => (
                <Star
                    key={i}
                    filled={i <= (hover || value)}
                    onClick={() => { if (!readOnly && onChange) onChange(i); }}
                    onMouseEnter={() => { if (!readOnly) setHover(i); }}
                    onMouseLeave={() => { if (!readOnly) setHover(0); }}
                />
            ))}
        </div>
    );
};

export default StarRating;
