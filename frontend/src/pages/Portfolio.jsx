import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Portfolio() {
  const [user, setUser] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: token,
          },
        };

        const response = await axios.post('/user', {}, config);
        setUser(response.data.user);
        setWatchlist(response.data.user.watchlist);

      } catch (error) {
        console.error(error);
        // Handle error
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen">
      <nav className="flex items-center justify-between p-4 bg-gray-800">
        {/* ... Navigation bar ... */}
      </nav>
      <div className="flex flex-col items-center py-8">
        {user && (
          <div className="flex flex-col items-center mb-8">
            {/* Add profile picture component here */}
            <Typography variant="h4" className="mt-4">
              {user.name}
            </Typography>
            <Typography variant="h6" className="mt-2">
              {user.email}
            </Typography>
          </div>
        )}
        {watchlist.length > 0 ? (
          <div className="flex flex-col items-center">
            <Typography variant="h5" className="mb-4">
              Watchlist
            </Typography>
            <Box sx={{ width: '85%' }}>
              {/* Display watchlist stocks */}
              {watchlist.map((stock) => (
                <div key={stock.identifier} className="bg-white rounded-md p-4 mb-4 w-full">
                  {/* Display individual stock details */}
                  <Typography variant="h6">{stock.symbol}</Typography>
                  <Typography>{stock.identifier}</Typography>
                  {/* Add more details as needed */}
                </div>
              ))}
            </Box>
          </div>
        ) : (
          <Typography variant="h5" className="mt-4">
            No stocks in watchlist
          </Typography>
        )}
      </div>
    </div>
  );
}

export default Portfolio;
