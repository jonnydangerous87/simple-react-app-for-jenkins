import React, {useState, useEffect} from 'react';

function App2 () {
    const [maxFreezer, setMaxFreezer] = useState([]);
    const [maxSoftener, setMaxSoftener] = useState([]);
    const getMaxFreezer = async () => {
        const results = await fetch ('http://couchdb.root.home:5984/roothome/_design/all_data/_view/all?start_key=["freezer","\ufff0"]&end_key=["freezer",null]&reduce=false&descending=true&limit=1', {
            method: 'GET',
            headers: {
            'Authorization': 'Basic YWRtaW46UjAwdC41Njc4'
          }
        });
        const rawdata = await results.json(); 
        setMaxFreezer(rawdata.rows.map((item) => [item.key[0], item.key[1], item.value])); 
    };
    const getMaxSoftener = async () => {
        const results = await fetch ('http://couchdb.root.home:5984/roothome/_design/all_data/_view/all?start_key=["softener","\ufff0"]&end_key=["softener",null]&reduce=false&descending=true&limit=1', {
            method: 'GET',
            headers: {
            'Authorization': 'Basic YWRtaW46UjAwdC41Njc4'
          }
        });
        const rawdata = await results.json(); 
        setMaxSoftener(rawdata.rows.map((item) => [item.key[0], item.key[1], item.value])); 
    };
    useEffect(() => {getMaxFreezer();getMaxSoftener();}, []);

    // console.log(maxFreezer);
    // console.log(maxSoftener);
    

    return (
        <div className="App" style={{ marginTop: "2em" }}>
            <h1>MAX Values</h1>
            <p>{maxFreezer}</p>            
            <p>{maxSoftener}</p>
        </div>

    )
};

export default App2; 