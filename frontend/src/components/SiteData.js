// src/components/SiteData.js
import React from 'react';
import styled from 'styled-components';

const DataList = styled.ul`
   list-style: none;
   padding: 0;
`;

const DataItem = styled.li`
   padding: 0.5rem 0;
   border-bottom: 1px solid #ddd;
`;

const SiteData = () => {
   // Sample data
   const data = [
       { id: 1, site: 'example.com', status: 'Safe' },
       { id: 2, site: 'phishing.com', status: 'Phishing Detected' },
       { id: 3, site: 'testsite.org', status: 'Safe' }
   ];

   return (
       <DataList>
           {data.map(item => (
               <DataItem key={item.id}>
                   Site: {item.site} - Status: {item.status}
               </DataItem>
           ))}
       </DataList>
   );
}

export default SiteData;
