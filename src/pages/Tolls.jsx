import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllToll } from "../features/tollGate/tollGateSlice";
import TableLayout from './TableLayout';
import { vehicle_types } from "../components/AddNewTollModal";
import TrashIcon from "../assets/trash.svg";
import { deleteToll } from "../features/tollGate/tollGateSlice";

const tableHeaders = {headers : ["tollName", ...vehicle_types, "Action"]};
tableHeaders.rowKeys = tableHeaders.headers;

const Tolls = () => {
  const Dispatch = useDispatch();
  const { tollList } = useSelector((state) => state.tollGate);

  //delete handler
  const deleteHandler = (toll_name) => {
    if (window.confirm(`${toll_name} Toll Delete Confirmation`) === true){
      Dispatch(deleteToll(toll_name));
    }            
  };

  const tollListEntries = tollList?.map((toll) => {
    let tollListData = { 
      [`tollName`]: toll.tollName,
      Action: <img 
      src={TrashIcon} 
      alt='DeleteIcon' 
      onClick={() => deleteHandler(toll.tollName)} 
      className='delete-icon' />
    };
    vehicle_types?.map((vehicle_type) => {
      tollListData = {
        ...tollListData,
        [vehicle_type]: (toll[`${vehicle_type}Single`] ?? 0) + "/" + (toll[`${vehicle_type}Return`] ?? 0)
      }
    });
    return tollListData;
  });

  let props = {
    title:"Tollgate List",
    page:"toll_list",
    search: true,
    button: {title : 'Back to Vehicle logs', url: "/"},
    tableHeaders,
    entries: tollListEntries
  };

  useEffect(() => {
    Dispatch(getAllToll());
  },[Dispatch]);

  return <TableLayout props={props} />;
};

export default Tolls;