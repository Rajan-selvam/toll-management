import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllToll } from "../features/tollGate/tollGateSlice";
import TableLayout from './TableLayout';
import { vehicle_types } from "../constant/entities";

const tableHeaders = ["TOLL NAME", ...vehicle_types];

const Tolls = () => {
  const Dispatch = useDispatch();
  const { tollList } = useSelector((state) => state.tollGate);

  let props = {
    title:"Tollgate List",
    page:"toll_list",
    search: "TOLL NAME",
    button: {title : 'Back to Vehicle logs', url: "/"},
    tableHeaders,
    entries: tollList,
    deleteKey: "TOLL NAME"
  };

  useEffect(() => {
    Dispatch(getAllToll());
  },[Dispatch]);

  return <TableLayout props={props} />;
};

export default Tolls;