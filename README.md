### Sections
- [Story Behind this Project](#story-behind-this-project)
- [Prerequisites](#prerequisites)
- [In Progress](#in-progress)
- [Planned for the Future](#planned-for-the-future)

<br />

# Store System
A store system with features like; point of sale system, manager panel, sale logs, and a way to display unfulfilled orders.

<br />

## Story Behind this Project
I was sitting in a marketing class, and the teacher said something about how technology could make selling products better and keeping track of records easier. That teacher was also the leader of the school's DECA club, so he ran a store in the school to raise money for their club, this store sold all sorts of goodies like slushies, cookies, popcorn, ice coffee and more. The next day he used the school store as an example for something and at that point I thought to myself "I could be of use". The free time of the next few days was spent making a demo of sorts, I showed it to the teacher, and he liked the idea, so I continued the development.

<br />

## Prerequisites
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

<br />

## In Progress
- [x] Get sales data and display as table:
	- Feature found in manager panel

- [x] Change how we get "orderId":
	- Remove reliance on "RecordClass.php" by getting "orderId" from sales data's "completed" field
	- Remove RecordClass.php

- [x] Remove reliance on "orderPools":
	- Make "orderView" use the sales data's "completed" field

- [ ] Allow editing of sales table in the manager panel

<br />

## Planned for the Future
- [ ] Create a general config file:
	- Make a general config file for mysql user information

- [ ] Create user friendly way of making item configs
    - Include a preview mode for what order taker will see and maybe what the sales data will look like (since item config has "save" property for some items)

- [ ] Add specials in some way, Example: Movie Theater Speacial, $2 for soda and popcorn but only on fridays or every other friday or a one time thing.

- [ ] Sales date back up to file

- [ ] Create a way to report shrinkage 
	> shrinkage: product loss due to; spills, theft, product perishment, etc...
	
- [ ] Create an installer of sorts:
	- An installer for this project... probably bash or python
	- Does stuff like:
		- Downloads: php, php-mysqli, mysql, apache
		- Systemctl starts and enables what it needs
		- Sets up: mysql stuff... for now at least
		
		- One day add option for user of installer to choose weather they want the device to act as a Wi-Fi access point and router

