// test-db.js
const pool = require('./db');

async function testDBConnection() {
    try {
        // Test basic connection
        const connectionTest = await pool.query('SELECT NOW()');
        console.log('✅ Database connected successfully at:', connectionTest.rows[0].now);

        // Test customers table access (the actual failing query)
        const customerTableTest = await pool.query('SELECT 1 FROM customers LIMIT 1');
        console.log('✅ Successfully queried customers table');

    } catch (err) {
        if (err.code === '42501') { // Permission denied error code
            console.error('❌ Permission denied. Current user lacks privileges on the customers table.');
            console.error('Run these SQL commands as an admin user:');
            console.error(`
                GRANT SELECT ON customers TO ${pool.options.user};
                GRANT INSERT, UPDATE ON customers TO ${pool.options.user};  -- If needed for OTP
            `);
        } else {
            console.error('❌ Error:', err.message);
        }
    } finally {
        await pool.end();
    }
}

testDBConnection();
