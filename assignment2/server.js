const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

app.use(cors()); 

// Use JSON body parser middleware
app.use(bodyParser.json());

// Initialize SQLite database
let db = new sqlite3.Database('database.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

// Create history table
db.run('CREATE TABLE IF NOT EXISTS history(expression text, result text)', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('History table created.');
});

app.post('/calculate', (req, res) => {
  let expression = req.body.expression;
  let result;
  try {
    result = eval(expression);
    // Insert the expression and result to the history table
    db.run(`INSERT INTO history(expression, result) VALUES(?, ?)`, [expression, result], function(err) {
      if (err) {
        return console.log(err.message);
      }
      console.log(`A row has been inserted with rowid ${this.lastID}`);
      
      // Check the number of rows in the history table and delete the oldest if there are more than 10
      db.run(`DELETE FROM history WHERE rowid NOT IN (SELECT rowid FROM history ORDER BY rowid DESC LIMIT 10)`);
    });
    res.json({ result: result });
  } catch (e) {
    res.json({ error: 'Invalid expression' });
  }
});

// Endpoint to get calculation history
app.get('/history', (req, res) => {
  db.all('SELECT * FROM history ORDER BY rowid DESC', [], (err, rows) => {
    if (err) {
      throw err;
    }
    console.log(rows); // Print history data
    res.json(rows);
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

});
