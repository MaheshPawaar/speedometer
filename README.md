# Speedometer

## How to test?
1. Login to psql shell
2. chnage to speedometer_data db.
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
