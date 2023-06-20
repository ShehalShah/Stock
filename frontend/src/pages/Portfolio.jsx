import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography } from '@mui/material';
import { Avatar, Card, CardContent } from '@mui/material';
import { TextField, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Watch from '../components/WatchlistStock';

function Portfolio() {
  const [user, setUser] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const nav = useNavigate();
  const token=localStorage.getItem("token");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: token,
          },
        };

        const response = await axios.post('http://localhost:4000/user', { token }, config);
        setUser(response.data);
        setWatchlist(response.data.watchlist);

      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen">
      <nav className="flex items-center justify-between p-4 bg-gray-800">
        <div className="flex items-center">
          <Link to="/" className="text-white font-bold text-xl">
            Stock <i>live</i>
          </Link>
          <TextField
            sx={{ input: { color: 'white' } }}
            variant="outlined"
            label="Search..."
            className="p-2 ml-4"
            style={{ marginLeft: '60vw', width: '20vw', marginRight: '10px' }}
          />
        </div>
        <div>
          {token ? (
            <div className='flex'>
              <Button variant="contained" color="success" size="medium" onClick={() => nav("/")}>
                {user?.name}
              </Button>
              <Button variant="contained" color="primary" size="medium" onClick={() => {localStorage.removeItem("token");nav("/auth");}}>
                Logout
              </Button>
            </div>
          ) : (
            <Button variant="contained" color="primary" size="medium" onClick={() => nav("/auth")}>
              Login/Signup
            </Button>
          )}
        </div>
      </nav>
      <div className="flex flex-col items-center py-8">
        {user && (
          <Card className="flex flex-row items-center mb-8 w-2/4">
            <Box sx={{ p: 2 }}>
              {/* Add profile picture component here */}
              <Avatar alt={user.name} src="https://footballexpress.in/wp-content/uploads/2022/11/Neymar-compressed.jpg" sx={{ width: 150, height: 150 ,marginRight:"70px"}} />
            </Box>
            <CardContent>
            <i>Welcome </i>
              <Typography variant="h4" className="mt-4">
                
                {user.name}
              </Typography>
              <Typography variant="h6" className="mt-2">
                {user.email}
              </Typography>
            </CardContent>
          </Card>
        )}
        {watchlist.length > 0 ? (
          <>
            <Typography variant="h4" className="mb-4" style={{ color: 'white',fontFamily: 'Roboto'  }}>
              Watchlist
            </Typography>
            {watchlist.map((stock) => (
                <Watch stockid={stock} />
              ))}
          </>
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
