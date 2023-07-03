import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';

const MyTable = () => {
  const [data, setData] = useState([{"id":2291164,"entryType":"talkset","hour":1687550400000,"chronOrderID":162202055},{"id":2291163,"entryType":"playcut","playcut":{"rotation":"false","request":"false","songTitle":"Roadside","labelName":"self-released","artistName":"Big Range","releaseTitle":"S/T"},"hour":1687550400000,"chronOrderID":162202054},{"id":2291162,"entryType":"playcut","playcut":{"rotation":"false","request":"false","songTitle":"One Armed Candy Bear","labelName":"Thirty Tigers","artistName":"Au Pair","releaseTitle":"One Armed Candy Bear"},"hour":1687550400000,"chronOrderID":162202053},{"id":2291161,"entryType":"playcut","playcut":{"rotation":"true","request":"false","songTitle":"Begone, Bygone","labelName":"Ted Records","artistName":"Haves & Thirds","releaseTitle":"Dog Years"},"hour":1687550400000,"chronOrderID":162202052},{"id":2291160,"entryType":"playcut","playcut":{"rotation":"false","request":"false","songTitle":"Simplesmente","labelName":"Six Degrees","artistName":"Bebel Gilberto","releaseTitle":"s/t"},"hour":1687550400000,"chronOrderID":162202051},{"id":2291159,"entryType":"talkset","hour":1687550400000,"chronOrderID":162202050},{"id":2291158,"entryType":"playcut","playcut":{"rotation":"false","request":"false","songTitle":"Die in My Sleep","labelName":"Dionysus","artistName":"La Peste","releaseTitle":"Better Off"},"hour":1687550400000,"chronOrderID":162202049},{"id":2291157,"entryType":"playcut","playcut":{"rotation":"true","request":"false","songTitle":"Strolling Along -> Super See","labelName":"Anthology Recordings","artistName":"Robert Lester Folsom","releaseTitle":"Sunshine Only Sometimes Archive Vol. 2"},"hour":1687550400000,"chronOrderID":162202048},{"id":2291156,"entryType":"playcut","playcut":{"rotation":"true","request":"false","songTitle":"California, You're Slippin'","labelName":"Numero Group","artistName":"Joyce Street","releaseTitle":"Tied Down"},"hour":1687550400000,"chronOrderID":162202047},{"id":2291155,"entryType":"playcut","playcut":{"rotation":"false","request":"false","songTitle":"Waltz","labelName":"Houndstooth","artistName":"Katie Gately","releaseTitle":"Loom"},"hour":1687550400000,"chronOrderID":162202046},{"id":2291154,"entryType":"playcut","playcut":{"rotation":"true","request":"false","songTitle":"So Much Funkin' Fun (Version 2)","labelName":"Still Music Chicago","artistName":"Richie Weeks","releaseTitle":"The Love Magician Archives"},"hour":1687550400000,"chronOrderID":162202045},{"id":2291153,"entryType":"talkset","hour":1687550400000,"chronOrderID":162202044},{"id":2291152,"entryType":"playcut","playcut":{"rotation":"true","request":"false","songTitle":"El Hob Matnassash","labelName":"Habibi Funk","artistName":"Maha","releaseTitle":"Orkos"},"hour":1687550400000,"chronOrderID":162202043},{"id":2291151,"entryType":"playcut","playcut":{"rotation":"false","request":"false","songTitle":"Someone I Used To Know","labelName":"Alyosha","artistName":"The Old Ceremony","releaseTitle":"Walk on Thin Air"},"hour":1687550400000,"chronOrderID":162202042},{"id":2291150,"entryType":"playcut","playcut":{"rotation":"true","request":"false","songTitle":"Nowhere Fast -> No Alternative","labelName":"K","artistName":"Ribbon Stage","releaseTitle":"HIT WITH THE MOST"},"hour":1687550400000,"chronOrderID":162202041},{"id":2291149,"entryType":"playcut","playcut":{"rotation":"false","request":"false","songTitle":"Blue Heaven","labelName":"Tompkins Square","artistName":"Lena Hughes","releaseTitle":"Queen of the Flat Top Guitar"},"hour":1687550400000,"chronOrderID":162202040},{"id":2291147,"entryType":"playcut","playcut":{"rotation":"false","request":"false","songTitle":"The Flag","labelName":"Reprise","artistName":"The Barenaked Ladies","releaseTitle":"Gordon"},"hour":1687550400000,"chronOrderID":162202039},{"id":2291148,"entryType":"breakpoint","hour":1687550400000,"chronOrderID":162202038},{"id":2291146,"entryType":"talkset","hour":1687546800000,"chronOrderID":162202037},{"id":2291145,"entryType":"playcut","playcut":{"rotation":"true","request":"false","songTitle":"Just Me and You","labelName":"Numero Group","artistName":"The Dreamliners","releaseTitle":"Just Me & You"},"hour":1687546800000,"chronOrderID":162202036},{"id":2291144,"entryType":"playcut","playcut":{"rotation":"true","request":"false","songTitle":"Love Your Girlfriend","labelName":"FXHE","artistName":"Omar S","releaseTitle":"Pain"},"hour":1687546800000,"chronOrderID":162202035}]);
  // how do i access the person signed on vs signed off from live playlist
   
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const requestBody = {
//             // key1: value1,
//             // key2: value2,
//             // Add more key-value pairs as needed
//           };

//         const response = await fetch('http://wxyc.info/playlists/recentEntries?n=50', 
//         {
//             // request body
        
//         })
//         .then((response) => {
//             console.log(response)
//         })
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };
//     fetchData();
//   }, []);


  return (
    
    <Layout>
      <div className="sm:mx-auto sm:w-5/6 overflow-auto"> 
      <p className="text-4xl mb-2">Live Playlist</p>

      <div className="flex flex-row justify-between">
      <p className="mb-5"> Last updated: </p>
      <a href="http://wxyc.info/playlists/radioWeek" className="underline">Archive</a>
      </div>
      
      <table className="w-full">
        <thead  className="bg-gradient-to-b from-neutral-600 to-black h-12 sm:text-base text-xs">
          <tr>
            <th class="font-normal">WXYC Playlist</th>
            <th class="font-normal">Artist</th>
            <th class="font-normal">Song</th>
            <th class="font-normal">Release</th>
            <th class="font-normal">Label</th>
            <th class="font-normal">Request?</th>
            {/* Add more table headers as needed */}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key= {item.id} className="mb-5">
                {(item.entryType === "playcut") && <td className="text-center">{item.playcut.rotation && <p className="mb-2 sm:text-base text-xs">*</p>}</td>}
                {(item.entryType === "playcut") && <td className="sm:text-base text-xs">{item.playcut.artistName}</td>}
                {(item.entryType === "playcut") && <td className="sm:text-base text-xs">{item.playcut.songTitle}</td>}
                {(item.entryType === "playcut") && <td className="sm:text-base text-xs">{item.playcut.releaseTitle}</td>}
                {(item.entryType === "playcut") && <td className="sm:text-base text-xs">{item.playcut.labelName}</td>}
                {(item.entryType === "playcut") && <td className="text-center sm:text-base text-xs">{item.playcut.request && <p>*</p>}</td>}
          
                
                {(item.entryType === "talkset") && <td className="bg-gradient-to-b from-neutral-700 to-black" colSpan={6} align="center"><p className=" h-5">Talkset</p></td>}

               
                {(item.entryType === "breakpoint") && <td colSpan={6} align="center"> <p className="font-bold my-4">{ new Date(item.hour).toLocaleString('en-US', { hour: 'numeric', timeZone: 'America/New_York' })} Breakpoint</p></td>}

            </tr>
          ))}
        </tbody>
      </table></div>
       
    </Layout>
  );
};

export default MyTable;