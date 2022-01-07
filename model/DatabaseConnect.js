module.exports.connectAndQuery = async function (QueryCode) {
  const pg = require('pg')
  var types = pg.types;
  types.setTypeParser(1114, function (stringValue) {
    return new Date(stringValue + "+0000");
  });
  const {
    Client
  } = pg
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'Tpp_pos',
    user: 'TPP',
    password: 'TPP',
  })
  await client.connect()
  console.log('sql code = ', QueryCode);
  const res = await client.query(QueryCode)
  console.log('raw  response', res.rows)
  await client.end()
  return await res.rows
}