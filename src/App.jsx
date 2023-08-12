import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AgGridReact } from 'ag-grid-react'
import { data as apiData } from './data'
import { useParams } from 'react-router-dom'

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { observer } from 'mobx-react-lite'

const App = observer(({ store }) => {
  const gridRef = useRef();
  const { } = useParams();

  const [defaultColumns, setDefaultColumns] = useState([
    {
        field: 'name'
    },
    {
        field: 'plate'
    }]);

  const defaultColDef = {
    sortable: true,
    filter: true
  };

  function appendNewColumns(flatData) {
    if (flatData.length < 1) {
      return [];
    }
    const firstData = flatData[0];
    const yearKeys = Object.keys(firstData)
      .filter(key => !isNaN(Number.parseInt(key)));

    const columns = []
    yearKeys.forEach(key => {
      columns.push({
        valueGetter: (params) => {
          return params.data[key].amount
        },
        headerValueGetter: (params) => {
          return firstData[key].year
        }
      })
    })

    return [...defaultColumns, ...columns];
  }

  const getRowId = useCallback((params) => {
    return params.data.plate;
  }, []);

  if (store.pilots.isLoading) {
    return <h1>Loading...</h1>
  }

  if (store.pilots.error) {
    return <pre>Error: {JSON.stringify(pilots.error)}</pre>
  }

  const columns = appendNewColumns(store.flatData);

  return (
    <div className="ag-theme-alpine" style={{ height: 500 }}>
      <AgGridReact
        getRowId={getRowId}
        ref={gridRef}
        rowData={store.flatData}
        columnDefs={columns}
        defaultColDef={defaultColDef}
        animateRows={true}
        rowSelection='multiple'
      >
      </AgGridReact>
    </div>
  )
})

export default App
