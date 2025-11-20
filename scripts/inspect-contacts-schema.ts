import { readOnlyPool } from '../server/db';

async function inspectContactsSchema() {
  try {
    // Get column information
    const columnsResult = await readOnlyPool.query(`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'contacts'
      ORDER BY ordinal_position;
    `);

    console.log('='.repeat(80));
    console.log('CONTACTS TABLE SCHEMA');
    console.log('='.repeat(80));
    console.log('\nTotal columns:', columnsResult.rows.length);
    console.log('\nColumns:');
    console.log('-'.repeat(80));
    
    columnsResult.rows.forEach(col => {
      console.log(`${col.column_name.padEnd(30)} | ${col.data_type.padEnd(20)} | Nullable: ${col.is_nullable}`);
    });

    // Get record count
    const countResult = await readOnlyPool.query('SELECT COUNT(*) as count FROM contacts');
    console.log('\n' + '='.repeat(80));
    console.log('Total records:', countResult.rows[0].count);
    
    // Get sample data for important fields
    console.log('\n' + '='.repeat(80));
    console.log('SAMPLE DATA ANALYSIS');
    console.log('='.repeat(80));

    // Check for common sales intelligence fields
    const fieldsToCheck = [
      'title', 'job_title', 'position', 'role',
      'company', 'company_name', 'organization',
      'industry', 'sector',
      'city', 'state', 'country', 'location',
      'linkedin', 'linkedin_url',
      'email', 'phone', 'mobile',
      'seniority', 'level',
      'company_size', 'employees'
    ];

    for (const field of fieldsToCheck) {
      const checkResult = await readOnlyPool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'contacts' 
          AND column_name ILIKE '%${field}%'
        LIMIT 1
      `);
      
      if (checkResult.rows.length > 0) {
        const columnName = checkResult.rows[0].column_name;
        const sampleResult = await readOnlyPool.query(`
          SELECT DISTINCT "${columnName}" 
          FROM contacts 
          WHERE "${columnName}" IS NOT NULL 
          LIMIT 5
        `);
        
        console.log(`\n${columnName}:`);
        sampleResult.rows.forEach(row => {
          console.log(`  - ${row[columnName]}`);
        });
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Error inspecting schema:', error);
    process.exit(1);
  }
}

inspectContactsSchema();
