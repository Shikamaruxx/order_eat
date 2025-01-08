const db = require('./db/connection');
// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MySQL.');

    // Create the database
    connection.query('CREATE DATABASE IF NOT EXISTS order_eat', (err) => {
        if (err) {
            console.error('Error creating database:', err);
            return;
        }
        console.log('Database created or already exists.');

        // Use the newly created database
        connection.changeUser({ database: 'order_eat' }, (err) => {
            if (err) {
                console.error('Error switching to database:', err);
                return;
            }
            console.log('Switched to database order_eat.');

            // Create the foodproducts table
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS foodproducts (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    price DECIMAL(10, 2) NOT NULL,
                    description TEXT NOT NULL,
                    category VARCHAR(255) NOT NULL
                );
            `;

            connection.query(createTableQuery, (err) => {
                if (err) {
                    console.error('Error creating table:', err);
                    return;
                }
                console.log('Table foodproducts created or already exists.');

                // Insert the data
                const foodItems = [
                    ['Adobo', 150, 'A savory dish made of pork or chicken (or a mix of both), marinated in vinegar, soy sauce, garlic, bay leaves, and peppercorns, then simmered until tender. It\'s a flavorful and slightly tangy dish, often served with rice.', 'Main Dish'],
                    ['Sinigang na Baboy', 200, 'A sour tamarind-based soup typically made with pork, assorted vegetables (such as kangkong, labanos, sitaw, and eggplant), and sometimes green chili. It\'s the perfect balance of sour and savory.', 'Soup'],
                    ['Lechon Kawali', 180, 'Deep-fried crispy pork belly served with a side of liver sauce or vinegar dipping sauce. The meat is tender inside with a crispy, golden-brown crust.', 'Main Dish'],
                    ['Kare-Kare', 300, 'A Filipino stew made with oxtail, tripe, and sometimes pork hock, cooked in a thick peanut sauce. It\'s typically served with bagoong (fermented shrimp paste) on the side and accompanied by vegetables like banana heart, eggplant, and string beans.', 'Main Dish'],
                    ['Pancit Canton', 120, 'Stir-fried egg noodles with a mix of meat (chicken, pork, shrimp), vegetables, and soy sauce. It\'s a popular dish for celebrations and family gatherings.', 'Noodles'],
                    ['Bistek Tagalog', 200, 'A Filipino version of beef steak made with thinly sliced beef marinated in soy sauce, calamansi (or lemon), and garlic. It\'s cooked with onions and served with a savory, slightly tangy sauce.', 'Main Dish'],
                    ['Laing', 150, 'A Bicolano dish made from dried taro leaves cooked in coconut milk, chili, and shrimp paste. It can be spicy and rich in flavor, often paired with rice.', 'Vegetable'],
                    ['Ginataang Sitaw at Kalabasa', 100, 'A creamy vegetable dish made with string beans and squash, simmered in coconut milk. Sometimes it includes shrimp or pork for added flavor.', 'Vegetable'],
                    ['Pork BBQ (Inihaw na Baboy)', 80, 'Skewered and grilled marinated pork, usually served with a sweet and savory sauce. It\'s a popular street food or barbecue fare in the Philippines.', 'Street Food'],
                    ['Bangus (Milkfish) Sisig', 180, 'A twist on the classic pork sisig, this version uses bangus (milkfish) as the main ingredient, chopped and cooked with onions, chili, and seasoned with soy sauce, vinegar, and calamansi.', 'Main Dish'],
                    // Add the remaining items here following the same format
                ];

                const insertQuery = 'INSERT INTO foodproducts (name, price, description, category) VALUES ?';

                connection.query(insertQuery, [foodItems], (err) => {
                    if (err) {
                        console.error('Error inserting data:', err);
                        return;
                    }
                    console.log('Data inserted successfully.');

                    // Close the connection
                    connection.end((err) => {
                        if (err) {
                            console.error('Error closing the connection:', err);
                            return;
                        }
                        console.log('Connection closed.');
                    });
                });
            });
        });
    });
});
