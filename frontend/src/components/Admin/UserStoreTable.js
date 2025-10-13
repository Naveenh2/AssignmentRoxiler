import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axiosConfig';

const headersConfig = {
    users: [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role' },
        { key: 'storeRating', label: 'Store Rating' }
    ],
    stores: [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'address', label: 'Address' },
        { key: 'rating', label: 'Avg Rating' }
    ]
};

const UserStoreTable = ({ type }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ search: '', sortBy: 'id', order: 'ASC', filterRole: '' });
    
    const tableHeaders = headersConfig[type];

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams(filters).toString();
            const url = type === 'users' ? `/admin/users?${params}` : `/admin/stores?${params}`;
            const res = await api.get(url);
            setData(res.data);
        } catch (err) {
            console.error(`Error fetching ${type}:`, err);
        } finally {
            setLoading(false);
        }
    }, [filters, type]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSort = (key) => {
        const newOrder = filters.sortBy === key && filters.order === 'ASC' ? 'DESC' : 'ASC';
        setFilters(prev => ({ ...prev, sortBy: key, order: newOrder }));
    };

    const renderSortIcon = (key) => {
        if (filters.sortBy !== key) return '↕️';
        return filters.order === 'ASC' ? '⬆️' : '⬇️';
    };

    if (loading) return <p>Loading {type}...</p>;

    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        {tableHeaders.map(header => (
                            <th key={header.key} onClick={() => handleSort(header.key)}>
                                {header.label} {renderSortIcon(header.key)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            {tableHeaders.map(header => (
                                <td key={header.key}>
                                    {header.key === 'storeRating' && item.role !== 'StoreOwner' 
                                        ? 'N/A' 
                                        : item[header.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {data.length === 0 && <p className="text-center text-muted">No {type} found.</p>}
        </div>
    );
};

export default UserStoreTable;