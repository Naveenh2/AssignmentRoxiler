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
    const [selectedDetail, setSelectedDetail] = useState(null);
    
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

    const handleRowClick = async (id) => {
        try {
            const res = await api.get(`/admin/users/${id}`);
            setSelectedDetail(res.data);
        } catch (err) {
            console.error('Failed to fetch detail', err);
            setSelectedDetail(null);
        }
    };

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
            <div className="row mb-3 g-2">
                <div className="col-md-4">
                    <input className="form-control" placeholder="Search name/email/address" value={filters.search} onChange={e => setFilters(prev => ({...prev, search: e.target.value}))} />
                </div>
                {type === 'users' && (
                    <div className="col-md-3">
                        <select className="form-control" value={filters.filterRole} onChange={e => setFilters(prev => ({...prev, filterRole: e.target.value}))}>
                            <option value="">All roles</option>
                            <option value="Admin">Admin</option>
                            <option value="NormalUser">NormalUser</option>
                            <option value="StoreOwner">StoreOwner</option>
                        </select>
                    </div>
                )}
                <div className="col-md-2">
                    <button className="btn btn-secondary" onClick={() => setFilters(prev => ({...prev, search: ''}))}>Clear</button>
                </div>
            </div>
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
                        <tr key={item.id} onClick={() => handleRowClick(item.id)} style={{ cursor: 'pointer' }}>
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
                {selectedDetail && (
                    <div className="card mt-3 p-3">
                        <h5>Details for {selectedDetail.name}</h5>
                        <p><strong>Email:</strong> {selectedDetail.email}</p>
                        <p><strong>Address:</strong> {selectedDetail.address}</p>
                        <p><strong>Role:</strong> {selectedDetail.role}</p>
                        {selectedDetail.role === 'StoreOwner' && selectedDetail.storeRating && (
                            <p><strong>Store Rating:</strong> {selectedDetail.storeRating}</p>
                        )}
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setSelectedDetail(null)}>Close</button>
                    </div>
                )}
        </div>
    );
};

export default UserStoreTable;