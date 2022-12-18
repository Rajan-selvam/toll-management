import { useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
//Local Imports
import { addNewVehicleLog } from '../features/tollGate/tollGateSlice';
import { CloseIcon, vehicle_types } from "../constant/entities";

const AddNewEntryModal = (props) => {

    const dispatch = useDispatch();
    const { tollLogs,tollList } = useSelector((state) => state.tollGate);

    const [inValid, setInValid] = useState(false);
    const tollNameRef = useRef();
    const vehicleTypeRef = useRef();
    const vehicleNo = useRef();
    const tariffRef = useRef();

    const tollNames = tollList && tollList?.map((toll) => toll[`TOLL NAME`]);

    //Entry log validation Handler
    const entryLogValidationHandler = () => {
        if(tollNameRef.current.value.length > 0 && vehicleTypeRef.current.value.length > 0){
           let currentTollName = tollNameRef.current.value.toUpperCase();
           const entryLogToll = tollList?.find((toll) => toll[`TOLL NAME`].toUpperCase().match(currentTollName));
           tariffRef.current.value = parseFloat(entryLogToll[vehicleTypeRef.current.value].split('/')[0]);
           if(vehicleNo.current.value.length > 0) findIsReturnVehicle();
        }
    };

    //vehicle registration number validation alphanumber
    const regNoValidationHandler = async (e) => {
        setInValid(false);
        const isRegNo = e.target.value.match(/^[0-9a-zA-Z]+$/);
        if (isRegNo === null) {
            setInValid(true);
            return false;
        };
        await findIsReturnVehicle();        
    };

    const findIsReturnVehicle = () => {

        let currentVehicleNo = vehicleNo.current.value;
        let currentTollName = tollNameRef.current.value;
        let currentVehicleType = vehicleTypeRef.current.value;
        let previousOneHour =  new Date(new Date().getTime() - (1000 * 60 * 60)).getTime();

        const filteredLogs = tollLogs && tollLogs?.filter((tollLog) => {
            return ((tollLog[`VEHICLE NUMBER`] === currentVehicleNo) && 
            (new Date(tollLog.timeStramp).getTime() >= previousOneHour) && 
            (tollLog[`TOLL NAME`] === currentTollName));
        });

        const currentToll = tollList && tollList?.find(toll => toll[`TOLL NAME`] === currentTollName);
        let latestLog = {};

        if (filteredLogs && filteredLogs.length >= 1) latestLog = filteredLogs[0];
        filteredLogs && filteredLogs.length > 1 && filteredLogs?.forEach((vehicleLog, index) => {
            if(new Date(latestLog.timeStramp).getTime() < new Date(filteredLogs[index].timeStramp).getTime()) {
                latestLog = vehicleLog;
            }
        });

        tariffRef.current.value = parseFloat(currentToll[currentVehicleType].split('/')[0]);

        if(Object.keys(latestLog).length > 0 && currentToll) {
            if(parseFloat(currentToll[latestLog[`VEHICLE TYPE`]].split('/')[0]) === parseFloat(latestLog.TARIFF)){
                tariffRef.current.value = parseFloat(currentToll[currentVehicleType].split('/')[1]);
            }
        }
    };

    //save vehicle log
    const newEntrySubmitHandler = (e) => {
        e.preventDefault();
        if(vehicleNo.current.value.length < 8 || vehicleNo.current.value.length > 11) {
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
            [`TOLL NAME`]: tollNameRef.current.value,
            [`VEHICLE TYPE`]: vehicleTypeRef.current.value,
            [`VEHICLE NUMBER`]: vehicleNo.current.value,
            [`TARIFF`]: tariffRef.current.value,
            [`DATE/TIME`]: dformat,
            timeStramp: Date.now()
        };
        dispatch(addNewVehicleLog(newEntry));
        closeModal();
    };

    const closeModal = () => props.closeModal();

    return (
        <div className="modal" onClick={closeModal}>
            <div className="modal-content-wrap entry-form" onClick={e => e.stopPropagation()}>
            <CloseIcon onClick={closeModal} className="close-icon" />
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
                            <input type="text" ref={vehicleNo} onChange={regNoValidationHandler} placeholder="Enter Vehicle Number" required />
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