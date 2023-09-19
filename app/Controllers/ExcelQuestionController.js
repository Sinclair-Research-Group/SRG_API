const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const { handleExcelQuestionDump } = require('../../config/handleExcelQuestionDump.js');

class ExcelQuestionController {
    async convertExcelToJSON(ctx) {
        try {
            // PALMDALE:
            let excel_file = path.join(__dirname, '../../excel/palmdale_sd_missingqs.xlsx');
            // let excel_file = path.join(__dirname, '../../excel/test.xlsx');

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
                    await handleExcelQuestionDump(data);
                } catch (error) {
                    console.log('Error processing excel question data: ', data, error);
                } 
            }

            ctx.status = 200;
            ctx.body = 'Excel question conversion and data processing completed successfully.';
        } catch (err) {
            console.error(err);
            ctx.status = 500;
            ctx.body = 'Error converting Excel quesetion data to JSON and processing it.';
        }
    }
}

module.exports = ExcelQuestionController;