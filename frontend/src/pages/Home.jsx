import React, { useEffect,useState } from 'react';
import { useQuery, useApolloClient, useSubscription } from '@apollo/client';
import { GET_ALL_STOCKS, STOCK_UPDATE_SUBSCRIPTION } from '../queries';
import StockList from '../components/StockList';
import { TextField, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function HomePage() {
  const { loading, error, data } = useQuery(GET_ALL_STOCKS);
  const symbol = "hello";
  const client = useApolloClient();
  const nav=useNavigate()
  const token=localStorage.getItem("token")
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.post(
          'http://localhost:4000/user',
          { token }
        );
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    if (token) {
      fetchUserDetails();
    }
  }, [token]);

  const { data: stockUpdateData } = useSubscription(STOCK_UPDATE_SUBSCRIPTION, {
    variables: { symbol },
    onSubscriptionData: ({ subscriptionData }) => {
      console.log("stock updated");
      const updatedStock = subscriptionData.data.stockUpdate;
      if (updatedStock !== null) {
        console.log('Received stock update:', updatedStock);

        const updatedStocks = data.getAllStocks.map((stock) => {
          if (stock.identifier === updatedStock.identifier) {
            return updatedStock;
          }
          return stock;
        });

        client.writeQuery({
          query: GET_ALL_STOCKS,
          data: {
            getAllStocks: updatedStocks,
          },
        });
      }
    },
    onError: (err) => {
      console.error('frontend subscribe error home.js', err);
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const stocks = data.getAllStocks;
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
          {token? <div className='flex'><Button variant="contained" color="success" size="medium" onClick={()=>nav("/portfolio")}>
          {user?.name}
          </Button>
          <Button variant="contained" color="primary" size="medium" onClick={()=>{localStorage.removeItem("token");nav("/auth");}}>
          Logout
        </Button></div>: <Button variant="contained" color="primary" size="medium" onClick={()=>nav("/auth")}>
            Login/Signup
          </Button>}
        </div>
      </nav>
      <div className="flex flex-col items-center py-8">
        <h1 className="text-2xl font-bold text-white">REAL-TIME Stock Market Data</h1>
        <StockList stocks={stocks} />
      </div>
    </div>
  );
}

export default HomePage;
