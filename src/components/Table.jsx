import "./table.css";
import { TrashIcon } from "../constant/entities";

const Table = ({
    headers, 
    rows, 
    emptyRow, 
    deleteKey,
    deleteHandler
}) => {
    let records = rows?.length > 0 ?
        rows?.map((row, index) => {
            return (
            <tr className="table-body-row" key={index}>
                {headers?.map((rowKey,i) => (
                    <td className="table-body-col" key={i}>{row[rowKey]}</td>
                ))}
                {deleteKey && 
                    <td className="table-body-col">
                        <TrashIcon 
                            onClick={() => deleteHandler(row[deleteKey])} 
                            className='delete-icon' 
                        />
                    </td>
                }
            </tr>
        )}) :
        <tr className="table-body-row">
            <td 
                colSpan={deleteKey ? headers.length + 1 : headers.length} 
                className="col-span">{emptyRow ?? `No Records Found`}
            </td>
        </tr>;
    
    return (
    <div className="table-div">
        <table className="table">
            <thead className="table-head">
                <tr className="table-row">
                    {headers?.map((item, index) => 
                    <th className={`table-headers header_${index}`} key={index}>{item}</th>
                    )}
                    {deleteKey && 
                    <th className={`table-headers header_${headers.length}`}>Action</th>
                    }
                </tr>
            </thead>
            <tbody className="table-body">
                {records}
            </tbody>
            <tfoot className="table-foot"></tfoot>
        </table>
    </div>);
};

export default Table;