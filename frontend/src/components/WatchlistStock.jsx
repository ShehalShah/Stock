// import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Graph from './Graph';
import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import axios from 'axios';
import { GET_STOCK } from '../queries';
import { useQuery, useApolloClient, useSubscription } from '@apollo/client';
function Watch({ stockid }) {
    const nav=useNavigate()
    const symbol =stockid
    const { data, loading, error } = useQuery(GET_STOCK, {
      variables: {
        symbol,
      },
    });
  
    if (loading) {
      return <div>Loading...</div>;
    } else if (error) {
      return <div>Error fetching stock data: {error.message}</div>;
    } else {
      const stock = data.getStock;

  
  return (
    <>
        <Box
          sx={{
            width: '85%',
            position: 'relative',
            marginBottom: "10px"
          }}
        >
          <Card
            orientation="horizontal"
            sx={{
              width: '100%',
              flexWrap: 'wrap',
              [`& > *`]: {
                '--stack-point': '500px',
                minWidth:
                  'clamp(0px, (calc(var(--stack-point) - 2 * var(--Card-padding) - 2 * var(--variant-borderWidth, 0px)) + 1px - 100%) * 999, 100%)',
              },
              overflow: 'auto',
              resize: 'horizontal',
            }}
          >
            <AspectRatio ratio="1" maxHeight={300} sx={{ minWidth: 182, flex: 1 }}>
              <Graph stock={stock}/>
            </AspectRatio>
            <CardContent>
              <Typography fontSize="xl" fontWeight="lg">
                {stock.symbol}
              </Typography>
              <Typography level="body2" fontWeight="lg" textColor="text.tertiary">
                {stock.identifier}
              </Typography>
              <Sheet
                sx={{
                  bgcolor: 'background.level1',
                  borderRadius: 'sm',
                  p: 1.5,
                  my: 1.5,
                  display: 'flex',
                  gap: 2,
                  '& > div': { flex: 1 },
                }}
              >
                <div>
                  <Typography level="body3" fontWeight="lg">
                    OPEN
                  </Typography>
                  <Typography fontWeight="bold" sx={{ color: 'green' }}>{stock.open}</Typography>
                </div>
                <div>
                  <Typography level="body3" fontWeight="lg">
                    Change/ P% Change
                  </Typography>
                  <Typography
  fontWeight="lg"
  sx={{
    color: stock.pChange < 0 ? 'red' : 'green',
  }}
>
  {stock.change.toFixed(2)} / {stock.pChange.toFixed(2)}{' '}
  {stock.pChange < 0 ? '↓' : '↑'}
</Typography>

                </div>
                <div>
                  <Typography level="body3" fontWeight="lg">
                    Traded Volume
                  </Typography>
                  <Typography fontWeight="lg">{stock.totalTradedVolume}</Typography>
                </div>
              </Sheet>
              <Box sx={{ display: 'flex', gap: 1.5, '& > button': { flex: 1 } }}>
                <Button variant="outlined" color="neutral" onClick={() => addToWatchlist(stock.identifier)}>
                  Remove from Watchlist
                </Button>
                <Button variant="solid" color="primary" onClick={()=>nav(`/stock/${stock.identifier}`)}>
                  View Details
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      
    </>
  );
}
}

export default Watch;
