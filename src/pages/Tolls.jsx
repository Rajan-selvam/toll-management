import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllToll } from "../features/tollGate/tollGateSlice";
import Table from './Table';

const headers = [
  "TOLL NAME",
  "CAR/JEEP/VAN",
  "LCV",
  "TRUCK/BUS",
  "HEAVY VEHICLE",
  "Action"
];

const Tolls = () => {
  const Dispatch = useDispatch();
  const { tollList } = useSelector((state) => state.tollGate);

  let props = {
    title:"Tollgate List",
    page:"toll_list",
    search: true,
    button: {title : 'Back to Vehicle logs', url: "/"},
    headers,
    entries: tollList
  };

  useEffect(() => {
    Dispatch(getAllToll());
  },[Dispatch]);

  return <Table props={props} />;
};

export default Tolls;