# Speedometer

## How to run project?
1. Clone the repo.
2. ```cd``` into both folders (frontend and backend) and run ```npm install```.
3. Then in backend ternminal window, run ```npm run start```.
4. In frontend terminal window, run ```npm start```

## How to test?
1. Login to psql shell
   ```
     user: postgres
     password: password
     host: localhost
     port:5432
   ```
      
2. create speedometer_data db.
   ```
    CREATE DATABASE speedometer_db;

    \c speedometer_db

   CREATE TABLE speed_data (
     id SERIAL PRIMARY KEY,
     timestamp TIMESTAMPTZ DEFAULT         CURRENT_TIMESTAMP,
  speed FLOAT
);

```
3. Initialise trigger and notify function:

```
CREATE OR REPLACE FUNCTION notify_speed_change() RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify('speed_channel', row_to_json(NEW)::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER speed_change_trigger
AFTER INSERT ON speed_data
FOR EACH ROW
EXECUTE FUNCTION notify_speed_change();
```
4. Try to insert speed data using followi
ng command:

```INSERT INTO speed_data (speed) VALUES (50);```
