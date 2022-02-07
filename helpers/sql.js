const { BadRequestError } = require("../expressError");

// THIS NEEDS SOME GREAT DOCUMENTATION.

/* 
Helper function for the User model update method.

Accepts data and uses the data to return a set of columns and a set of values that correspond to one another.

Then returns the columns and values seperately in order to be used in an sql query. 
*/ 

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

// this function is just a bunch of if statements. Is it possible to optimize it?
function whereType(query, idx){
  // const whereObj = {
  //   "name": `name LIKE %$${idx}%`,
  //   "minEmployees": `numEmployees >= $${idx}`,
  //   "maxEmployees": `numEmployees <= $${idx}`
  // }

  if(query == "name"){
    return `name LIKE %$${idx}%`
  } else if(query == "minEmployees"){
    return `numEmployees >= $${idx}`
  } else {
    return `numEmployees <= $${idx}`
  }

  // return whereObj[query]
}

function sqlForFilters(filters) {
  const keys = Object.keys(filters);

  const cols = keys.map((colName, idx) => {
    console.log(colName)
    whereType(colName, idx + 1)
  })
  return {
    whereCols: cols.join(" AND "),
    values: Object.values(filters)
  }
}

module.exports = { sqlForPartialUpdate, sqlForFilters };


