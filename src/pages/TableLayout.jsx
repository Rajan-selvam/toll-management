import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
//local import
import AddNewTollModal from "../components/AddNewTollModal";
import AddNewEntryModal from "../components/AddNewEntryModal";
import Table from '../components/Table';
import filterIcon from "../assets/filter.svg";
import { deleteToll } from "../features/tollGate/tollGateSlice";
import "./table.css";

const TableLayout = ({...props}) => {

    const {
        title, 
        page, 
        filters, 
        search, 
        button, 
        tableHeaders, 
        entries,
        deleteKey
    } = props.props;

    const Dispatch = useDispatch();
    const navigate = useNavigate();

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
                        return vehicle_no.match(e.target.value.toUpperCase()) && 
                        (toll_name_filter.match(isFiltered.toUpperCase()));
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

    let headerTitle = title && <h4 className="header-title">{title}</h4>;

    let headerFilter = filters && filters.map(item =>
        <li className="filterItems" key={item} 
        onClick={() => filterHandler(item)}>{item}</li>
    );

    let headerSearch = search && 
    <input className="search" 
        style={{display:"inline-block"}} 
        type="text" placeholder="Search Vehicle" 
        onChange={SearchHandler} 
    />;

    useEffect(() => {
        setFilterRecords(entries);
    },[entries]);

    //delete handler
    const deleteHandler = (toll_name) => {
        if (window.confirm(`${toll_name} Toll Delete Confirmation`) === true){
            Dispatch(deleteToll(toll_name));
        }            
    };

    return (
        <div>
            <ul className="table-header">
                {headerTitle && <li>{headerTitle}</li>}
                <li>
                {headerFilter && (
                   <img src={filterIcon} className="filterIcon" 
                   onClick={() => setShowFilter(!showFilter) } alt="filterIcon" />
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
            
            <Table 
                headers={tableHeaders} 
                rows={filterRecords}
                deleteKey={deleteKey}
                deleteHandler={deleteHandler}
            />

            {newTollModal && <AddNewTollModal closeModal={()=> setNewTollModal(false)} />}
            {newEntryModal && <AddNewEntryModal closeModal={()=> setNewEntryModal(false)} />}
        </div>
    );
};

export default TableLayout;