import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
//local import
import AddNewTollModal from "../components/AddNewTollModal";
import AddNewEntryModal from "../components/AddNewEntryModal";
import { vehicle_types } from "../components/AddNewTollModal";
import { deleteToll } from "../features/tollGate/tollGateSlice";
import filterIcon from "../assets/filter.svg";
import TrashIcon from "../assets/trash.svg";
import "./table.css";

const Table = ({...props}) => {

    const {title ,filters, search, button, headers, entries, page} = props.props;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [showFilter, setShowFilter] = useState(false);
    const [isFiltered, setIsFiltered] = useState('');
    const [isSearched, setIsSearched] = useState('');
    const [newTollModal, setNewTollModal] = useState(false);
    const [newEntryModal, setNewEntryModal] = useState(false);
    const [filterRecords, setFilterRecords] = useState(entries);

    //search handler
    const SearchHandler = (e) => {
        setIsSearched(e.target.value);
        const filteredRecordIds = entries && Object.keys(entries).filter((index) => {
            switch (page) {
                case "toll_entry":
                    let vehicle_no = entries[index].vehicle_no;
                    if(isFiltered.length > 0){
                        let toll_name_filter = entries[index].tollName.toUpperCase();
                        return vehicle_no.match(e.target.value.toUpperCase()) && (toll_name_filter.match(isFiltered.toUpperCase()));
                    }
                    return vehicle_no.match(e.target.value.toUpperCase());
                case "toll_list":
                    let toll_name = entries[index].tollName.toUpperCase();
                    return toll_name.match(e.target.value.toUpperCase());          
                default:
                    return entries;
            }            
        });
        const filterVehicles = filteredRecordIds && filteredRecordIds.map(ids => entries[ids]);
        setFilterRecords(filterVehicles);
        if(e.target.value.length === 0)setIsSearched(false)
    };

    //filter Handler
    const filterHandler = (toll_name) => {
        if (toll_name.toUpperCase() === "ALL") {
            setIsFiltered('');
            setFilterRecords(entries);
            return true;
        }
        setIsFiltered(toll_name);
        const filteredRecordIds = entries && Object.keys(entries).filter((index) => {
            switch (page) {
                case "toll_entry":
                    let tollName = entries[index].tollName.toUpperCase();
                    if(isSearched.length > 0){
                        var vehicle_no = entries[index].vehicle_no;
                        return vehicle_no.match(isSearched.toUpperCase()) && (tollName.match(toll_name.toUpperCase()));
                    }
                    return tollName.match(toll_name.toUpperCase());     
                default:
                    return entries;
            }            
        });
        const filterVehicles = filteredRecordIds && filteredRecordIds.map(ids => entries[ids]);
       
        setFilterRecords(filterVehicles);
    };

    //delete handler
    const deleteHandler = (toll_name) => {
        if (window.confirm("Toll Delete Confirmation") === true){
            dispatch(deleteToll(toll_name));
        }            
    };

    let headerTitle = title && <h4 className="header-title">{title}</h4>;

    let headerFilter = filters && filters.map(item =>
        <li className="filterItems" key={item} onClick={() => filterHandler(item)}>{item}</li>
    );

    let headerSearch = search && <input className="search" style={{display:"inline-block"}} type="text" placeholder="Search Vehicle" onChange={SearchHandler} />;

    let records = filterRecords && filterRecords?.length > 0 ?
    filterRecords.map((item , index) => (
        <tr className="table-body-row" key={index}>
            <td className="table-body-col">{page === "toll_entry" ? item.vehicleType: item.tollName}</td>
            <td className="table-body-col">{page === "toll_entry" ? item.vehicle_no:
             `${item[vehicle_types[0] + 'Single']}/${item[vehicle_types[0] + 'Return']}`}</td>
            <td className="table-body-col">{page === "toll_entry" ? item.dateTime:
             `${item[vehicle_types[1] + 'Single']}/${item[vehicle_types[1] + 'Return']}`}</td>
            <td className="table-body-col">{page === "toll_entry" ? item.tollName:
             `${item[vehicle_types[2] + 'Single']}/${item[vehicle_types[2] + 'Return']}`}</td>
            <td className="table-body-col">{page === "toll_entry" ? item.tariff:
             `${item[vehicle_types[3] + 'Single']}/${item[vehicle_types[3] + 'Return']}`}</td>
            {page === "toll_list" &&  
            <>
                {/* <td className="table-body-col">{page === "toll_entry" ? item.tariff:
                `${item[vehicle_types[4] + 'Single']}/${item[vehicle_types[4] + 'Return']}`}</td> */}
                <td className="table-body-col">
                    <img src={TrashIcon} alt="delete-icon" className="delete-icon" onClick={() => deleteHandler(item.tollName)} />
                </td>
            </>
            }
        </tr>
    )) 
    : (
        <tr className="table-body-row">
            <td colSpan={5} className="col-span">{page === "toll_entry" ? 'No Record Found' : 'Toll not found'}</td>
        </tr>
    );

    useEffect(() => {
        setFilterRecords(entries);
    },[entries]);

    return (
        <div>
            <ul className="table-header">
                {headerTitle && <li>{headerTitle}</li>}
                <li>
                {headerFilter && (
                   <img src={filterIcon} className="filterIcon" onClick={() => setShowFilter(!showFilter) } alt="filterIcon" />
                )}
                {showFilter && <ul className="filter-ul">{headerFilter}</ul>}
                </li> 
                {headerSearch && <li>{headerSearch}</li>}
                <li className="float-right">
                    <input type="button" value="Add vehicle entry" onClick={() => setNewEntryModal(true)} />
                    <input type="button" value="Add new toll" onClick={() => setNewTollModal(true)} />
                    { button && <input type="button" value={button.title} onClick={()=> navigate(button.url)} />}
                </li>
            </ul>
            <div className="table-div">
                <table className="table">
                    <thead className="table-head">
                        <tr className="table-row">
                            {headers && headers.map((item, index) => 
                            <th className={`table-headers header_${index}`} key={index}>{item}</th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        {records}
                    </tbody>
                    <tfoot className="table-foot"></tfoot>
                </table>
            </div>
            {newTollModal && <AddNewTollModal closeModal={()=> setNewTollModal(false)} />}
            {newEntryModal && <AddNewEntryModal closeModal={()=> setNewEntryModal(false)} />}
        </div>
    );
};

export default Table;