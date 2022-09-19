import { useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
//Local Imports
import { addNewVehicleLog } from '../features/tollGate/tollGateSlice';
import { vehicle_types } from "./AddNewTollModal";
import closeSvg from "../assets/close.svg";

const AddNewEntryModal = (props) => {
    const tollNameRef = useRef();
    const vehicleTypeRef = useRef();
    const vNo = useRef();
    const tariffRef = useRef();
    const [inValid, setInValid] = useState(false);

    const dispatch = useDispatch();
    const { tollLogs,tollList } = useSelector((state) => state.tollGate);

    const tollNames = tollList && tollList?.map((toll) => toll.tollName);

    //Entry log validation Handler
    const entryLogValidationHandler = () => {
        if(tollNameRef.current.value.length > 0 && vehicleTypeRef.current.value.length > 0){
           const entryLogToll = tollList?.filter((toll) => toll.tollName.toUpperCase().match(tollNameRef.current.value.toUpperCase()));
           tariffRef.current.value = entryLogToll[0][vehicleTypeRef.current.value+'Single'];
           if(vNo.current.value.length > 0) findIsReturnVehicle();
        }
    };

    //vehicle registration number validation alphanumber
    const regNoValidationHandler = async (e) => {
        setInValid(false);
        const isRegNo = e.target.value.match(/^[0-9a-zA-Z]+$/);
        if (isRegNo === null) setInValid(true);
        // entryLogValidationHandler();
        await findIsReturnVehicle();        
    };

    const findIsReturnVehicle = () => {
        const filteredLogs = tollLogs && tollLogs?.filter((tollLog) => {
            return ((tollLog.vehicle_no === vNo.current.value) && 
            (new Date(tollLog.timeStramp).getTime() >= new Date(new Date().getTime() - (1000 * 60 * 60)).getTime()) && 
            (tollLog.tollName === tollNameRef.current.value));
        });
        const currentToll = tollList && tollList?.find(toll => toll.tollName === tollNameRef.current.value);
        let latestLog = {};
        if (filteredLogs && filteredLogs.length >= 1) latestLog = filteredLogs[0];
        filteredLogs && filteredLogs.length > 1 && filteredLogs?.forEach((vehicleLog, index) => {
            if(new Date(latestLog.timeStramp).getTime() < new Date(filteredLogs[index].timeStramp).getTime()) {
                latestLog = vehicleLog;
            }
        });
        tariffRef.current.value = currentToll[vehicleTypeRef.current.value + 'Single'];
        if(Object.keys(latestLog).length > 0 && currentToll) {
            if(currentToll[latestLog.vehicleType + 'Single'] === latestLog.tariff){
                tariffRef.current.value = currentToll[vehicleTypeRef.current.value + 'Return'];
            } else if(currentToll[latestLog.vehicleType + 'Return'] === latestLog.tariff){
                tariffRef.current.value = currentToll[vehicleTypeRef.current.value + 'Single'];
            }
        }
    };

    //save vehicle log
    const newEntrySubmitHandler = (e) => {
        e.preventDefault();
        if(vNo.current.value.length < 8 || vNo.current.value.length > 11) {
            setInValid(true);
            return false;
        }
        var d = new Date(),
        dformat = [d.getDate(),
               d.getMonth()+1,
               d.getFullYear()].join('/')+', '+
              [d.getHours(),
               d.getMinutes(),
               d.getSeconds()].join(':');
        const newEntry = {
            tollName: tollNameRef.current.value,
            vehicleType: vehicleTypeRef.current.value,
            vehicle_no: vNo.current.value,
            tariff: tariffRef.current.value,
            dateTime: dformat,
            timeStramp: Date.now()
        };
        // console.log(newEntry);
        dispatch(addNewVehicleLog(newEntry));
        closeModal();
    };

    const closeModal = () => props.closeModal();

    return (
        <div className="modal">
            <div className="modal-content-wrap entry-form">
            <img src={closeSvg} alt="close" onClick={closeModal} className="close-icon" />
            <h3 className="model-h3">Add new entry</h3>
            <div className="model-content">
                <form onSubmit={newEntrySubmitHandler}>
                    <div className="entry-form-group">
                        <div className="entry-model-from-group">
                            <label htmlFor="toll_name">Select toll name<sup className="color-red">*</sup></label>
                            <select ref={tollNameRef} required onChange={entryLogValidationHandler}>
                                <option value="">Select Toll Name</option>
                                { tollNames && tollNames.map(item => <option value={item} key={item}>{item}</option>)}
                            </select>
                        </div>

                        <div className="entry-model-from-group">
                            <label htmlFor="vehicle_type">Select vehicle type<sup className="color-red">*</sup></label>
                            <select ref={vehicleTypeRef} required onChange={entryLogValidationHandler}>
                                <option value="">Select Vehicle type</option>
                                {vehicle_types.map(item => <option value={item} key={item}>{item}</option>)}
                            </select>
                        </div>

                        <div className="entry-model-from-group">
                            <label htmlFor="v_no">Vehicle Number<sup className="color-red">*</sup></label>
                            <input type="text" ref={vNo} onChange={regNoValidationHandler} placeholder="Enter Vehicle Number" required />
                            { inValid && <span className="tollNameError">Enter Valid Reg Number</span>}
                        </div>

                        <div className="entry-model-from-group">
                            <label htmlFor="tariff">Tariff<sup className="color-red">*</sup></label>
                            <input type="text" ref={tariffRef} placeholder="0.00" required readOnly />
                        </div> 
                    </div> 

                    <div className="submit">
                        <input type="submit" value="Submit" disabled={inValid} />
                    </div>

                </form>
            </div>
            </div>
       </div>
    );
};

export default AddNewEntryModal;