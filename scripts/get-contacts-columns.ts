import { readOnlyPool } from '../server/db';

async function getColumns() {
  const result = await readOnlyPool.query(`
    SELECT column_name, data_type
    FROM information_schema.columns 
    WHERE table_name = 'contacts'
    ORDER BY ordinal_position
  `);
  
  console.log(JSON.stringify(result.rows, null, 2));
  
  const countResult = await readOnlyPool.query('SELECT COUNT(*) FROM contacts LIMIT 1');
  console.log('\nTotal records:', countResult.rows[0].count);
  
  process.exit(0);
}

getColumns().catch(err => {
  console.error(err);
  process.exit(1);
});
