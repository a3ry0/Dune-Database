-- CITATION FOR THE FOLLOWING SCRIPT:
-- 3/09/25
-- Adapted from MySQL Workbench Forward Engineering

SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;


-- -----------------------------------------------------
-- Table `Customers`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Customers` (
  `customer_id` INT AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `planet` VARCHAR(100) NOT NULL,
  `affiliation` VARCHAR(100) NULL,
  PRIMARY KEY (`customer_id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE,
  UNIQUE INDEX `customer_id_UNIQUE` (`customer_id` ASC) VISIBLE);


-- -----------------------------------------------------
-- Table `Orders`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Orders` (
  `order_id` INT NOT NULL AUTO_INCREMENT,
  `order_date` DATE NOT NULL,
  `total_quantity` INT NOT NULL,
  `order_status` ENUM('Pending', 'Partially Fulfilled', 'Completed') NOT NULL,
  `destination` VARCHAR(100) NOT NULL,
  `customer_id` INT,
  PRIMARY KEY (`order_id`),
  UNIQUE INDEX `order_id_UNIQUE` (`order_id` ASC) VISIBLE,
  INDEX `fk_customer_id_idx` (`customer_id` ASC) VISIBLE,
  CONSTRAINT `fk_customer_id`
    FOREIGN KEY (`customer_id`)
    REFERENCES `Customers` (`customer_id`)
    ON DELETE SET NULL);


-- -----------------------------------------------------
-- Table `Shipments`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Shipments` (
  `shipment_id` INT NOT NULL AUTO_INCREMENT,
  `shipment_date` DATE NOT NULL,
  `carrier` VARCHAR(100) NOT NULL,
  `tracking_number` VARCHAR(100) NOT NULL,
  `shipment_status` ENUM('In Transit', 'Delivered') NOT NULL,
  `quantity` INT NOT NULL,
  `order_id` INT NULL,
  PRIMARY KEY (`shipment_id`),
  UNIQUE INDEX `tracking_number_UNIQUE` (`tracking_number` ASC) VISIBLE,
  UNIQUE INDEX `shipment_id_UNIQUE` (`shipment_id` ASC) VISIBLE,
  INDEX `fk_order_id_idx` (`order_id` ASC) VISIBLE,
  CONSTRAINT `fk_order_id`
    FOREIGN KEY (`order_id`)
    REFERENCES `Orders` (`order_id`)
    ON DELETE CASCADE ON UPDATE CASCADE);


-- -----------------------------------------------------
-- Table `Spice_Silos`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Spice_Silos` (
  `silo_id` INT NOT NULL AUTO_INCREMENT,
  `city` VARCHAR(100) NOT NULL,
  `spice_capacity` DECIMAL(10,2) NOT NULL,
  `spice_quantity` DECIMAL(10,2) NOT NULL,
  `last_inspection_date` DATE NULL,
  PRIMARY KEY (`silo_id`),
  UNIQUE INDEX `silo_id_UNIQUE` (`silo_id` ASC) VISIBLE);


-- -----------------------------------------------------
-- Table `Harvesters`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Harvesters` (
  `harvester_id` INT NOT NULL AUTO_INCREMENT,
  `base_city` VARCHAR(100) NOT NULL,
  `model` VARCHAR(100) NOT NULL,
  `team_captain` VARCHAR(100) NOT NULL,
  `last_maintenance_date` DATE NULL,
  `total_harvested` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`harvester_id`),
  UNIQUE INDEX `harvester_id_UNIQUE` (`harvester_id` ASC) VISIBLE);


-- -----------------------------------------------------
-- Table `Shipments_Spice_Silos`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Shipments_Spice_Silos` (
  `shipment_id` INT NOT NULL,
  `silo_id` INT NOT NULL,
  `shipment_silo_id` INT NOT NULL AUTO_INCREMENT,
  INDEX `fk_siloship_id_idx` (`silo_id` ASC) VISIBLE,
  INDEX `fk_shipment_id_idx` (`shipment_id` ASC) VISIBLE,
  PRIMARY KEY (`shipment_silo_id`),
  UNIQUE INDEX `shipment_silo_id_UNIQUE` (`shipment_silo_id` ASC) VISIBLE,
  CONSTRAINT `fk_shipment_id`
    FOREIGN KEY (`shipment_id`)
    REFERENCES `Shipments` (`shipment_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_siloship_id`
    FOREIGN KEY (`silo_id`)
    REFERENCES `Spice_Silos` (`silo_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `Harvesters_Spice_Silos`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Harvesters_Spice_Silos` (
  `harvester_id` INT NOT NULL,
  `silo_id` INT NOT NULL,
  `harvester_silo_id` INT NOT NULL AUTO_INCREMENT,
  INDEX `fk_siloharvest_id_idx` (`silo_id` ASC) VISIBLE,
  INDEX `fk_harvester_id_idx` (`harvester_id` ASC) VISIBLE,
  PRIMARY KEY (`harvester_silo_id`),
  UNIQUE INDEX `harvester_silo_id_UNIQUE` (`harvester_silo_id` ASC) VISIBLE,
  CONSTRAINT `fk_harvester_id`
    FOREIGN KEY (`harvester_id`)
    REFERENCES `Harvesters` (`harvester_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_siloharvest_id`
    FOREIGN KEY (`silo_id`)
    REFERENCES `Spice_Silos` (`silo_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);



