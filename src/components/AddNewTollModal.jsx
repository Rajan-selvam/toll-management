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

    const [tollNameError, setTollNameError] = useState();
   
    const closeModal = () => props.closeModal();
    
    const tollNameHandler = () => {
        setTollNameError();
        let entertedTollName = tollNameRef.current.value.toUpperCase();
        const tollExist = tollList && tollList?.length > 0 && 
        tollList.find(toll =>  toll.tollName.toUpperCase() === entertedTollName);
        if (tollExist) {
            setTollNameError('Toll Name Already Exist');
        }
    };

    const newTollSubmitHandler = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
       
        let newTollData = {tollName: tollNameRef.current.value};
        vehicle_types.forEach((vehicle,index) => {
            newTollData = {
                ...newTollData,                
                [`${[data.get(`vehicleType[${index}]`)]}Single`]: data.get(`singleJourneyRate[${index}]`),
                [`${[data.get(`vehicleType[${index}]`)]}Return`]: data.get(`doubleJourneyRate[${index}]`)
            };
        });
        Dispatch(addNewToll(newTollData));
        closeModal();
    };

    const validateDuplicateEntry = (event,index) => {
        const existingVehicleType = vehicle_types.find((vehicle, arrayIndex) => {
            if(arrayIndex !== index) {
                return (document.getElementsByName(`vehicleType[${arrayIndex}]`)[0].value === event.target.value);                  
            }
        });
        if(existingVehicleType) {
            alert('Duplicate Vehicle Entry!');
            event.target.value = "";
        }
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
                    {vehicle_types && vehicle_types.map((input, index) => (
                        <div className="vehicle_fare_details" key={index}>
                            <select required name={`vehicleType[${index}]`} onChange={(event) => validateDuplicateEntry(event,index)}>
                            <option value="">Select Vehicle type</option>
                            {vehicle_types.map(item => <option value={item} key={item}>{item}</option>)}
                            </select>
                            <input type="number" name={`singleJourneyRate[${index}]`} placeholder="Single Journey" required/>
                            <input type="number" name={`doubleJourneyRate[${index}]`} placeholder="Return Journey" required />
                        </div>
                    ))}
                    

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