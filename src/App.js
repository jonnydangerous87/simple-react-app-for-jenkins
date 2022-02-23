import React, {useState, useEffect} from 'react';
import Chart from "./Chart";
import './App.css';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import DateRangePicker from '@mui/lab/DateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Box from '@mui/material/Box';

function App() {
    const [value, setValue] = useState([null,null]);
    const [startts, setStartTS] = useState("0");
    const [endts, setEndTS] = useState("\ufff0");
    const [type, setType] = useState("");
    const [menuOptions, setMenuOptions] = useState([]);
    const [timestamps, setTS] = useState([]);
    const [measurements, setMeasure] = useState([]);
    const getMenuItems = async () => {
            const results = await fetch ('http://couchdb.root.home:5984/roothome/_design/all_data/_view/all?reduce=true&group_level=1', {
                method: 'GET',
                headers: {
                'Authorization': 'Basic YWRtaW46UjAwdC41Njc4'
              }
            });
            const rawdata = await results.json(); 
            setMenuOptions(rawdata.rows.map((menuitem) => menuitem.key[0])); 
    };

    const query = async (type,startts="0",endts=`\ufff0`) => {
        try {
            const results = await fetch (`http://couchdb.root.home:5984/roothome/_design/all_data/_view/all?start_key=["${type}","${startts}"]&end_key=["${type}","${endts}"]&reduce=false`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic YWRtaW46UjAwdC41Njc4'
                }
            });
            const rawdata = await results.json();
            setMeasure(rawdata.rows.map((item) => item.value));
            setTS(rawdata.rows.map((item) => item.key[1]));
        }
        catch (err) {
            console.error(err)
        }

    };
    useEffect(() => {getMenuItems();}, []);

    const filterFunction = (menuSelection) => {
      setType(menuSelection);
      query(menuSelection,startts,endts);
    };

    const filterTimestamp = (dateSelection) => {
      const sts = new Date(dateSelection[0]);
      const ets = new Date(dateSelection[1]);
      setValue(dateSelection);
      setStartTS(sts.toISOString().split('T')[0]+" 00:00:00");
      setEndTS(ets.toISOString().split('T')[0]+" 23:59:59");
      query(type,startts,endts);
    };
    console.log(startts)
    console.log(endts)
    
    return (
      <div className="App" style={{ marginTop: "2em" }}>
          <h1>RootHome</h1>

        <FormControl variant="outlined" sx={{ minWidth: 150, marginTop: "1em" }}>
            <InputLabel id="demo-simple-select-label">Type</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={type}
                label="Type"
                onChange={(e) => filterFunction(e.target.value)}
            >
              {(menuOptions ? 
                menuOptions.map((key) => <MenuItem value={key} key={key}>{key}</MenuItem>) 
                : null)}
            </Select>
        </FormControl>
        <Chart
            timestamp={timestamps}
            measurements={measurements}
        />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateRangePicker
              startText="Start Date"
              endText="End Date"
              value={value}
              onChange={(newValue) => filterTimestamp(newValue)}
              renderInput={(startProps, endProps) => (
                <React.Fragment>
                  <Box sx={{ ml:55 }}></Box>
                  <TextField {...startProps} />
                  <Box sx={{ mx: 2 }}> to </Box>
                  <TextField {...endProps} />
                </React.Fragment>
              )}
            />
          </LocalizationProvider>
        
      </div>
    );
  }

export default App;  