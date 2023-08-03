const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const { handleIncomingSurveyResponse } = require('../../config/handleIncomingSurveyResponses.js');

class ExcelConversionController {
    async convertExcelToJSON(ctx) {
        try {
            // console.log('im in the excel conversion controller!')
            // excel_file = require('../../excel/Palmdale_edited.xlsx')
            // // Load the Excel file
            // let workbook = XLSX.readFile(excel_file);
            let excel_file = path.join(__dirname, '../../excel/Palmdale_edited.xlsx');
            let workbook = XLSX.read(fs.readFileSync(excel_file), {type:'buffer'});

            // Get the first worksheet (or specify the name of the worksheet you want to convert)
            let worksheet = workbook.Sheets[workbook.SheetNames[0]];
            //console.log('worksheet:', worksheet);

            // Convert the worksheet to JSON
            let jsonData = XLSX.utils.sheet_to_json(worksheet);

            //console.log('json data: ', jsonData);

            // Process the JSON data with your existing function
            for (let data of jsonData) {
                await handleIncomingSurveyResponse(data);
            }

            ctx.status = 200;
            ctx.body = 'Excel conversion and data processing completed successfully.';
        } catch (err) {
            console.error(err);
            ctx.status = 500;
            ctx.body = 'Error converting Excel data to JSON and processing it.';
        }
    }
}

module.exports = ExcelConversionController;
