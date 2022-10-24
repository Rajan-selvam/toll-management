import "./table.css";

const Table = ({headers, rows, rowKeys, emptyRow}) => {
    let records = rows?.length > 0 ?
        rows?.map((row, index) => (
            <tr className="table-body-row" key={index}>
                {rowKeys?.map((rowKey,i) => {
                    return (
                    <td className="table-body-col" key={i}>{row[rowKey]}</td>
                )})}
            </tr>
        )) :
        <tr className="table-body-row">
            <td colSpan={headers.length} className="col-span">{emptyRow ?? `No Records Found`}</td>
        </tr>;
    
    return (
    <div className="table-div">
        <table className="table">
            <thead className="table-head">
                <tr className="table-row">
                    {headers && headers?.map((item, index) => 
                    <th className={`table-headers header_${index}`} key={index}>{item}</th>
                    )}
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