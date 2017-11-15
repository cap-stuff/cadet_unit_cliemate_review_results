Cadet Unit Climate Review
===

This template takes raw input from the Cadet Unit Climate Review in JSON format and creates a report that you can then use to envision where your Squadron currently sits.

Need to document how to actually use it, but hopefully a tech savy individual can understand the really rough notes below:

 * Ensure you have Node.js 8.9.0+ installed
 * Clone this repo locally
 * Look at the sample data files in src/data/questions.json and src/data/results.json
 * Somehow generate your data files (I used google spreadsheet and converted with http://www.convertcsv.com/csv-to-json.htm)
 * Save the new data file(s)
 * Run "yarn start" or "npm start" to view the report locally
 * Run "yarn build" or "npm run build" to create a build in public/ that you can put on your website
