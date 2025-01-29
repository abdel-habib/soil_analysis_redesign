// To follow the exact design of the table, we need to have the data in a specific format to 
// fulfill all of the columns
// The data is stored in a nested object similar to databaset_dataset object
// It is divided into two sub-tables inside the large table, one for albrecht rows and one for lamotte rows
// We can see that the data rows are also categorized, some rows has comparison, some don't, and some are under the base saturation category

// The data is stored in the following format:
// category: The name of the category in the table
// parenthetical: The text that appears in the parenthesis next to the category (if any)
// your level: The value that you have for this category
// ideal level minimum: The minimum value that is considered ideal for this category, add it if the ideal is in a range, for example (1-10), the minimum is 1
// ideal level maximum: The maximum value that is considered ideal for this category, add it if the ideal is in a range, for example (1-10), the maximum is 10
// metric: The metric that this category is measured in, for example, ppm, %, etc.

// Once the database dataset is prepared to the correct format, we can use the appendDataToTable function to append the data to the table
let databaset_dataset = {
    "albrecht": {
        "has_comparison": [
            // category, parenthetical, your level, ideal level minimum, ideal level maximum, metric
            ["CEC", "", "42.76", "", "", ""],
            ["TEC", "", "42.76", "", "", ""],
            ["Paramagnetism", "", "0", "", "200", "+"],
            ["pH-level ", "(1:5 water)","7.90", "", "6.3", ""],
            ["Organic Matter", "(IR Gas Anal.)", "6.00", "4", "10", "%"],
            ["Organic Carbon", "","N/A", "2", "5", "%"],
            ["Conductivity", "(1:5 water)", "0", "0.1", "0.2", "mS/cm"],
            ["Ca / Mg Ratio", "", "18.30", "", "7.00", ": 1"],
            ["Nitrate-N", "(KCI)", "1.8", "10", "20", "ppm"],
            ["Ammonium-N", "(KCI)", "7.2", "10", "20", "ppm"],
            ["Phosphorus", "(Mehlich III)", "72", "50", "70", "ppm"],
            ["Calcium", "(Mehlich III)", "7840", "", "5987", "ppm"],
            ["Magnesium", "(Mehlich III)", "257", "", "513", "ppm"],
            ["Potassium", "(Mehlich III)", "98", "334", "838", "ppm"],
            ["Sodium", "(Mehlich III)", "72", "49", "148", "ppm"],
            ["Sulphur", "(KCI)", "11", "40", "50", "ppm"],
            ["Chloride", "", "N/A", "16", "23", "ppm"],
            ["Aluminium", "(Mehlich III)", "77", "", "< 19", "ppm"],
            ["Silicon", "(CaCL2)", "0", "", "> 100", "ppm"],
            ["Boron", "(Hot CaCL2)", "0.92", "1", "3", "ppm"],
            ["Iron", "(DTPA)", "13", "40", "200", "ppm"],
            ["Manganese", "(DTPA)", "20", "30", "100", "ppm"],
            ["Copper", "(DTPA)", "2.7", "2", "7", "ppm"],
            ["Zinc", "(DTPA)", "1.3", "5", "10", "ppm"],
        ],
        // Here are the rows that has two left columns without bars
        // We need to separate them as they will contain a specific table design
        "no_comparison": [
            // category, parenthetical, your level
            ["Texture", "", "0"],
            ["Colour", "", "0"]
        ],
        "base_saturation":[
            // category, parenthetical, your level, ideal level minimum, ideal level maximum, metric
            ["Calcium", "", "91.67", "", "70", "%"],
            ["Magnesium", "", "5.01", "", "10", "%"],
            ["Potassium", "", "0.59", "2.0", "5.0", "%"],
            ["Sodium", "", "0.73", "0.50", "1.50", "%"],
            ["Other Bases", "", "0.00", "", "5.00", "%"],
            ["Aluminium", "", "2.00", "", "0.50", "%"],
            ["Hydrogen", "", "0.00", "", "10.00", "%"],
        ]
    }, 
    "lamotte":[
        ["Calcium ", "","0", "1000", "2000", "ppm"],
        ["Magnesium ", "","0", "140", "285", "ppm"],
        ["Phosphorus ", "","0", "20", "80", "ppm"],
        ["Potassium ", "","0", "80", "100", "ppm"],
    ]
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
            
            row = `
            <tr>
                <td>${category} </td>
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
            dataset.albrecht.has_comparison.length + 
            dataset.albrecht.no_comparison.length + 
            2 + // base saturation rows headers
            dataset.albrecht.base_saturation.length;

        // Albrecht Rows 
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
        // create a new tbody for lamotte rows
        let tableBody2 = document.createElement("tbody");

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
document.addEventListener("DOMContentLoaded", function(){
    appendDataToTable(databaset_dataset);
})