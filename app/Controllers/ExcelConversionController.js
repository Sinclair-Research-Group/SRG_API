const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const { handleIncomingSurveyResponse } = require('../../config/handleIncomingSurveyResponses.js');

class ExcelConversionController {
    async convertExcelToJSON(ctx) {
        try {
            // PALMDALE:
            //let excel_file = path.join(__dirname, '../../excel/Palmdale_edited.xlsx');

            // SANTA CLARA:
            let excel_file = path.join(__dirname, '../../excel/Santa_ClaraUSD_TIP.xlsx');
            let workbook = XLSX.read(fs.readFileSync(excel_file), {type:'buffer'});

            // Get the first worksheet (or specify the name of the worksheet you want to convert)
            let worksheet = workbook.Sheets[workbook.SheetNames[0]];
            //console.log('worksheet:', worksheet);

            // Convert the worksheet to JSON
            let jsonData = XLSX.utils.sheet_to_json(worksheet);
            // console.log('jsonData: ', jsonData);

            // Process the JSON data with your existing function
            for (let data of jsonData) {
                try {
                    // console.log('data of jsonData: ', data);
                    await handleIncomingSurveyResponse(data);
                } catch (error) {
                    console.log('Error processing excel data: ', data, error);
                } 
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