-- -----------------------------------------------------
-- Insert example data into 'Customers'
-- -----------------------------------------------------

INSERT INTO Customers (name, planet, affiliation)
VALUES
('Edric', 'Tupile', 'Spacing Guild'),
('Gaius Helen Mohiam', 'Wallach IX', 'Bene Gesserit'),
('Count Fenring', 'Kaitain', 'House Corrino'),
('Thufir Hawat', 'Caladan', 'House Atreides');

-- -----------------------------------------------------
-- Insert example data into 'Orders'
-- -----------------------------------------------------

INSERT INTO Orders (order_date, total_quantity, order_status, destination, customer_id)
VALUES
('0189-11-02', 276, 'Completed', '1 Via Ludus, Wallach IX', 2),
('0189-11-03', 490, 'Partially Fulfilled', '782 Imperial Blvd, Corrinth City, Kaitain 90742', 3),
('0189-11-05', 394, 'Pending', '2561 Guild Ln, Junction, Tupile 678911', 1);

-- -----------------------------------------------------
-- Insert example data into 'Shipments'
-- -----------------------------------------------------

INSERT INTO Shipments (shipment_date, carrier, tracking_number, shipment_status, quantity, order_id)
VALUES
('0189-11-03', 'HL-9001', 'RH548322428CN', 'Delivered', 200, 2),
('0189-11-03', 'HL-0211', 'RH843108899CN', 'Delivered', 150, 1),
('0189-11-03', 'HL-9001', 'RH259105103CN', 'Delivered', 126, 1),
('0189-11-04', 'HL-5140', 'RH229166660CN', 'In Transit', 150, 2),
('0189-11-05', 'HL-4523', 'RH542160656CN', 'In Transit', 140, 2);

-- -----------------------------------------------------
-- Insert example data into 'Spice_Silos'
-- -----------------------------------------------------

INSERT INTO Spice_Silos (city, spice_capacity, spice_quantity, last_inspection_date)
VALUES
('Arrakeen', 150, 150, '0189-04-01'),
('Carthag', 200, 200, '0189-01-02'),
('Arrakeen', 150, 150, '0189-04-03'),
('Arrakeen', 150, 120, '0189-04-04'),
('Carthag', 200, 185, '0189-07-01');

-- -----------------------------------------------------
-- Insert example data into 'Harvesters'
-- -----------------------------------------------------

INSERT INTO Harvesters (base_city, model, team_captain, last_maintenance_date, total_harvested)
VALUES
('Carthag', 'HV-9236', 'Glossu Rabban', '0189-01-03', 2267),
('Carthag', 'HV-5780', 'Sarnak Varkon', '0189-01-07', 6789),
('Arrakeen', 'HV-1647', 'Tyra Vrax', '0189-04-07', 2346),
('Arrakeen', 'HV-4956', 'Rixan Hord', '0189-04-09', 743),
('Carthag', 'HV-7428', 'Darnak Gress', '0189-01-07', 15678);

-- -----------------------------------------------------
-- Insert example data into 'Harvesters_Spice_Silos'
-- -----------------------------------------------------

INSERT INTO Harvesters_Spice_Silos (harvester_id, silo_id)
VALUES
(1, 2),
(1, 5),
(5, 2),
(3, 4),
(4, 4);

-- -----------------------------------------------------
-- Insert example data into 'Shipments_Spice_Silos'
-- -----------------------------------------------------

INSERT INTO Shipments_Spice_Silos (shipment_id, silo_id)
VALUES
(1, 1),
(1, 3),
(2, 4),
(3, 5),
(4, 5);

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;