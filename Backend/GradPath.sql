-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: localhost    Database: GradPath
-- ------------------------------------------------------
-- Server version	8.0.44-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Calendar_Event`
--

DROP TABLE IF EXISTS `Calendar_Event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Calendar_Event` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `type` varchar(100) DEFAULT NULL,
  `event_time` datetime DEFAULT NULL,
  `reminder_time` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `reminder_sent` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `Calendar_Event_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Calendar_Event`
--

LOCK TABLES `Calendar_Event` WRITE;
/*!40000 ALTER TABLE `Calendar_Event` DISABLE KEYS */;
INSERT INTO `Calendar_Event` VALUES (2,1,'First Event','This is the description of the first event','test type','2026-10-23 12:00:00','2025-07-22 20:36:27','2025-07-22 20:36:27','2025-12-31 00:15:06',1),(3,1,'Study for Math','Focus on chapters 4 and 5','study session','2025-10-30 07:00:00','2025-07-23 13:30:00','2025-07-22 20:51:03','2025-12-31 00:15:09',1),(5,1,'Study for Networks','Another Description','study session','2025-10-30 07:00:00','2025-07-22 13:30:00','2025-07-22 21:34:42','2025-12-31 00:15:13',1),(7,1,'Assignement Deadline','Another Another Description ','study session','2025-12-30 04:00:00','2025-07-21 08:00:00','2025-07-22 21:53:10','2025-12-31 00:15:16',1),(8,1,'An Event','','event','2026-12-30 10:00:00','2026-01-02 20:05:00','2025-12-30 17:03:47','2025-12-30 17:03:47',0),(15,1,'It Worked!','the website can send reminders now, nigga.','event','2025-12-31 10:00:00','2025-12-30 22:20:00','2025-12-31 00:20:43','2025-12-31 00:29:06',1);
/*!40000 ALTER TABLE `Calendar_Event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Course`
--

DROP TABLE IF EXISTS `Course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Course` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `credits` int DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `final_grade` float DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `semester_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `fk_course_semester` (`semester_id`),
  CONSTRAINT `Course_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_course_semester` FOREIGN KEY (`semester_id`) REFERENCES `Semester` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Course`
--

LOCK TABLES `Course` WRITE;
/*!40000 ALTER TABLE `Course` DISABLE KEYS */;
INSERT INTO `Course` VALUES (3,2,'Operating Systems',4,'Passed',95,'2025-07-01 01:27:04','2025-12-23 18:27:18',2),(4,2,'Networks',3,'Passed',100,'2025-07-01 01:27:04','2025-12-23 18:27:02',2),(10,2,'Introduction to Programming',3,'Passed',89,'2025-07-16 00:52:11','2025-12-23 18:27:31',2),(19,1,'Operating Systems',3,'Passed',100,'2025-07-27 18:56:43','2025-12-23 17:10:17',1),(22,1,'Computer Architecture',3,'Passed',73.6,'2025-07-27 19:00:27','2025-12-23 17:10:17',1),(23,1,'Operating Systems Lab',1,'Failed',51.9,'2025-07-27 19:00:53','2025-12-23 17:10:17',1),(24,2,'Operating Systems Lab',1,'Passed',89,'2025-07-27 19:04:19','2025-12-23 18:26:46',2),(25,2,'Introduction to Programming Lab',1,'Passed',65,'2025-07-27 19:04:53','2025-12-23 17:49:55',2),(26,1,'Artificial Intelligence',3,'Passed',83.5,'2025-07-27 19:10:00','2025-12-23 17:15:05',1),(82,1,'Math101',3,'Passed',82.2,'2025-09-28 00:15:52','2025-12-23 17:10:17',1);
/*!40000 ALTER TABLE `Course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GPA`
--

DROP TABLE IF EXISTS `GPA`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `GPA` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `cumulative_gpa` float DEFAULT NULL,
  `completed_credits` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `GPA_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GPA`
--

LOCK TABLES `GPA` WRITE;
/*!40000 ALTER TABLE `GPA` DISABLE KEYS */;
INSERT INTO `GPA` VALUES (1,1,3.4,36),(2,2,3.58,63),(5,6,0,0),(12,13,2.78,70);
/*!40000 ALTER TABLE `GPA` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Grade_Item`
--

