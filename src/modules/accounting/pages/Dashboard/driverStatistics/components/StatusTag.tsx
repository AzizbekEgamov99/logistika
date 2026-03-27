import React from 'react';

interface StatusTagProps {
    status: string;
    type?: 'delivery' | 'maintenance';
}

export const StatusTag: React.FC<StatusTagProps> = ({ status, type = 'delivery' }) => {
    let color: string;

    if (type === 'delivery') {
        color = status === 'Completed' ? 'success' :
            status === 'In Progress' ? 'processing' : 'error';
    } else {
        color = status === 'Scheduled' ? 'blue' :
            status === 'Completed' ? 'green' : 'gold';
    }

    const colorMap: Record<string, { bg: string; text: string; border: string }> = {
        'success': { bg: '#f6ffed', text: '#52c41a', border: '#b7eb8f' },
        'processing': { bg: '#e6f7ff', text: '#1890ff', border: '#91d5ff' },
        'error': { bg: '#fff2f0', text: '#ff4d4f', border: '#ffccc7' },
        'blue': { bg: '#e6f7ff', text: '#1890ff', border: '#91d5ff' },
        'green': { bg: '#f6ffed', text: '#52c41a', border: '#b7eb8f' },
        'gold': { bg: '#fffbe6', text: '#faad14', border: '#ffe58f' },
    };

    const { bg, text, border } = colorMap[color] || { bg: '#f5f5f5', text: 'rgba(0, 0, 0, 0.65)', border: '#d9d9d9' };

    return (
        <span
            style={{
                display: 'inline-block',
                padding: '0 7px',
                fontSize: '12px',
                lineHeight: '20px',
                borderRadius: '2px',
                backgroundColor: bg,
                color: text,
                border: `1px solid ${border}`,
            }}
        >
            {status}
        </span>
    );
};