// Processing the json data file
// TODO: ACCESS THE CORRECT KEYS FOR LAMOTTE SECTION BASED ON YOUR ORIGINAL IMPLEMENTATION, THIS BELOW CODE ASSUMS THE KEY VALUES
// ALSO PASS THE VALUE FROM THEE DROPDOWN OF YOUR IMPLEMENTATION AS IN THE GIVEN SCREENSHOT (P1) TO THIS FUNCTION, THIS KEY MUST BE IN THE DATA
async function processJSONData(dataKey = 'P1'){
    try{
        const response = await fetch("/get-data");
        const data = await response.json();
        console.log(data)

        let processedData = {}
        processedData['albrecht'] = {}
        processedData['lamotte'] = {}

        // Get the calculated results
        const calculatedResults = data.calculated_results;

        // Get the data for the specific key
        const dataSelected = calculatedResults[dataKey];

        // Process Base Saturation Section
        let keyHasComparisonList = []
        Object.entries(dataSelected.final_values).forEach(([key, value]) => {
            let categoryRow = [value.name, value.identification, value.value.toString(), value.lower.toString(), value.upper.toString(), ""];
            keyHasComparisonList.push(categoryRow)
            });
            processedData['albrecht']['has_comparison'] = keyHasComparisonList;

        // Process Base Saturation Section
        let baseSaturationList = []
        Object.entries(dataSelected.base_saturation).forEach(([key, value]) => {
            let categoryRow = [value.full_name, value.identification, value.value.toString(), value.lower.toString(), value.upper.toString(), ""];
            baseSaturationList.push(categoryRow)
          });
          processedData['albrecht']['base_saturation'] = baseSaturationList;      
          
        // Process Lamotte Section
        let lamotteList = []
        Object.entries(dataSelected.ideal_ratio_levels).forEach(([key, value]) => {
            let categoryRow = [value.name, "", value.value.toString(), value.lower.toString(), value.ideal.toString(), ""];
            lamotteList.push(categoryRow)
          });
          processedData['lamotte'] = lamotteList;

        return processedData
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Download PDF Report
function downloadPDFReport(){
    // Get the CSS
    function css_text(x) { return x.cssText; }
    var file = document.getElementById('tableCSS');
    var styles = Array.prototype.map.call(file.sheet.cssRules, css_text).join('\n');
    
    var bootstrap = document.querySelector('#bootstapCSS');

    // Get the HTML
    const elements = document.querySelector('#reportContainer');

    // Create the main window
    const html_template = `
    <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Soil_Analysis_Report</title>
            ${bootstrap.outerHTML}
            <style>${styles}</style>
        </head>

        <body>${elements.innerHTML}</body>
        </html>
    `;

    // Create a print window
    const pdfwindow = window.open('', '', 'width=800,height=600');
    pdfwindow.document.write(html_template);

    setTimeout(() => {
        pdfwindow.print();
        pdfwindow.document.close();
        pdfwindow.close();
    }, 400) // if the css is taking longer time to load, increas the timeout delay
}

function extractAndJoinNumbers(str) {
    let match = str.match(/[\d.]+/g); // Extract numbers with/without dots
    return match ? parseFloat(match.join("")) : NaN; // Join and convert to float
}

function createRow(
    format,
    category = "",
    parenthetical = "", 
    your_level = "", 
    ideal_level_min = "",
    ideal_level_max = "", 
    metric = "",
    row_idx, 
    n_rows){
        let row = '';
        if (format == 'rowFormat3Col1Empty4th'){
            let barWidth = (your_level / extractAndJoinNumbers(ideal_level_max)) * 2;                    
            let barColor = '';
            if (your_level/extractAndJoinNumbers(ideal_level_max) < 0.25){
                barColor = 'red';
            } else if (your_level/extractAndJoinNumbers(ideal_level_max) > 1.3){
                barColor = 'cyan';
            } else{
                barColor = 'green';
            }
            
            barWidth = barWidth < 0.1 ? 'Extremely Low' : barWidth;
            
            // To be added next to the category 
            // 
            row = `
            <tr>
                <td>${category} ${parenthetical != ""? `<span class="parenthetical-text">(${parenthetical})</span>` : ""} </td>
                <td>${your_level} <span class="parenthetical-text">${metric}</span></td>
                <td class="td-bar">
                    <span>${ideal_level_min != ''? ideal_level_min+' - ': ''} ${ideal_level_max} <span class="parenthetical-text">${metric}</span></span>
                    ${ideal_level_max != '' ?
                        `${barWidth == 'Extremely Low'? 
                        `<span class="bar" style="background: none; height: 15px;"">${barWidth}</span>` : 
                        `<span class="bar" style="background: ${barColor}; width:calc(${barWidth}* 100%);"></span>`}` :
                        ``}
                    
                </td>
                ${row_idx == 0 ? `
                    <td class="bar-col" colspan="1" rowspan="${n_rows}"></td>
                    <td class="bar-col" colspan="1" rowspan="${n_rows}"></td>
                    <td class="bar-col" colspan="1" rowspan="${n_rows}"></td>
                    ` : ``}
            </tr>`;
        }else if (format == "rowFormat2Col1Empty4th"){
            row = `
            <tr>
                <td>${category} <span class="parenthetical-text">${parenthetical}</span></td>
                <td colspan="2" rowspan="1">${your_level}</td>
                </tr>
            `;
        }
    return row;
}

function appendDataToTable(dataset){
    // 1.0 First table header that contains the albrecht categories
        let firstTableHeader = `
        <thead class="table-header">
            <tr>
                <th rowspan="2">ALBRECH <br> CATEGORY</th>
                <th rowspan="2">Your <br> Level</th>
                <th rowspan="2">Ideal <br> Level</th>
                <th colspan="3">Nutrient Status</th>
            </tr>
            <tr>
                <th>Low</th>
                <th>Medium</th>
                <th>High</th>
            </tr>
        </thead>
        `;
        document.getElementById("table-component").innerHTML += firstTableHeader;

        // 1.1. First Table body
        let tableBody = document.getElementById("element-table-body");
        let totalRows = 
            (dataset?.albrecht?.has_comparison?.length || 0) + 
            (dataset?.albrecht?.no_comparison?.length || 0) + 
            (dataset?.albrecht?.base_saturation ? 2 : 0) +  // add 2 only if base_saturation exists
            (dataset?.albrecht?.base_saturation?.length || 0);

        // console.log(totalRows)
        // Albrecht Rows 
        if (dataset.hasOwnProperty('albrecht') && dataset.albrecht.hasOwnProperty('has_comparison')) {
            dataset.albrecht.has_comparison.forEach((data, index) => {
                let row = createRow(
                    format= 'rowFormat3Col1Empty4th', 
                    category = data[0], 
                    parenthetical = data[1],
                    your_level = data[2], 
                    ideal_level_min = data[3],
                    ideal_level_max = data[4], 
                    metric = data[5],
                    row_index = index, 
                    n_rows = totalRows
                );
                
                tableBody.innerHTML += row;
            });
        }

        if (dataset.hasOwnProperty('albrecht') && dataset.albrecht.hasOwnProperty('no_comparison')) {
            // Albrech rows that has no comparison to an ideal level
            dataset.albrecht.no_comparison.forEach((data, index) => {
                let row = createRow(
                    format="rowFormat2Col1Empty4th",
                    category = data[0],
                    parenthetical = data[1],
                    your_level = data[2],
                )
    
                tableBody.innerHTML += row;
            })
        }

        if (dataset.hasOwnProperty('albrecht') && dataset.albrecht.hasOwnProperty('base_saturation')) {
            
            // Albrech rows under the base saturation category
            let base_saturation_rows_headers = `
                    <tr>
                        <td class="text-center fw-bold" colspan="3" rowspan="1">Base Saturation</td>
                    </tr>
                    <tr>
                        <td class="text-center" colspan="3" rowspan="1">(Levels are not relevant in soils with a TEC below 5)</td>
                    </tr>
                `;
            tableBody.innerHTML += base_saturation_rows_headers;

            dataset.albrecht.base_saturation.forEach((data, index) => {
                let row = createRow(
                    format= 'rowFormat3Col1Empty4th', 
                    category = data[0], 
                    parenthetical = data[1],
                    your_level = data[2], 
                    ideal_level_min = data[3],
                    ideal_level_max = data[4], 
                    metric = data[5],
                    row_index = -9999,  // set the row index to any value as we continue using the same table
                    n_rows = -9999 // we calculated this for the first category and we don't need to use it here
                );
                
                tableBody.innerHTML += row;
            });
        }
        // Lamotte rows
        // create a new tbody for lamotte rows
        let tableBody2 = document.createElement("tbody");

        if (dataset.hasOwnProperty('lamotte') & dataset.lamotte.length > 0) {
            // Second table header
            let secondTableHeader = `
            <thead class="table-header">
                <tr>
                    <th rowspan="2">Lamotte/Reams <br> CATEGORY</th>
                    <th rowspan="2">Your <br> Level</th>
                    <th rowspan="2">Ideal <br> Level</th>
                    <th colspan="3">Nutrient Status</th>
                </tr>
                <tr>
                    <th>Low</th>
                    <th>Medium</th>
                    <th>High</th>
                </tr>
            </thead>
            `;
            document.getElementById("table-component").innerHTML += secondTableHeader;
            

            // Lamotte rows
            dataset.lamotte.forEach((data, index) => {
                let row = createRow(
                    format= 'rowFormat3Col1Empty4th', 
                    category = data[0], 
                    parenthetical = data[1],
                    your_level = data[2], 
                    ideal_level_min = data[3],
                    ideal_level_max = data[4], 
                    metric = data[5],
                    row_index = index,  // set the row index to any value as we continue using the same table
                    n_rows = dataset.lamotte.length // we calculated this for the first category and we don't need to use it here
                );
    
                tableBody2.innerHTML += row;
            });
        }

        // append the second table body to the table component
        document.getElementById("table-component").innerHTML += tableBody2.outerHTML;

        // Append the footer
        let tableFooter = `
            <tr class="table-footer">
                <th rowspan="1" colspan="6" class="text-start">
                    <span class="fw-bold">Explanatory Notes</span>
                    <span class="fw-light">The La Motte test gives an indication of the amount of plant available nutrients at the time of sampling.</span>
                </th>
            </tr>
        `
        document.getElementById("table-component").innerHTML += tableFooter;
}

// DOM Loaded
document.addEventListener("DOMContentLoaded", async function(){
    const data = await processJSONData(dataKey = 'P1');
    console.log(data)
    appendDataToTable(data);
})