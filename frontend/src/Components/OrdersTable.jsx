import React, { useEffect, useState } from 'react';
import './static/style.css';
import { faCircleArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const OrdersTable = (props) => {
  const [searchValue, setSearchValue] = useState('');
  const [tableRows, setTableRows] = useState([]);
  const [tableHeadings, setTableHeadings] = useState([]);

    // Search functionality
    const searchTable = () => {
      tableRows.forEach((row, i) => {
        let tableData = row.textContent.toLowerCase();
        let searchData = searchValue.toLowerCase();

        row.classList.toggle('hide', tableData.indexOf(searchData) < 0);
        row.style.setProperty('--delay', i / 25 + 's');
      });

      document.querySelectorAll('tbody tr:not(.hide)').forEach((visibleRow, i) => {
        visibleRow.style.backgroundColor = i % 2 === 0 ? 'transparent' : '#0000000b';
      });
    };

    // Sorting functionality
    // const sortTable = (column, sortAsc) => {
    //   [...tableRows]
    //     .sort((a, b) => {
    //       let firstRow = a.querySelectorAll('td')[column].textContent.toLowerCase();
    //       let secondRow = b.querySelectorAll('td')[column].textContent.toLowerCase();

    //       return sortAsc ? (firstRow < secondRow ? 1 : -1) : firstRow < secondRow ? -1 : 1;
    //     })
    //     .map((sortedRow) => document.querySelector('tbody').appendChild(sortedRow));
    // };
    const sortTable = (column, sortAsc) => {
      const tableRows = document.getElementsByTagName('tr');
      const rowsArray = [...tableRows];
    
      rowsArray.sort((a, b) => {
        const firstRow = a.getElementsByTagName('td')[column].textContent.toLowerCase();
        const secondRow = b.getElementsByTagName('td')[column].textContent.toLowerCase();
    
        return sortAsc ? (firstRow < secondRow ? 1 : -1) : firstRow < secondRow ? -1 : 1;
      });
    
      const tbody = document.querySelector('tbody');
      rowsArray.forEach((sortedRow) => tbody.appendChild(sortedRow));
    };
    

    // Converting HTML table to PDF
    // const toPDF = (table) => {
    //   const htmlCode = `
    //     <link rel="stylesheet" href="style.css">
    //     <main class="table">${table.innerHTML}</main>
    //   `;

    //   const newWindow = window.open();
    //   newWindow.document.write(htmlCode);

    //   setTimeout(() => {
    //     newWindow.print();
    //     newWindow.close();
    //   }, 400);
    // };
      const toPDF = (tableData) => {
      // const tableData = tableRef.current.cloneNode(true); // Clone the table element to avoid modifying the original table
    
      // Remove any Font Awesome icon elements from the cloned table
      const iconElements = tableData.getElementsByClassName('FontAwesomeIcon');
      while (iconElements.length > 0) {
        iconElements[0].parentNode.removeChild(iconElements[0]);
      }
    
      const htmlCode = `
        <link rel="stylesheet" href="style.css">
        <main class="table">${tableData.innerHTML}</main>
      `;
    
      const newWindow = window.open();
      newWindow.document.write(htmlCode);
    
      setTimeout(() => {
        newWindow.print();
        newWindow.close();
      }, 400);
    };
    
    // Converting HTML table to JSON
    const toJSON = (table) => {
      let tableData = [];
      let tHead = [];

      const tHeadings = table.querySelectorAll('th');
      const tRows = table.querySelectorAll('tbody tr');

      for (let tHeading of tHeadings) {
        let actualHead = tHeading.textContent.trim().split(' ');
        tHead.push(actualHead.splice(0, actualHead.length - 1).join(' ').toLowerCase());
      }

      tRows.forEach((row) => {
        const rowObject = {};
        const tCells = row.querySelectorAll('td');

        tCells.forEach((tCell, cellIndex) => {
          const img = tCell.querySelector('img');
          if (img) {
            rowObject['customer image'] = decodeURIComponent(img.src);
          }
          rowObject[tHead[cellIndex]] = tCell.textContent.trim();
        });
        tableData.push(rowObject);
      });

      return JSON.stringify(tableData, null, 4);
    };

    // Converting HTML table to CSV File
    const toCSV = (table) => {
      const tHeads = table.querySelectorAll('th');
      const tbodyRows = table.querySelectorAll('tbody tr');

      const headings = [...tHeads]
        .map((head) => {
          let actualHead = head.textContent.trim().split(' ');
          return actualHead.splice(0, actualHead.length - 1).join(' ').toLowerCase();
        })
        .join(',') + ',' + 'image name';

      const tableData = [...tbodyRows]
        .map((row) => {
          const cells = row.querySelectorAll('td');
          const img = decodeURIComponent(row.querySelector('img').src);
          const dataWithoutImg = [...cells].map((cell) => cell.textContent.replace(/,/g, '.').trim()).join(',');

          return dataWithoutImg + ',' + img;
        })
        .join('\n');

      return headings + '\n' + tableData;
    };

    // Converting HTML table to EXCEL File
    const toExcel = (table) => {
      const tHeads = table.querySelectorAll('th');
      const tbodyRows = table.querySelectorAll('tbody tr');

      const headings = [...tHeads]
        .map((head) => {
          let actualHead = head.textContent.trim().split(' ');
          return actualHead.splice(0, actualHead.length - 1).join(' ').toLowerCase();
        })
        .join('\t') + '\t' + 'image name';

      const tableData = [...tbodyRows]
        .map((row) => {
          const cells = row.querySelectorAll('td');
          const img = decodeURIComponent(row.querySelector('img').src);
          const dataWithoutImg = [...cells].map((cell) => cell.textContent.trim()).join('\t');

          return dataWithoutImg + '\t' + img;
        })
        .join('\n');

      return headings + '\n' + tableData;
    };

    const downloadFile = (data, fileType, fileName = '') => {
      const a = document.createElement('a');
      a.download = fileName;
      const mimeTypes = {
        json: 'application/json',
        csv: 'text/csv',
        excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      };
      a.href = `data:${mimeTypes[fileType]};charset=utf-8,${encodeURIComponent(data)}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    };

  useEffect(() => {
    // Fetching table data from server
    fetch('/orders')
      .then((response) => response.text())
      .then((data) => {
        setTableRows(data);
      });

    // Cleanup function
    return () => {
      setTableRows([]);
    };
  }, []);

  return (
    <div className='HTML_Table'>
      <main className="table">
        <section className="table__header">
          <h1>Customer's Orders</h1>
          <div className="input-group">
            <input type="search" placeholder="Search Data..." 
            value={searchValue} 
            onChange={(e) => {setSearchValue(e.target.value); searchTable(); }} />
            <img src="src\Components\static\images\search.png" alt="" />
          </div>
          <div className="export__file">
            <label htmlFor="export-file" className="export__file-btn" title="Export File"></label>
            <input type="checkbox" id="export-file" />
            <div className="export__file-options">
              <label>
                Export As &nbsp; &#10140;
              </label>
              <label htmlFor="export-file" id="toPDF" onClick={() => toPDF(document.getElementById('table-data'))}>
                PDF <img src="src\Components\static\images\pdf.png" alt="" />
              </label>
              <label htmlFor="export-file" id="toJSON" onClick={() => {toJSON(document.getElementById('table-data')); downloadFile((document.getElementById('table-data')), 'json', 'filename.json'); }} >
                JSON <img src="src\Components\static\images\json.png" alt="" />
              </label>
              {/* <label htmlFor="export-file" id="toCSV" onClick={() => {toCSV(document.getElementById('table-data')); downloadFile((document.getElementById('table-data')), 'csv', 'filename.csv');}}> 
                CSV <img src="src\Components\static\images\csv.png" alt="" />
              </label>
              <label htmlFor="export-file" id="toEXCEL" onClick={() => {toExcel(document.getElementById('table-data')); downloadFile((document.getElementById('table-data')), 'excel', 'filename.xlsx');}}>
                EXCEL <img src="src\Components\static\images\excel.png" alt="" />
              </label> */}
            </div>
          </div>
        </section>
        <section className="table__body">
          <table>
            <tbody id="table-data">
              <tr>
                <th onClick={() => sortTable(0, true)}> Id <span className="icon-arrow"><FontAwesomeIcon icon={faCircleArrowUp} /></span></th>
                <th onClick={() => sortTable(1, true)}> Customer <span className="icon-arrow"><FontAwesomeIcon icon={faCircleArrowUp} /></span></th>
                <th onClick={() => sortTable(2, true)}> Location <span className="icon-arrow"><FontAwesomeIcon icon={faCircleArrowUp} /></span></th>
                <th onClick={() => sortTable(3, true)}> Order Date <span className="icon-arrow"><FontAwesomeIcon icon={faCircleArrowUp} /></span></th>
                <th onClick={() => sortTable(4, true)}> Status <span className="icon-arrow"><FontAwesomeIcon icon={faCircleArrowUp} /></span></th>
                <th onClick={() => sortTable(5, true)}> Amount <span className="icon-arrow"><FontAwesomeIcon icon={faCircleArrowUp} /></span></th>
              </tr>
              {Object.keys(tableRows).forEach((order, index) => (
                <tr key={index}>
                  <td>{order[0]}</td>
                  <td>{order[1]}</td>
                  <td>{order[2]}</td>
                  <td>{order[3]}</td>
                  <td>{order[4]}</td>
                  <td>{order[5]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default OrdersTable;
