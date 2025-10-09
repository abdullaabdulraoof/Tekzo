import React from 'react'
import { Sidebar } from './Sidebar'
import Icon1 from '@material-ui/icons/ReplyAll';
import Icon2 from '@material-ui/icons/Markunread';
import Icon3 from '@material-ui/icons/CloudDownload';
import TextField from '@material-ui/core/TextField';
import data from '../constants/sampleMovieData';
import DataTable from 'react-data-table-component';


const subHeaderComponent = (
    <div style={{ display: 'flex', alignItems: 'center' }}>
        <TextField id="outlined-basic" label="Search" variant="outlined" size="small" style={{ margin: '5px' }} />
        <Icon1 style={{ margin: '5px' }} color="action" />
        <Icon2 style={{ margin: '5px' }} color="action" />
        <Icon3 style={{ margin: '5px' }} color="action" />
    </div>
);



const columns = [
    { name: 'OrderId', selector: row => row.orderId, },
    { name: 'Qty', selector: row => row.qty, },
    { name: 'Status', selector: row => row.status, },
    { name: 'Total', selector: row => row.total, },
];

const data = [
    { id: 1, orderId: 11223344, qty: 2, status: 'Placed', total: 3000 },
    { id: 2, orderId: 11221133, qty: 3, status: 'Pending', total: 4000 },
]




export const Order = () => {
    return (
        <section className='min-h-screen bg-black text-white'>
            <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-36 pt-24 pb-16'>

                <div className='flex flex-col justify-between items-center pb-4 w-full lg:flex-row gap-2'>
                    <div>

                        <h2 className='text-2xl sm:text-3xl font-bold'>My Account</h2>
                    </div>
                    <Sidebar />
                </div>

                <div className='w-full h-screen'>
                    <div className='flex justify-center items-center bg-black border border-gray-700/70 rounded-xl shadow-2xl h-[75%] w-full'>

                        <DataTable
                            columns={columns}
                            data={data}
                            defaultSortFieldId={1}
                            selectableRows={selectableRows}
                            selectableRowsComponentProps={selectableRowsComponentProps}
                            selectableRowsNoSelectAll={selectableRowsNoSelectAll}
                            selectableRowsHighlight={selectableRowsHighlight}
                            selectableRowsSingle={selectableRowsSingle}
                            selectableRowsVisibleOnly={selectableRowsVisibleOnly}
                            expandableRows={expandableRows}
                            expandOnRowClicked={expandOnRowClicked}
                            expandOnRowDoubleClicked={expandOnRowDoubleClicked}
                            expandableRowsHideExpander={expandableRowsHideExpander}
                            pagination={pagination}
                            highlightOnHover={highlightOnHover}
                            striped={striped}
                            pointerOnHover={pointerOnHover}
                            dense={dense}
                            noTableHead={noTableHead}
                            persistTableHead={persistTableHead}
                            progressPending={progressPending}
                            noHeader={noHeader}
                            subHeader={subHeader}
                            subHeaderComponent={subHeaderComponent}
                            subHeaderAlign={subHeaderAlign}
                            subHeaderWrap={subHeaderWrap}
                            noContextMenu={noContextMenu}
                            fixedHeader={fixedHeader}
                            fixedHeaderScrollHeight={fixedHeaderScrollHeight}
                            direction={direction}
                            responsive={responsive}
                            disabled={disabled}
                        />


                    </div>
                </div>

            </div>
        </section>
    )
}

