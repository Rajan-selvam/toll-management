import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
//local import
import "./modal.css";
import closeSvg from "../assets/close.svg";
import { addNewToll } from "../features/tollGate/tollGateSlice";

export const vehicle_types = [
    "CAR/JEEP/VAN",
    "LCV",
    "TRUCK/BUS",
    "HEAVY VEHICLE"
];

const AddNewTollModal = (props) => {
    const Dispatch = useDispatch();
    const { tollList } = useSelector((state) => state.tollGate);

    const tollNameRef = useRef();
    const vehicleTypeRef1 = useRef();
    const singleJourneyRef1 = useRef();
    const returnJourneyRef1 = useRef();
    const vehicleTypeRef2 = useRef();
    const singleJourneyRef2 = useRef();
    const returnJourneyRef2 = useRef();
    const vehicleTypeRef3 = useRef();
    const singleJourneyRef3 = useRef();
    const returnJourneyRef3 = useRef();
    const vehicleTypeRef4 = useRef();
    const singleJourneyRef4 = useRef();
    const returnJourneyRef4 = useRef();

    const [tollNameError, setTollNameError] = useState();
   
    const closeModal = () => props.closeModal();
    
    const tollNameHandler = () => {
        setTollNameError();
        const tollExist = tollList && tollList?.length > 0 && 
        tollList.filter(toll => toll.tollName.toUpperCase() === tollNameRef.current.value.toUpperCase());
        if (tollExist && tollExist.length > 0) {
            setTollNameError('Toll Name Already Exist');
        }
    };

    const vehicleTypeHandler = (e) => {
        if ((vehicleTypeRef1.current.value === vehicleTypeRef2.current.value) 
        || (vehicleTypeRef1.current.value === vehicleTypeRef3.current.value)
        || (vehicleTypeRef1.current.value === vehicleTypeRef4.current.value)) {
            alert('Duplicate Vehicle Type!');
            e.target.value = "";
        } else if ((vehicleTypeRef2.current.value.length > 0)
        && ((vehicleTypeRef2.current.value === vehicleTypeRef1.current.value) 
        || (vehicleTypeRef2.current.value === vehicleTypeRef3.current.value)
        || (vehicleTypeRef2.current.value === vehicleTypeRef4.current.value))) {
            alert('Duplicate Vehicle Type!');
            e.target.value = "";
        } else if ((vehicleTypeRef3.current.value.length > 0)
        && ((vehicleTypeRef3.current.value === vehicleTypeRef1.current.value) 
        || (vehicleTypeRef3.current.value === vehicleTypeRef2.current.value)
        || (vehicleTypeRef3.current.value === vehicleTypeRef4.current.value))) {
            alert('Duplicate Vehicle Type!');
            e.target.value = "";
        }
    };

    const newTollSubmitHandler = (e) => {
        e.preventDefault();

        const newTollData = {
            tollName: tollNameRef.current.value,
            [`${[vehicleTypeRef1.current.value]}Single`]: singleJourneyRef1.current.value,
            [`${[vehicleTypeRef1.current.value]}Return`]: returnJourneyRef1.current.value,
            [`${[vehicleTypeRef2.current.value]}Single`]: singleJourneyRef2.current.value,
            [`${[vehicleTypeRef2.current.value]}Return`]: returnJourneyRef2.current.value,
            [`${[vehicleTypeRef3.current.value]}Single`]: singleJourneyRef3.current.value,
            [`${[vehicleTypeRef3.current.value]}Return`]: returnJourneyRef3.current.value,
            [`${[vehicleTypeRef4.current.value]}Single`]: singleJourneyRef4.current.value,
            [`${[vehicleTypeRef4.current.value]}Return`]: returnJourneyRef4.current.value,
        };
        Dispatch(addNewToll(newTollData));
        closeModal();
    };

    return (
       <div className="modal">
        <div className="modal-content-wrap">
            <img src={closeSvg} alt="close" onClick={closeModal} className="close-icon" />
            <h3 className="model-h3">Add new toll</h3>
            <div className="model-content">
                <form onSubmit={newTollSubmitHandler}>
                    <div className="toll_name">
                        <label htmlFor="tollName">Toll Name<sup className="color-red">*</sup></label>
                        <input type="text" ref={tollNameRef} placeholder="Enter Toll Name" required onChange={tollNameHandler} />
                        { tollNameError && <p className="tollNameError">{tollNameError}</p>}
                    </div>

                
                    <label htmlFor="vehicle_fare_details" className="v_name">Vehicle fare details<sup className="color-red">*</sup></label>
                    <div className="vehicle_fare_details">
                        <select ref={vehicleTypeRef1} required onChange={vehicleTypeHandler}>
                            <option value="">Select Vehicle type</option>
                            {vehicle_types.map(item => <option value={item} key={item}>{item}</option>)}
                        </select>
                        <input type="number" ref={singleJourneyRef1} placeholder="Single Journey" required/>
                        <input type="number"ref={returnJourneyRef1} placeholder="Return Journey" required />
                    </div>

                    <div className="vehicle_fare_details">
                        <select ref={vehicleTypeRef2} required onChange={vehicleTypeHandler}>
                            <option value="">Select Vehicle type</option>
                            {vehicle_types.map(item => <option value={item} key={item}>{item}</option>)}
                        </select>
                        <input type="number" ref={singleJourneyRef2} placeholder="Single Journey" required />
                        <input type="number" ref={returnJourneyRef2} placeholder="Return Journey" required />
                    </div>

                    <div className="vehicle_fare_details">
                        <select ref={vehicleTypeRef3} required onChange={vehicleTypeHandler}>
                            <option value="">Select Vehicle type</option>
                            {vehicle_types.map(item => <option value={item} key={item}>{item}</option>)}
                        </select>
                        <input type="number" ref={singleJourneyRef3} placeholder="Single Journey" required />
                        <input type="number" ref={returnJourneyRef3} placeholder="Return Journey" required />
                    </div>

                    <div className="vehicle_fare_details">
                        <select ref={vehicleTypeRef4} required onChange={vehicleTypeHandler}>
                            <option value="">Select Vehicle type</option>
                            {vehicle_types.map(item => <option value={item} key={item}>{item}</option>)}
                        </select>
                        <input type="number" ref={singleJourneyRef4} placeholder="Single Journey" required />
                        <input type="number" ref={returnJourneyRef4} placeholder="Return Journey" required />
                    </div>

                    <div className="submit">
                        <input type="submit" value="Add Details" disabled={tollNameError} />
                    </div>
                </form>
            </div>
        </div>
       </div>
    );
};

export default AddNewTollModal;