import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AgGridReact } from 'ag-grid-react'
import { data as apiData } from './data'
import { useParams } from 'react-router-dom'

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

function wait(duration) {
  return new Promise(resolve => setTimeout(resolve, duration))
}

function App() {
  const gridRef = useRef();
  const { } = useParams();
  const pilotQuery = useQuery({
    queryKey: ['pilots'],
    queryFn: () => wait(5000).then(() => apiData)
  });

  const [columnDefs, setColumnDefs] = useState([{
    field: 'id',
    hidden: true,
  }, {
    field: 'name'
  },
  {
    field: 'plate'
  }]);

  const [flatData, setFlatData] = useState([])

  const defaultColDef = {
    sortable: true,
    filter: true
  };

  useEffect(() => {
    function flattify(rawData) {
      const flatData = rawData.flatMap(d => d.cars.map(c => ({ id: d.id, name: d.name, brand: c.brand, year: c.year, plate: c.plate, ...Object.values(c.prizes) })));
      return flatData;
    }

    function appendNewColumns(flatData) {
      if (flatData.length < 1) {
        return [];
      }
      const firstData = flatData[0];
      const yearKeys = Object.keys(firstData)
        .filter(key => !isNaN(Number.parseInt(key)));

      console.log(Object.keys(firstData))
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

      return [...columnDefs, ...columns];
    }

    if (pilotQuery.data) {
      const parsedData = flattify(pilotQuery.data);
      console.log(parsedData)
      setFlatData(parsedData);

      const columns = appendNewColumns(parsedData);
      setColumnDefs(columns);

    }

  }, [pilotQuery.data]);

  const getRowId = useCallback((params) => {
    return params.data.plate;
  }, [])

  if (pilotQuery.isLoading) {
    return <h1>Loading...</h1>
  }

  if (pilotQuery.error) {
    return <pre>Error: {JSON.stringify(pilotQuery.error)}</pre>
  }

  return (
    <div className="ag-theme-alpine" style={{ height: 500 }}>
      <AgGridReact
        getRowId={getRowId}
        ref={gridRef}
        rowData={flatData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        animateRows={true}
        rowSelection='multiple'
      >
      </AgGridReact>
    </div>
  )
}

export default App
