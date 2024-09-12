'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch('/api/olx');
        const data = await res.json();
        if (data.success) {
          setListings(data.listings);
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  // Function to export data as CSV
  const exportToCSV = () => {
    const csvRows = [];
    const headers = ['Title', 'Phone Number', 'Link'];
    csvRows.push(headers.join(','));

    listings.forEach(listing => {
      const row = [
        `"${listing.title}"`,
        `"${listing.phoneNumber}"`,
        `"${listing.link}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = `data:text/csv;charset=utf-8,${csvRows.join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'listings_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto h-screen">
      {/* Export CSV button */}
      <div className="flex justify-between  items-center mb-4">
        <h1 className="text-3xl font-bold text-center mb-8 mt-5">OLX Data</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-full"
          onClick={exportToCSV}
        >
          Export CSV
        </button>
      </div>

      {/* Table */}
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border">Title</th>
            <th className="py-2 px-4 border">Phone Number</th>
            <th className="py-2 px-4 border">Link</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing, index) => (
            <tr key={index} className="border-t">
              <td className="py-2 px-4 border">{listing.title}</td>
              <td className="py-2 px-4 border">{listing.phoneNumber}</td>
              <td className="py-2 px-4 border">
                <a href={listing.link} target="_blank" rel="noopener noreferrer">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm py-1 px-3 rounded">
                    View Link
                  </button>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
