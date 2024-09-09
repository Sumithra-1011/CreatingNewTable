import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import axios from 'axios'; 

interface DataType {
  key: React.Key;
  ticker: string;
  price: number;
  volume: number;
  change_amount:number;
  change_percentage:number;
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'Ticker',
    dataIndex: 'ticker',
    sorter: (a, b) => a.ticker.localeCompare(b.ticker), // Sorting by ticker
    width: '30%',
  },
  {
    title: 'Price',
    dataIndex: 'price',
    sorter: (a, b) => a.price - b.price, // Sorting by price
  },
  {
    title: 'Volume',
    dataIndex: 'volume',
    width: '40%',
    sorter: (a, b) => a.volume - b.volume, // Sorting by volume
  },
];

const FetchData= () => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true); // For loading state

  
  useEffect(() => {
    axios
      .get('https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=demo') 
      .then((response) => {
        const apiData = response.data.top_gainers.map((item: any, index: number) => ({
          key: index,
          ticker: item.ticker,
          price: item.price,
          volume: item.volume,
          change_amount:item.change_amount,
          change_percentage:item.change_percentage,
        }));
        setData(apiData); // Set the fetched data
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setLoading(false); // Stop loading after data is fetched or error occurs
      });
  }, []); 

  const onChange: TableProps<DataType>['onChange'] = (pagination,sorter) => {
    console.log('params', pagination, sorter);
  };

  return <Table columns={columns} dataSource={data} loading={loading} onChange={onChange} expandable={{
    expandedRowRender: (record) =>{ //Creating a nexted table
        return(
            <table style={{width:'50%'}}>
                <tr style={{border:'2px'}}>
                    <th>change_amount</th>
                    <th>change_percentage</th>
                </tr>
                <tr style={{width:'100%',textAlign:'center'}}>
                    <td>{record.change_amount}</td>
                    <td>{record.change_percentage}</td>
                </tr>
            </table>
        )
    },
    rowExpandable: (record) => record.ticker !== 'Not Expandable',
  }} />;
};

export default FetchData;