DROP TABLE IF EXISTS `Grade_Item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Grade_Item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_id` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `score` float DEFAULT NULL,
  `weight` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `Grade_Item_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `Course` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=244 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Grade_Item`
--

LOCK TABLES `Grade_Item` WRITE;
/*!40000 ALTER TABLE `Grade_Item` DISABLE KEYS */;
INSERT INTO `Grade_Item` VALUES (172,23,'project','Project',70,15),(173,23,'midterm','Assignment',44,35),(174,23,'final','Exam',52,50),(192,19,'Project1','Project',100,15),(193,19,'Test','Exam',100,20),(194,19,'Midterm','Exam',100,30),(195,19,'Final','Exam',100,35),(220,22,'Midterm','Exam',40,40),(221,22,'Final','Exam',99,40),(222,22,'test','Exam',90,20),(226,82,'test','Exam',99,30),(227,82,'midterm','Exam',55,35),(228,82,'final','Exam',95,35),(232,26,'something','Exam',100,40),(233,26,'something else','Exam',95,30),(234,26,'else something else','Exam',50,30),(235,24,'final','Exam',89,100),(236,4,'final','Exam',100,100),(237,3,'final','Exam',95,100),(238,10,'so close','Assignment',89,100);
/*!40000 ALTER TABLE `Grade_Item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Note_Tag`
--

DROP TABLE IF EXISTS `Note_Tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Note_Tag` (
  `note_id` int NOT NULL,
  `tag_id` int NOT NULL,
  PRIMARY KEY (`note_id`,`tag_id`),
  KEY `tag_id` (`tag_id`),
  CONSTRAINT `Note_Tag_ibfk_1` FOREIGN KEY (`note_id`) REFERENCES `Notes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `Note_Tag_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `Tag` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Note_Tag`
--

LOCK TABLES `Note_Tag` WRITE;
/*!40000 ALTER TABLE `Note_Tag` DISABLE KEYS */;
INSERT INTO `Note_Tag` VALUES (7,1),(7,2),(16,2),(5,3),(7,3),(3,4),(5,5),(16,5),(7,8);
/*!40000 ALTER TABLE `Note_Tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Notes`
--

DROP TABLE IF EXISTS `Notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Notes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` text,
  `subject` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `Notes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Notes`
--

LOCK TABLES `Notes` WRITE;
/*!40000 ALTER TABLE `Notes` DISABLE KEYS */;
INSERT INTO `Notes` VALUES (3,2,'I hate my life','List of the things i would like to do before killing myself','life','2025-07-17 00:54:13','2025-12-26 01:55:44'),(4,1,'React Hooks','useState and useEffect are fundamental hooks for managing state and side effects in functional components.','Programming','2024-12-15 10:00:00','2024-12-24 15:30:00'),(5,1,'Physics Notes','Newton\'s laws of motion: \n1) An object at rest stays at rest. \n2) F=ma. \n3) Every action has an equal and opposite reaction.','Physics','2024-12-20 09:00:00','2025-12-27 22:40:30'),(6,1,'History Essay','The Renaissance was a period of cultural rebirth in Europe, spanning from the 14th to 17th century.','History','2024-12-10 11:00:00','2024-12-22 16:45:00'),(7,1,'Math Formulas','Quadratic formula: x = (-b ± √(b²-4ac)) / 2a. Pythagorean theorem: a² + b² = c². edited by mohamed mousa.\nsomething on a new line.','Mathematics','2024-12-18 13:00:00','2025-12-27 22:40:06'),(8,1,'Biology Exam Prep','Cell structure: Nucleus contains DNA, mitochondria produce ATP, ribosomes synthesize proteins.','Biology','2024-12-12 14:00:00','2024-12-21 12:30:00'),(9,1,'JavaScript Tips','Arrow functions, destructuring, spread operator, and template literals are modern JS features.','Programming','2024-12-16 16:00:00','2024-12-24 09:00:00'),(16,1,'Another Test','K = FC^2','Physics','2025-12-27 22:39:55','2025-12-27 22:39:55');
/*!40000 ALTER TABLE `Notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Semester`
--

DROP TABLE IF EXISTS `Semester`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Semester` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('active','ended') DEFAULT 'active',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `semester_gpa` decimal(3,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_semester` (`user_id`,`name`),
  CONSTRAINT `Semester_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Semester`
--

LOCK TABLES `Semester` WRITE;
/*!40000 ALTER TABLE `Semester` DISABLE KEYS */;
INSERT INTO `Semester` VALUES (1,1,'Fall 2025','2025-12-23',NULL,'active','2025-12-23 17:09:18','2025-12-23 17:09:18',NULL),(2,2,'Fall 2025','2025-12-23',NULL,'active','2025-12-23 17:48:49','2025-12-24 14:29:01',NULL);
/*!40000 ALTER TABLE `Semester` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Session`
--

DROP TABLE IF EXISTS `Session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Session` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `jwt_token` text,
  `expires_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `Session_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=354 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Session`
--

LOCK TABLES `Session` WRITE;
/*!40000 ALTER TABLE `Session` DISABLE KEYS */;
INSERT INTO `Session` VALUES (149,6,'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjYsInVzZXJuYW1lIjoidGVzdDIiLCJpYXQiOjE3NTE5MjIxNDcsImV4cCI6MTc1MjAwODU0N30.V_SfZS040bl53HNTuH7OLpSiuG2D2YClIAbgSqAM0n0','2025-07-09 00:02:27','2025-07-08 00:02:27'),(347,13,'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEzLCJ1c2VybmFtZSI6Im9tZyIsImlhdCI6MTc2NzEwMTk4NCwiZXhwIjoxNzY3MTA1NTg0fQ.gAhbqgST2yn7MOSdEIRN5hQQOl5XOcpnm2K6naRQ8do','2025-12-30 16:39:44','2025-12-30 15:39:44'),(353,1,'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoidGVzdCIsImlhdCI6MTc2NzEzMzAzNSwiZXhwIjoxNzY3MTM2NjM1fQ.F50Z0PE3SP_Ujrg9M9hhMII5XrciafY1-ra0EZTWypk','2025-12-31 01:17:15','2025-12-31 00:17:15');
/*!40000 ALTER TABLE `Session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tag`
--

DROP TABLE IF EXISTS `Tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tag` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tag`
--

LOCK TABLES `Tag` WRITE;
/*!40000 ALTER TABLE `Tag` DISABLE KEYS */;
INSERT INTO `Tag` VALUES (6,'equation'),(3,'equations'),(1,'hello'),(4,'killme'),(7,'law'),(5,'physics'),(2,'something'),(8,'test');
/*!40000 ALTER TABLE `Tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `profile_pic` varchar(255) DEFAULT NULL,
  `university` varchar(255) DEFAULT NULL,
  `major` varchar(255) DEFAULT NULL,
  `total_credits` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'test','$2y$10$8SZjRNyDqH4bZaaTIMY2Zev5H6VfyGyPU2CRqxy/l8lAmuqCCXJ5e','hisham000x@gmail.com','http://localhost:8000/api/public/uploads/profile_6949920aa70411.45563309.jpg','Lebanese International University','Computer Science',99,'2025-06-02 05:40:42','2025-12-31 00:21:22'),(2,'admin','$2y$12$jfqN77Yl/npl44Gl06JcpOQ0O20zuUgrk1/rsRFUZEj2TJfkYVOoi','admin@gmail.com','http://localhost:8000/api/public/uploads/profile_694ab8e800b311.11582208.jpg','LIU','Computer Science',100,'2025-06-02 06:19:53','2025-12-23 18:10:11'),(6,'test2','$2y$12$HIjRE/t9hlLMBOrKZwJ6E.mn4mFMAGDHiBtPFR/qaWJm/1kmvr88q','test2@gmail.com',NULL,'Lebanese International University','Computer Science',0,'2025-07-08 00:02:27','2025-12-15 19:20:20'),(13,'omg','$2y$12$Y.HUyrduqcc9SviJyR42T.S1dNK1fLkrNFTmL9DnMa.BMWiONeyG6','pleasehelp@gmail.com',NULL,'liu','cs',100,'2025-12-30 15:39:44','2025-12-30 15:39:44');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-31  0:32:42
