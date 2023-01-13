# storeSystem
A store system with features like; point of sale system, manager panel, sale logs, and a way to display unfulfilled orders.
<br><br>

# **Prerequisites**
### If you would like to play around with this project first you'll need the basic LAMP server and then do the following
- Make mysql database named "salesData"
- Create two tables "itemConfigs" and "orders"
- Create mysql user "testUser" with password "password"
- Give new user privileges in new database
	```
	CREATE DATABASE salesData;
	USE salesData;
	CREATE TABLE `itemConfigs` (
		`version` int NOT NULL AUTO_INCREMENT,
		`dateTime` datetime DEFAULT NULL,
		`config` text,
		PRIMARY KEY (`version`)
	);
	CREATE TABLE `orders` (
		`recordId` int NOT NULL AUTO_INCREMENT,
		`orderId` int DEFAULT NULL,
		`itemConfigVersion` int DEFAULT NULL,
		`dateTime` datetime DEFAULT NULL,
		`completed` tinyint(1) DEFAULT NULL,
		`contents` text,
		PRIMARY KEY (`recordId`)
	);
	CREATE USER 'testUser'@'localhost' IDENTIFIED BY 'password';
	GRANT ALL PRIVILEGES ON salesData.* TO 'testUser'@'localhost';
	```
- You will also need an item config
	- Go to the [Manager Panel](http://localhost/managerPanel/) and upload this [sample item config](https://github.com/sudoFunny/storeSystem/blob/main/.sampleItemConfig.json)... and now you're ready to go to the [order taker page](http://localhost/orderTaker/)
<br>

## In Progress
- [ ] Get sales data and display as table:
	- Feature found in manager panel

- [ ] Change how we get "orderId":
	- Remove reliance on "RecordClass.php" by getting "orderId" from sales data's "completed" field
	- Remove [RecordClass.php](https://github.com/sudoFunny/storeSystem/blob/main/includes/RecordClass.php)

- [ ] Remove reliance on "orderPools":
	- Make "orderView" use the sales data's "completed" field
<br>

## Planned for the Future
- [ ] Create a general config file:
	- Make a general config file for mysql user information

- [ ] Create user friendly way of making item configs

- [ ] Create a way to report shrinkage 
	> shrinkage: product loss due to; spills, theft, product perishment, etc...
	
- [ ] Create an installer of sorts:
	- An installer for this project... probably bash or python
	- Does stuff like:
		- Downloads: php, php-mysqli, mysql, apache
		- Systemctl starts and enables what it needs
		- Sets up: mysql stuff... for now at least
		
		- One day add option for user of installer to choose weather they want the device to act as a Wi-Fi access point and router
