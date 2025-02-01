// Processing the json data file
// TODO: ACCESS THE CORRECT KEYS FOR LAMOTTE SECTION BASED ON YOUR ORIGINAL IMPLEMENTATION, THIS BELOW CODE ASSUMS THE KEY VALUES
// ALSO PASS THE VALUE FROM THEE DROPDOWN OF YOUR IMPLEMENTATION AS IN THE GIVEN SCREENSHOT (P1) TO THIS FUNCTION, THIS KEY MUST BE IN THE DATA
async function processJSONData(dataKey = 'N1-2'){
    try{
        const response = await fetch("/get-data");
        const data = await response.json();
        console.log(data)

        let processedData = {}
        processedData['elements'] = {}

        // Get the calculated results
        const calculatedResults = data.calculated_results;

        // Get the data for the specific key
        const dataSelected = calculatedResults[dataKey];
        console.log(dataSelected)

        // Process Base Saturation Section
        let dataList = []
        Object.entries(dataSelected).forEach(([key, value]) => {
            let categoryRow = [value.full_name, value.identification, value.value.toString(), value.lower.toString(), value.upper.toString(), value.metric];
            dataList.push(categoryRow)
            });
            processedData['elements'] = dataList;

        return processedData
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// To apply some delay
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Download PDF Report
async function downloadPDFReport(){
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
            <title>Plant_Analysis_Report</title>
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
    }, 1300) // if the css is taking longer time to load, increas the timeout delay
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
            let barWidth = (extractAndJoinNumbers(your_level) / extractAndJoinNumbers(ideal_level_max)) * 2;                    
            let barColor = '';
            if (extractAndJoinNumbers(your_level)/extractAndJoinNumbers(ideal_level_max) <= 0.2){
                barColor = 'red';
            } else if (extractAndJoinNumbers(your_level)/extractAndJoinNumbers(ideal_level_max) > 0.2){
                barColor = 'blue';
            }
            
            barWidth = barWidth < 0.1 ? 'Extremely Low' : barWidth;
            
            // To be added next to the category 
            // 
            row = `
            <tr>
                <td>${category} ${parenthetical != ""? `<span class="parenthetical-text">(${parenthetical})</span>` : ""} </td>
                <td>${your_level} <span class="parenthetical-text">${metric}</span></td>
                <td>
                    <span class="td-bar">
                        <span>${ideal_level_min != ''? ideal_level_min+' - ': ''} ${ideal_level_max} <span class="parenthetical-text">${metric}</span></span>
                        ${ideal_level_max != '' ?
                            `${barWidth == 'Extremely Low'? 
                            `<span class="bar" style="background: none; height: 15px;"">${barWidth}</span>` : 
                            `<span class="bar" style="background: ${barColor}; width:calc(${barWidth}* 103%);"></span>`}` :
                            ``}
                    </span>
                    
                </td>
                ${row_idx == 0 ? `
                    <td class="bar-col" colspan="1" rowspan="${n_rows}"></td>
                    <td class="bar-col" colspan="1" rowspan="${n_rows}"></td>
                    <td class="bar-col" colspan="1" rowspan="${n_rows}"></td>
                    ` : ``}
            </tr>`;
        }
    return row;
}

function appendDataToTable(dataset){
    // 1.0 First table header that contains the albrecht categories
        let firstTableHeader = `
        <thead class="table-header">
            <tr>
                <th colspan="1" class="text-center">Element or <br> Category</th>
                <th colspan="1" class="text-center">Your <br> Level</th>
                <th colspan="1" class="text-center">Acceptable <br> Range</th>
                
                <th colspan="1" class="text-center">Deficient</th>
                <th colspan="1" class="text-center">Acceptable</th>
                <th colspan="1" class="text-center">Excessive or <br> Toxic</th>

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
        if (dataset.hasOwnProperty('elements') && dataset.elements.length > 0) {
            dataset.elements.forEach((data, index) => {
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

        // Append the footer
        // let tableFooter = `
        //     <tr class="table-footer">
        //         <th rowspan="1" colspan="6" class="text-start">
        //             <span class="fw-bold">Explanatory Notes</span>
        //             <span class="fw-light">The La Motte test gives an indication of the amount of plant available nutrients at the time of sampling.</span>
        //         </th>
        //     </tr>
        // `
        // document.getElementById("table-component").innerHTML += tableFooter;
}

// DOM Loaded
document.addEventListener("DOMContentLoaded", async function(){
    const data = await processJSONData(dataKey = 'N1-2');
    console.log("processed_data:", data)
    appendDataToTable(data);
})