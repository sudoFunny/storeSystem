# storeSystem
A store system with features like; point of sale system, manager panel, sale logs, and a way to display unfulfilled orders.


# **Prerequisites**
- Make mysql database named "salesData"
- Create mysql user "testUser" with password "password"
- Give new user privileges in new database
	```
	CREATE DATABASE salesData;
	CREATE USER 'testUser'@'localhost' IDENTIFIED BY 'password';
	GRANT ALL PRIVILEGES ON salesData.* TO 'testUser'@'localhost';
	```


# **To Do**
- [ ] Change how we get "orderId":
	- Add new column "completed" to salesData
	- Remove reliance on RecordClass.php by getting orderId from completed field
	- Remove https://github.com/sudoFunny/storeSystem/blob/main/includes/RecordClass.php
