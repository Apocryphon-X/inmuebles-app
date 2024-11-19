rm ./main_data.db
rm ./insert_hashed_mock_data.sql
bash ./generate_mock_data_script.sh
sqlite3 main_data.db ".databases"
sqlite3 main_data.db < create_db.sql
sqlite3 main_data.db < insert_hashed_mock_data.sql
