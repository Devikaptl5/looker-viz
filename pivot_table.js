looker.plugins.visualizations.add({
  id: "custom_pivot_table",
  label: "Custom Pivot Table",
  options: {},

  create: function(element, config) {
    element.innerHTML = `
      <style>
        .pivot-table {
          border-collapse: collapse;
          width: 100%;
        }
        .pivot-table th, .pivot-table td {
          border: 1px solid #ccc;
          padding: 5px 10px;
          text-align: left;
        }
        .pivot-table th {
          background-color: #f4f4f4;
        }
      </style>
      <div id="pivot-table-container"></div>
    `;
  },

  updateAsync: function(data, element, config, queryResponse, details, done) {
    const container = element.querySelector("#pivot-table-container");
    container.innerHTML = "";

    // Get dimensions and measures
    const dimensions = queryResponse.fields.dimension_like;
    const measures = queryResponse.fields.measure_like;

    if (!dimensions.length || !measures.length) {
      container.innerHTML = "<p>Please select at least one dimension and one measure.</p>";
      done();
      return;
    }

    // Create table
    const table = document.createElement("table");
    table.className = "pivot-table";

    // Build table header
    const header = document.createElement("thead");
    const headerRow = document.createElement("tr");

    // Add dimension headers
    dimensions.forEach(dim => {
      const th = document.createElement("th");
      th.textContent = dim.label_short || dim.label;
      headerRow.appendChild(th);
    });

    // Add measure headers
    measures.forEach(measure => {
      const th = document.createElement("th");
      th.textContent = measure.label_short || measure.label;
      headerRow.appendChild(th);
    });

    header.appendChild(headerRow);
    table.appendChild(header);

    // Build table body
    const body = document.createElement("tbody");
    data.forEach(row => {
      const tr = document.createElement("tr");

      // Add dimension values
      dimensions.forEach(dim => {
        const td = document.createElement("td");
        td.textContent = row[dim.name].rendered || row[dim.name].value;
        tr.appendChild(td);
      });

      // Add measure values
      measures.forEach(measure => {
        const td = document.createElement("td");
        td.textContent = row[measure.name].rendered || row[measure.name].value;
        tr.appendChild(td);
      });

      body.appendChild(tr);
    });

    table.appendChild(body);
    container.appendChild(table);

    done();
  }
});
