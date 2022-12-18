import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
//Local Imports
import { getAllVehicleLog,getAllToll } from '../features/tollGate/tollGateSlice';
import TableLayout from './TableLayout';

const tableHeaders =  ["VEHICLE TYPE", "VEHICLE NUMBER", "DATE/TIME", "TOLL NAME", "TARIFF"];

const TollEntries = () => {

  const dispatch = useDispatch();
  const tollNames = ["All"];

  const { tollLogs, tollList} = useSelector((state) => state.tollGate);
  const tollGateNames = tollList && tollList?.map((toll) => toll[`TOLL NAME`]);

  if(tollGateNames && tollGateNames.length > 0) {
    tollNames.push(...tollGateNames);
  }

  useEffect(() => {
    dispatch(getAllVehicleLog());
    dispatch(getAllToll());
  },[dispatch]);

  let props = {
    title:"Toll entries/Vehicle entries",
    page:"toll_entry",
    filters: tollNames,
    search: true,
    button: {title : 'View all tolls', url: "/toll-list"},
    tableHeaders,
    entries: tollLogs
  };

  return <>
    <TableLayout props={props} />
  </>;
};

export default TollEntries;