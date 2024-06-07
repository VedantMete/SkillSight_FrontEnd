fetch('video_results')
  .then(response => response.json())
  .then(data => {
    // Log the retrieved data
    console.log(data);

    // Create Doughnut Chart
    var ctx = document.getElementById("myChart").getContext("2d");
    var myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral', 'no_face'],
        datasets: [{
          data: data[1],
          backgroundColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(145, 195, 219, 1)',
            'rgba(180, 221, 220, 1)'
          ],
          hoverOffset: 4
        }]
      },
      options: {
        title: {
          display: true,
          text: 'Emotion Analysis',
          responsive: true,
          maintainAspectRatio: false,
        }
      }
    });

    // Create Questions and Answers Table
    var tableContainer = document.getElementById("myTable");
    var table = document.createElement("table");

    // Table Headings
    var headingsRow = document.createElement("tr");
    var headings = ['Question', 'Preferred Answer', 'Your Answer', 'Similarity'];
    headings.forEach(headingText => {
      var heading = document.createElement("th");
      heading.appendChild(document.createTextNode(headingText));
      headingsRow.appendChild(heading);
    });
    table.appendChild(headingsRow);

    // Table Rows
    data[0].forEach(rowData => {
      var row = document.createElement("tr");
      rowData.forEach((cellData, index) => {
        var cell = document.createElement("td");
        var cellText = '';
        if (index === 3) {
          var similarity = parseFloat(cellData);
          var similarityPercentage = (similarity * 100).toFixed(2) + '%';
          cellText = document.createTextNode(similarityPercentage);
        } else {
          cellText = document.createTextNode(cellData);
        }
        cell.appendChild(cellText);
        row.appendChild(cell);
      });
      table.appendChild(row);
    });
    tableContainer.appendChild(table);

    // Create Suggestions/Improvements Table
    var suggestionsContainer = document.getElementById("suggestionsTable");
    var suggestionsTable = document.createElement("table");

    // Suggestions Table Headings
    var suggestionsHeadingsRow = document.createElement("tr");
    var suggestionsHeadings = ['Question', 'Suggestions for Improvement'];
    suggestionsHeadings.forEach(headingText => {
      var heading = document.createElement("th");
      heading.appendChild(document.createTextNode(headingText));
      suggestionsHeadingsRow.appendChild(heading);
    });
    suggestionsTable.appendChild(suggestionsHeadingsRow);

    // Suggestions Table Rows
    data[0].forEach(rowData => {
      var row = document.createElement("tr");
      var questionCell = document.createElement("td");
      questionCell.appendChild(document.createTextNode(rowData[0]));
      row.appendChild(questionCell);

      var suggestionCell = document.createElement("td");
      var similarity = parseFloat(rowData[3]);
      var suggestionText = 'Great job!';

      /*if (similarity < 0.5) {
        suggestionText = 'Consider elaborating more on your answers.';
      } else if (similarity < 0.8) {
        suggestionText = 'Good, but there’s room for improvement in your responses.';
      }*/

      if (similarity < 0.5) {
        var suggestions = [
          'Consider elaborating more on your answers.',
          'Try providing more details to enrich your responses.',
          'Your answers could benefit from more elaboration.'
        ];
        suggestionText = suggestions[Math.floor(Math.random() * suggestions.length)];
      } else if (similarity < 0.8) {
        var suggestions = [
          'Good, but there’s room for improvement in your responses.',
          'You’re on the right track, but try to expand on your answers a bit more.',
          'Your responses are decent, but they could use some more depth.'
        ];
        suggestionText = suggestions[Math.floor(Math.random() * suggestions.length)];
      }

      // Analyze emotion data to add more suggestions
      var emotionData = data[1];
      if (emotionData[0] > 10) { // Example threshold for 'angry'
        suggestionText += ' Try to stay calm and composed.';
      }
      if (emotionData[4] > 10) { // Example threshold for 'sad'
        suggestionText += ' Maintain a positive demeanor.';
      }

      suggestionCell.appendChild(document.createTextNode(suggestionText));
      row.appendChild(suggestionCell);
      suggestionsTable.appendChild(row);
    });
    suggestionsContainer.appendChild(suggestionsTable);
  })
  .catch(error => console.error('Error fetching data:', error));
