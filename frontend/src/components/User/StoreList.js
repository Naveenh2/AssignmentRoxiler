import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import StarRating from '../UI/StarRating';
import Toast from '../UI/Toast';

const StoreList = () => {
	const [stores, setStores] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [ratingInputs, setRatingInputs] = useState({});
	const [search, setSearch] = useState('');
	const [searching, setSearching] = useState(false);
	const [toast, setToast] = useState({ message: '', type: 'info' });
	const [submitting, setSubmitting] = useState({});

	const fetchStores = async (q = '') => {
		setLoading(true);
		setError('');
		try {
			const params = q ? `?search=${encodeURIComponent(q)}` : '';
			const res = await api.get(`/user/stores${params}`);
			setStores(res.data || []);

			// Populate ratingInputs with user's existing ratings
			const initialInputs = {};
			(res.data || []).forEach(s => {
				initialInputs[s.id] = s.userSubmittedRating ?? '';
			});
			setRatingInputs(initialInputs);
		} catch (err) {
			console.error('Error fetching stores', err);
			setError(err.response?.data?.message || 'Failed to load stores');
		} finally {
			setLoading(false);
			setSearching(false);
		}
	};

	useEffect(() => {
		fetchStores();
	}, []);

	const handleInputChange = (storeId, value) => {
		// keep numeric value
		setRatingInputs(prev => ({ ...prev, [storeId]: value }));
	};

	const submitRating = async (storeId) => {
		const raw = ratingInputs[storeId];
		const value = parseInt(raw, 10);
		if (raw === '' || isNaN(value)) {
			setToast({ message: 'Please select a rating between 1 and 5', type: 'error' });
			return;
		}
		if (value < 1 || value > 5) {
			setToast({ message: 'Please select a rating between 1 and 5', type: 'error' });
			return;
		}
		try {
			setSubmitting(prev => ({ ...prev, [storeId]: true }));
			const res = await api.post('/user/ratings', { storeId, rating: value });
			// Refresh list to show updated ratings
			await fetchStores(search);
			// Friendly message
			setToast({ message: res.message || 'Rating saved', type: 'info' });
		} catch (err) {
			console.error('Submit rating error', err);
			setToast({ message: err.response?.data?.message || 'Failed to submit rating', type: 'error' });
		} finally {
			setSubmitting(prev => ({ ...prev, [storeId]: false }));
		}
	};

	const handleSearch = async () => {
		setSearching(true);
		await fetchStores(search.trim());
	};

	if (loading) return <div>Loading stores...</div>;
	if (error) return <div className="alert alert-danger">{error}</div>;

	return (
		<div>
			<h2 className="mb-4">Stores</h2>

			<div className="row mb-3">
				<div className="col-md-6">
					<input className="form-control" placeholder="Search by name or address" value={search} onChange={e => setSearch(e.target.value)} />
				</div>
				<div className="col-md-2">
					<button className="btn btn-outline-primary" onClick={handleSearch} disabled={searching}>Search</button>
				</div>
				<div className="col-md-2">
					<button className="btn btn-outline-secondary" onClick={() => { setSearch(''); fetchStores(); }}>Clear</button>
				</div>
			</div>

			{stores.length === 0 && <div>No stores found.</div>}

			<Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />

			{stores.length > 0 && (
				<div className="table-responsive">
					<table className="table table-striped">
						<thead>
							<tr>
								<th>Name</th>
								<th>Address</th>
								<th>Overall Rating</th>
								<th>Your Rating</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{stores.map(store => (
								<tr key={store.id}>
									<td>{store.name}</td>
									<td>{store.address}</td>
									<td>{store.overallRating}</td>
									<td>{store.userSubmittedRating ?? '-'}</td>
									<td style={{ minWidth: 220 }}>
										<div className="d-flex gap-2 align-items-center">
											<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
												<span className="me-2" style={{ fontSize: '0.95rem', color: '#343a40' }}>Rate:</span>
												<div title="Click to select 1-5 stars" style={{ display: 'inline-block' }}>
													<StarRating value={ratingInputs[store.id] ?? 0} onChange={(v) => handleInputChange(store.id, v)} />
												</div>
												<button className="btn btn-primary" onClick={() => submitRating(store.id)} disabled={!!submitting[store.id]}>
													{submitting[store.id] ? 'Saving...' : (store.userSubmittedRating ? 'Modify' : 'Submit')}
												</button>
											</div>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default StoreList;
