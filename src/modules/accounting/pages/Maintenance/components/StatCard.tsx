import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
    return (
        <div className="stat-card">
            <h3>{title}</h3>
            <p className="stat-value">{value}</p>
        </div>
    );
};

export default StatCard;
