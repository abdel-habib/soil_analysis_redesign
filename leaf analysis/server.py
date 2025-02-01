from flask import (
    Flask, 
    request,
    jsonify,
    render_template,
    )

app = Flask(__name__)

# Example 1
# dataObject = {
#    "calculated_results":{
#       "N1-2": [
#          {
#             "full_name": "Nitrogen",
#             "identification": "N",
#             "value": "2.66", # your_level
#             "lower": "2.8",
#             "upper": "4.0",
#             "metric": "%"
#          },
#          {
#             "full_name": "Phosphorus",
#             "identification": "P",
#             "value": "0.16", # your_level
#             "lower": "0.20",
#             "upper": "0.25",
#             "metric": "%"
#          },
#          {
#             "full_name": "Potassium",
#             "identification": "K",
#             "value": "3.14", # your_level
#             "lower": "3.1",
#             "upper": "4.0",
#             "metric": "%"
#          },
#          {
#             "full_name": "Sulphur",
#             "identification": "S",
#             "value": "0.23", # your_level
#             "lower": "0.2",
#             "upper": "0.27",
#             "metric": "%"
#          },
#          {
#             "full_name": "Calcium",
#             "identification": "Ca",
#             "value": "1.04", # your_level
#             "lower": "0.8",
#             "upper": "1.2",
#             "metric": "%"
#          },
#          {
#             "full_name": "Magnesium",
#             "identification": "Mg",
#             "value": "0.29", # your_level
#             "lower": "0.3",
#             "upper": "0.46",
#             "metric": "%"
#          },
#          {
#             "full_name": "Sodium",
#             "identification": "Na",
#             "value": "<0.01", # your_level
#             "lower": "0.01",
#             "upper": "0.1",
#             "metric": "%"
#          },
#          {
#             "full_name": "Copper",
#             "identification": "Cu",
#             "value": "5", # your_level
#             "lower": "7",
#             "upper": "20",
#             "metric": "ppm"
#          },
#          {
#             "full_name": "Zinc",
#             "identification": "Zn",
#             "value": "22", # your_level
#             "lower": "21",
#             "upper": "35",
#             "metric": "ppm"
#          },
#          {
#             "full_name": "Manganese",
#             "identification": "Mn",
#             "value": "682", # your_level
#             "lower": "100",
#             "upper": "2200",
#             "metric": "ppm"
#          },
#          {
#             "full_name": "Iron",
#             "identification": "Fe",
#             "value": "223", # your_level
#             "lower": "70",
#             "upper": "200",
#             "metric": "ppm"
#          },
#          {
#             "full_name": "Boron",
#             "identification": "B",
#             "value": "32.0", # your_level
#             "lower": "20",
#             "upper": "80",
#             "metric": "ppm"
#          },
#          {
#             "full_name": "Molybdenum",
#             "identification": "Mo",
#             "value": "0.9", # your_level
#             "lower": "",
#             "upper": ">3.2",
#             "metric": "ppm"
#          },
#          {
#             "full_name": "Silicon",
#             "identification": "Si",
#             "value": "381", # your_level
#             "lower": "",
#             "upper": "N/A",
#             "metric": "ppm"
#          },
#          {
#             "full_name": "Cobalt",
#             "identification": "Co",
#             "value": "0.2", # your_level
#             "lower": "",
#             "upper": "N/A",
#             "metric": "ppm"
#          }
#       ]
#    }
# }

# Example 2
dataObject = {
   "calculated_results":{
      "N1-2": [
         {
            "full_name": "Nitrogen",
            "identification": "N",
            "value": "3.52", # your_level
            "lower": "2.8",
            "upper": "4.0",
            "metric": "%"
         },
         {
            "full_name": "Phosphorus",
            "identification": "P",
            "value": "0.20", # your_level
            "lower": "0.20",
            "upper": "0.25",
            "metric": "%"
         },
         {
            "full_name": "Potassium",
            "identification": "K",
            "value": "4.41", # your_level
            "lower": "3.1",
            "upper": "4.0",
            "metric": "%"
         },
         {
            "full_name": "Sulphur",
            "identification": "S",
            "value": "0.25", # your_level
            "lower": "0.2",
            "upper": "0.27",
            "metric": "%"
         },
         {
            "full_name": "Calcium",
            "identification": "Ca",
            "value": "0.86", # your_level
            "lower": "0.8",
            "upper": "1.2",
            "metric": "%"
         },
         {
            "full_name": "Magnesium",
            "identification": "Mg",
            "value": "0.29", # your_level
            "lower": "0.3",
            "upper": "0.46",
            "metric": "%"
         },
         {
            "full_name": "Sodium",
            "identification": "Na",
            "value": "0.01", # your_level
            "lower": "0.01",
            "upper": "0.1",
            "metric": "%"
         },
         {
            "full_name": "Copper",
            "identification": "Cu",
            "value": "8", # your_level
            "lower": "7",
            "upper": "20",
            "metric": "ppm"
         },
         {
            "full_name": "Zinc",
            "identification": "Zn",
            "value": "22", # your_level
            "lower": "21",
            "upper": "35",
            "metric": "ppm"
         },
         {
            "full_name": "Manganese",
            "identification": "Mn",
            "value": "858", # your_level
            "lower": "100",
            "upper": "2200",
            "metric": "ppm"
         },
         {
            "full_name": "Iron",
            "identification": "Fe",
            "value": "146", # your_level
            "lower": "70",
            "upper": "200",
            "metric": "ppm"
         },
         {
            "full_name": "Boron",
            "identification": "B",
            "value": "47.0", # your_level
            "lower": "20",
            "upper": "80",
            "metric": "ppm"
         },
         {
            "full_name": "Molybdenum",
            "identification": "Mo",
            "value": "0.6", # your_level
            "lower": "",
            "upper": ">3.2",
            "metric": "ppm"
         },
         {
            "full_name": "Silicon",
            "identification": "Si",
            "value": "402", # your_level
            "lower": "",
            "upper": "N/A",
            "metric": "ppm"
         },
         {
            "full_name": "Cobalt",
            "identification": "Co",
            "value": "0.1", # your_level
            "lower": "",
            "upper": "N/A",
            "metric": "ppm"
         }
      ]
   }
}


@app.route("/")
def index():
    # return the json file with the template
    return render_template('index.html')

@app.route("/get-data", methods=["GET"])
def getData():
   return jsonify(dataObject)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000)