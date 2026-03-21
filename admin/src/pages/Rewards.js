import React, { useState } from 'react';

export const Rewards = () => {
  const [rewards] = useState([
    {
      id: 1,
      user: { username: 'testuser', email: 'test@example.com' },
      deal: { title: 'Sample Deal', store: 'Amazon' },
      cashbackAmount: 5.00,
      status: 'pending',
      purchaseDate: '2024-02-25',
      transactionId: 'TXN123456'
    },
    {
      id: 2,
      user: { username: 'user2', email: 'user2@example.com' },
      deal: { title: 'Another Deal', store: 'Nike' },
      cashbackAmount: 8.50,
      status: 'confirmed',
      purchaseDate: '2024-02-24',
      transactionId: 'TXN789012'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Rewards</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Deal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Cashback
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Purchase Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rewards.map((reward) => (
                <tr key={reward.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {reward.user.username}
                      </div>
                      <div className="text-sm text-gray-500">{reward.user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {reward.deal.title}
                      </div>
                      <div className="text-sm text-gray-500">{reward.deal.store}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600">
                      ${reward.cashbackAmount.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reward.purchaseDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(reward.status)}`}>
                      {reward.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reward.transactionId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {reward.status === 'pending' && (
                        <button className="text-green-600 hover:text-green-900">
                          Confirm
                        </button>
                      )}
                      {reward.status === 'confirmed' && (
                        <button className="text-blue-600 hover:text-blue-900">
                          Mark Paid
                        </button>
                      )}
                      {(reward.status === 'pending' || reward.status === 'confirmed') && (
                        <button className="text-red-600 hover:text-red-900">
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 text-center text-gray-500">
        <p>Mock data - Connect to database to see real rewards</p>
      </div>
    </div>
  );
};
