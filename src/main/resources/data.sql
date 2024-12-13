CREATE DATABASE  IF NOT EXISTS `matrix2` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `matrix2`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: matrix2
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `agency`
--

DROP TABLE IF EXISTS `agency`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agency` (
  `create_time` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `last_update_time` datetime(6) DEFAULT NULL,
  `last_updated_by` bigint DEFAULT NULL,
  `acronym` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKpxs3ufm27ekx0x60dohhyxusf` (`acronym`),
  UNIQUE KEY `UK6m6c3mscbn3eohv8sslxlp12c` (`name`),
  KEY `FKcg5nqt66wp78gnhrvyj650rou` (`created_by`),
  KEY `FKocl5d10jqagot4ipi5sqdx440` (`last_updated_by`),
  CONSTRAINT `FKcg5nqt66wp78gnhrvyj650rou` FOREIGN KEY (`created_by`) REFERENCES `matrix_user` (`id`),
  CONSTRAINT `FKocl5d10jqagot4ipi5sqdx440` FOREIGN KEY (`last_updated_by`) REFERENCES `matrix_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agency`
--

LOCK TABLES `agency` WRITE;
/*!40000 ALTER TABLE `agency` DISABLE KEYS */;
INSERT INTO `agency` VALUES ('2024-12-02 21:20:13.029000',1,1,'2024-12-02 21:20:13.029000',NULL,'FBI','Federal Bureau of Investigation'),('2024-12-02 21:20:13.029000',1,2,'2024-12-02 21:20:13.029000',NULL,'APD','Anchorage Police Department'),('2024-12-02 21:20:13.029000',1,3,'2024-12-02 21:20:13.029000',NULL,'AST','Alaska State Troopers'),('2024-12-02 21:20:13.029000',1,4,'2024-12-02 21:20:13.029000',NULL,'WPD','Wasilla Police Department'),('2024-12-02 21:20:13.029000',1,5,'2024-12-02 21:20:13.029000',NULL,'FPD','Fairbanks Police Department'),('2024-12-02 21:20:13.029000',1,6,'2024-12-02 21:20:13.029000',NULL,'BPD','Bethen Police Department'),('2024-12-02 21:20:13.029000',1,7,'2024-12-02 21:20:13.029000',NULL,'KPD','Kenai Police Department'),('2024-12-02 21:20:13.029000',1,8,'2024-12-02 21:20:13.029000',NULL,'WPC','Whittier Police Department'),('2024-12-02 21:20:13.029000',1,9,'2024-12-02 21:20:13.029000',NULL,'PPD','Palmer Police Department'),('2024-12-02 21:20:13.029000',1,10,'2024-12-02 21:20:13.029000',NULL,'HPD','Homer Police Department');
/*!40000 ALTER TABLE `agency` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `case_entity`
--

DROP TABLE IF EXISTS `case_entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `case_entity` (
  `create_time` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `last_update_time` datetime(6) DEFAULT NULL,
  `last_updated_by` bigint DEFAULT NULL,
  `matrix_case_id` bigint DEFAULT NULL,
  `matrix_entity_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKc5fi3ucn8d4vgg655y4c7s6jc` (`created_by`),
  KEY `FKh38w3l45t4x3h70pthmqg6hig` (`last_updated_by`),
  KEY `FKr9g62wt400sgevo8mljhph6yf` (`matrix_case_id`),
  KEY `FKncdm2uyoyevlnlvivfiyt4gb0` (`matrix_entity_id`),
  CONSTRAINT `FKc5fi3ucn8d4vgg655y4c7s6jc` FOREIGN KEY (`created_by`) REFERENCES `matrix_user` (`id`),
  CONSTRAINT `FKh38w3l45t4x3h70pthmqg6hig` FOREIGN KEY (`last_updated_by`) REFERENCES `matrix_user` (`id`),
  CONSTRAINT `FKncdm2uyoyevlnlvivfiyt4gb0` FOREIGN KEY (`matrix_entity_id`) REFERENCES `matrix_entity` (`id`),
  CONSTRAINT `FKr9g62wt400sgevo8mljhph6yf` FOREIGN KEY (`matrix_case_id`) REFERENCES `matrix_case` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `case_entity`
--

LOCK TABLES `case_entity` WRITE;
/*!40000 ALTER TABLE `case_entity` DISABLE KEYS */;
/*!40000 ALTER TABLE `case_entity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entity_definition`
--

DROP TABLE IF EXISTS `entity_definition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entity_definition` (
  `editable` bit(1) NOT NULL,
  `include_in_link_chart` bit(1) DEFAULT NULL,
  `create_time` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `last_update_time` datetime(6) DEFAULT NULL,
  `last_updated_by` bigint DEFAULT NULL,
  `version` bigint NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKs0rxdkigtch2r0xbaildxmfwo` (`created_by`),
  KEY `FK5pog0jcwwmh6des0xfbl3bom0` (`last_updated_by`),
  CONSTRAINT `FK5pog0jcwwmh6des0xfbl3bom0` FOREIGN KEY (`last_updated_by`) REFERENCES `matrix_user` (`id`),
  CONSTRAINT `FKs0rxdkigtch2r0xbaildxmfwo` FOREIGN KEY (`created_by`) REFERENCES `matrix_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entity_definition`
--

LOCK TABLES `entity_definition` WRITE;
/*!40000 ALTER TABLE `entity_definition` DISABLE KEYS */;
INSERT INTO `entity_definition` VALUES (_binary '',_binary '','2024-12-02 21:22:02.958000',1,1,'2024-12-02 21:22:02.958000',NULL,1,NULL,'Person'),(_binary '',_binary '\0','2024-12-02 21:22:55.347000',1,2,'2024-12-02 21:22:55.347000',NULL,1,NULL,'Event');
/*!40000 ALTER TABLE `entity_definition` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entity_file`
--

DROP TABLE IF EXISTS `entity_file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entity_file` (
  `create_time` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `last_update_time` datetime(6) DEFAULT NULL,
  `last_updated_by` bigint DEFAULT NULL,
  `m_file_id` bigint DEFAULT NULL,
  `matrix_entity_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK9obaqavg3yegkxx8yxjqmbuvw` (`created_by`),
  KEY `FKsml72tma2nr42ws4kjgwpnbs9` (`last_updated_by`),
  KEY `FK3jg2qw6mcalwpve7nup0tgj5h` (`m_file_id`),
  KEY `FKhkwyahpcl4jdq74044g7h5n3l` (`matrix_entity_id`),
  CONSTRAINT `FK3jg2qw6mcalwpve7nup0tgj5h` FOREIGN KEY (`m_file_id`) REFERENCES `mfile` (`id`),
  CONSTRAINT `FK9obaqavg3yegkxx8yxjqmbuvw` FOREIGN KEY (`created_by`) REFERENCES `matrix_user` (`id`),
  CONSTRAINT `FKhkwyahpcl4jdq74044g7h5n3l` FOREIGN KEY (`matrix_entity_id`) REFERENCES `matrix_entity` (`id`),
  CONSTRAINT `FKsml72tma2nr42ws4kjgwpnbs9` FOREIGN KEY (`last_updated_by`) REFERENCES `matrix_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entity_file`
--

LOCK TABLES `entity_file` WRITE;
/*!40000 ALTER TABLE `entity_file` DISABLE KEYS */;
INSERT INTO `entity_file` VALUES ('2024-12-02 21:27:03.097000',1,1,'2024-12-02 21:27:03.097000',NULL,3,2),('2024-12-02 21:27:03.135000',1,2,'2024-12-02 21:27:03.135000',NULL,4,2);
/*!40000 ALTER TABLE `entity_file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entity_relationship`
--

DROP TABLE IF EXISTS `entity_relationship`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entity_relationship` (
  `child_id` bigint DEFAULT NULL,
  `create_time` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `last_update_time` datetime(6) DEFAULT NULL,
  `last_updated_by` bigint DEFAULT NULL,
  `parent_id` bigint DEFAULT NULL,
  `relationship_description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK2ytti7u2e0ujnr1bvau2eeb2q` (`created_by`),
  KEY `FKm91fcde7n7ujl6nlvyvq7drcl` (`last_updated_by`),
  KEY `FKjd74ftgjunvchhi8758run7rk` (`child_id`),
  KEY `FKh93jolrs688x8qrs9yofvqvxc` (`parent_id`),
  CONSTRAINT `FK2ytti7u2e0ujnr1bvau2eeb2q` FOREIGN KEY (`created_by`) REFERENCES `matrix_user` (`id`),
  CONSTRAINT `FKh93jolrs688x8qrs9yofvqvxc` FOREIGN KEY (`parent_id`) REFERENCES `matrix_entity` (`id`),
  CONSTRAINT `FKjd74ftgjunvchhi8758run7rk` FOREIGN KEY (`child_id`) REFERENCES `matrix_entity` (`id`),
  CONSTRAINT `FKm91fcde7n7ujl6nlvyvq7drcl` FOREIGN KEY (`last_updated_by`) REFERENCES `matrix_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entity_relationship`
--

LOCK TABLES `entity_relationship` WRITE;
/*!40000 ALTER TABLE `entity_relationship` DISABLE KEYS */;
INSERT INTO `entity_relationship` VALUES (2,'2024-12-02 21:26:14.204000',1,1,'2024-12-02 21:26:14.204000',NULL,1,'person to event'),(1,'2024-12-02 21:26:14.213000',1,2,'2024-12-02 21:26:14.213000',NULL,2,'event to person');
/*!40000 ALTER TABLE `entity_relationship` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `link_chart`
--

DROP TABLE IF EXISTS `link_chart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `link_chart` (
  `zoom` float DEFAULT NULL,
  `create_time` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `last_update_time` datetime(6) DEFAULT NULL,
  `last_updated_by` bigint DEFAULT NULL,
  `matrix_case_id` bigint NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `entities` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `pan` varchar(255) DEFAULT NULL,
  `style_sheet` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK8vv4rb89rkfgxu2b3jss96g32` (`created_by`),
  KEY `FKj01fgmw931e8pdn0qhi798s4g` (`last_updated_by`),
  KEY `FKpfsp6v9oaa82jpukddkbccqml` (`matrix_case_id`),
  CONSTRAINT `FK8vv4rb89rkfgxu2b3jss96g32` FOREIGN KEY (`created_by`) REFERENCES `matrix_user` (`id`),
  CONSTRAINT `FKj01fgmw931e8pdn0qhi798s4g` FOREIGN KEY (`last_updated_by`) REFERENCES `matrix_user` (`id`),
  CONSTRAINT `FKpfsp6v9oaa82jpukddkbccqml` FOREIGN KEY (`matrix_case_id`) REFERENCES `matrix_case` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `link_chart`
--

LOCK TABLES `link_chart` WRITE;
/*!40000 ALTER TABLE `link_chart` DISABLE KEYS */;
INSERT INTO `link_chart` VALUES (NULL,'2024-12-03 20:31:11.691000',1,1,'2024-12-03 20:31:11.691000',NULL,1,NULL,NULL,'Main',NULL,NULL),(NULL,'2024-12-03 20:31:13.772000',1,2,'2024-12-03 20:31:13.772000',NULL,1,NULL,NULL,'Main',NULL,NULL);
/*!40000 ALTER TABLE `link_chart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `matrix_case`
--

DROP TABLE IF EXISTS `matrix_case`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `matrix_case` (
  `create_time` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `last_update_time` datetime(6) DEFAULT NULL,
  `last_updated_by` bigint DEFAULT NULL,
  `case_description` varchar(255) DEFAULT NULL,
  `case_number` varchar(255) DEFAULT NULL,
  `case_title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKf7rl0hgvcqro90u71f3ogdeef` (`created_by`),
  KEY `FKjysis4d2rk20swrx2qu10jlvd` (`last_updated_by`),
  CONSTRAINT `FKf7rl0hgvcqro90u71f3ogdeef` FOREIGN KEY (`created_by`) REFERENCES `matrix_user` (`id`),
  CONSTRAINT `FKjysis4d2rk20swrx2qu10jlvd` FOREIGN KEY (`last_updated_by`) REFERENCES `matrix_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `matrix_case`
--

LOCK TABLES `matrix_case` WRITE;
/*!40000 ALTER TABLE `matrix_case` DISABLE KEYS */;
INSERT INTO `matrix_case` VALUES ('2024-12-02 21:23:51.742000',1,1,'2024-12-03 20:32:39.579000',1,'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab','24-000001','Case 1 Description Line 1\nCase 1 Description Line 2\nCase 1 Description Line 3');
/*!40000 ALTER TABLE `matrix_case` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `matrix_entity`
--

DROP TABLE IF EXISTS `matrix_entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `matrix_entity` (
  `create_time` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `entity_definition_id` bigint DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `last_update_time` datetime(6) DEFAULT NULL,
  `last_updated_by` bigint DEFAULT NULL,
  `matrix_case_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKir40h4rw7cndrbl52u5qbv3oe` (`created_by`),
  KEY `FKgve3iiagixs7b7kbhsqypldc9` (`last_updated_by`),
  KEY `FKo5x1lnmilkjc3u1sb1c13dwbb` (`entity_definition_id`),
  KEY `FKjw1fx15d2xnt77gx31q1yvrkh` (`matrix_case_id`),
  CONSTRAINT `FKgve3iiagixs7b7kbhsqypldc9` FOREIGN KEY (`last_updated_by`) REFERENCES `matrix_user` (`id`),
  CONSTRAINT `FKir40h4rw7cndrbl52u5qbv3oe` FOREIGN KEY (`created_by`) REFERENCES `matrix_user` (`id`),
  CONSTRAINT `FKjw1fx15d2xnt77gx31q1yvrkh` FOREIGN KEY (`matrix_case_id`) REFERENCES `matrix_case` (`id`),
  CONSTRAINT `FKo5x1lnmilkjc3u1sb1c13dwbb` FOREIGN KEY (`entity_definition_id`) REFERENCES `entity_definition` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `matrix_entity`
--

LOCK TABLES `matrix_entity` WRITE;
/*!40000 ALTER TABLE `matrix_entity` DISABLE KEYS */;
INSERT INTO `matrix_entity` VALUES ('2024-12-02 21:24:28.994000',1,1,1,'2024-12-03 20:31:34.722000',1,1),('2024-12-02 21:25:03.853000',1,2,2,'2024-12-02 21:25:03.853000',NULL,1);
/*!40000 ALTER TABLE `matrix_entity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `matrix_user`
--

DROP TABLE IF EXISTS `matrix_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `matrix_user` (
  `admin` bit(1) NOT NULL,
  `dark_theme` bit(1) NOT NULL,
  `enabled` bit(1) NOT NULL,
  `agency_id` bigint DEFAULT NULL,
  `create_time` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `last_update_time` datetime(6) DEFAULT NULL,
  `last_updated_by` bigint DEFAULT NULL,
  `profile_image_id` bigint DEFAULT NULL,
  `cell_number` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `work_number` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKdfg67emqaxd73p1biydxhl8tm` (`profile_image_id`),
  UNIQUE KEY `UKti72f7s3gm27dhsn8d23y16sf` (`username`),
  KEY `FKpdmmhi661ir3vx84byam2bhbo` (`created_by`),
  KEY `FKrow1wlo11fnq4chwxn8co38gn` (`last_updated_by`),
  KEY `FKo0662ygpi91rrcliko935qyeb` (`agency_id`),
  CONSTRAINT `FKgb6r4p62k1tcx301cccqf50cj` FOREIGN KEY (`profile_image_id`) REFERENCES `mfile` (`id`),
  CONSTRAINT `FKo0662ygpi91rrcliko935qyeb` FOREIGN KEY (`agency_id`) REFERENCES `agency` (`id`),
  CONSTRAINT `FKpdmmhi661ir3vx84byam2bhbo` FOREIGN KEY (`created_by`) REFERENCES `matrix_user` (`id`),
  CONSTRAINT `FKrow1wlo11fnq4chwxn8co38gn` FOREIGN KEY (`last_updated_by`) REFERENCES `matrix_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `matrix_user`
--

LOCK TABLES `matrix_user` WRITE;
/*!40000 ALTER TABLE `matrix_user` DISABLE KEYS */;
INSERT INTO `matrix_user` VALUES (_binary '',_binary '\0',_binary '',1,NULL,NULL,1,'2024-12-03 20:30:54.712000',1,18,'2342342342','admin@fbi.gov','first','last','$2a$10$C.f97.fw918rEaIfGymG0OImBM2LWHJozslh8eUei5ppbTZ3Bj6Ma','admin','3455673456'),(_binary '',_binary '',_binary '',1,NULL,NULL,2,'2024-12-03 20:20:55.702000',1,12,'(111) 111-1111','dalliso2@gmail.com','Lois','Griffin','$2a$10$Rc7m0ok9ryhxhQO.vpZPAuLYWABnVlN38IIWzaSoEZimUyYFp8FdS','lgriffin','(333) 333-3333'),(_binary '',_binary '',_binary '',1,NULL,NULL,3,'2024-12-03 20:21:34.438000',1,15,'(222) 222-2222','dalliso2@gmail.com','Stewie','Griffin','$2a$10$Rc7m0ok9ryhxhQO.vpZPAuLYWABnVlN38IIWzaSoEZimUyYFp8FdS','sgriffin','(333) 333-3333'),(_binary '',_binary '',_binary '',1,NULL,NULL,4,'2024-12-03 20:19:36.958000',1,7,'(333) 333-3333','dalliso2@gmail.com','Brian','Griffin','$2a$10$Rc7m0ok9ryhxhQO.vpZPAuLYWABnVlN38IIWzaSoEZimUyYFp8FdS','bgriffin','(333) 333-3333'),(_binary '',_binary '',_binary '',2,NULL,NULL,5,'2024-12-03 20:21:23.167000',1,14,'(444) 444-4444','dalliso2@gmail.com','Peter','Griffin','$2a$10$Rc7m0ok9ryhxhQO.vpZPAuLYWABnVlN38IIWzaSoEZimUyYFp8FdS','pgriffin','(333) 333-3333'),(_binary '',_binary '',_binary '',2,NULL,NULL,6,'2024-12-03 20:21:06.374000',1,13,'(555) 555-5555','dalliso2@gmail.com','Meg','Griffin','$2a$10$Rc7m0ok9ryhxhQO.vpZPAuLYWABnVlN38IIWzaSoEZimUyYFp8FdS','mgriffin','(333) 333-3333'),(_binary '',_binary '',_binary '',2,NULL,NULL,7,'2024-12-03 20:20:11.383000',1,11,'(666) 666-6666','dalliso2@gmail.com','Cartman','Unknown','$2a$10$Rc7m0ok9ryhxhQO.vpZPAuLYWABnVlN38IIWzaSoEZimUyYFp8FdS','cartman','(333) 333-3333'),(_binary '',_binary '',_binary '',3,NULL,NULL,8,'2024-12-03 20:22:08.606000',1,17,'(777) 777-7777','dalliso2@gmail.com','Snoopy','Unknown','$2a$10$Rc7m0ok9ryhxhQO.vpZPAuLYWABnVlN38IIWzaSoEZimUyYFp8FdS','snoopy','(333) 333-3333'),(_binary '',_binary '',_binary '',3,NULL,NULL,9,'2024-12-03 20:19:47.617000',1,8,'(888) 888-8888','dalliso2@gmail.com','Bart','Simpson','$2a$10$Rc7m0ok9ryhxhQO.vpZPAuLYWABnVlN38IIWzaSoEZimUyYFp8FdS','bsimpson','(333) 333-3333'),(_binary '',_binary '',_binary '',3,NULL,NULL,10,'2024-12-03 20:19:56.100000',1,9,'(999) 999-9999','dalliso2@gmail.com','Patrick','Star','$2a$10$Rc7m0ok9ryhxhQO.vpZPAuLYWABnVlN38IIWzaSoEZimUyYFp8FdS','pstar','(333) 333-3333'),(_binary '',_binary '',_binary '',4,NULL,NULL,11,'2024-12-03 20:20:03.624000',1,10,'(555) 555-5555','dalliso2@gmail.com','Dora','The Explorer','$2a$10$Rc7m0ok9ryhxhQO.vpZPAuLYWABnVlN38IIWzaSoEZimUyYFp8FdS','doratheexplorer','(333) 333-3333'),(_binary '',_binary '',_binary '',4,NULL,NULL,12,'2024-12-03 20:21:42.754000',1,16,'(555) 555-5555','dalliso2@gmail.com','Bob','Sponge','$2a$10$Rc7m0ok9ryhxhQO.vpZPAuLYWABnVlN38IIWzaSoEZimUyYFp8FdS','spongebob','(333) 333-3333'),(_binary '',_binary '',_binary '',4,NULL,NULL,13,'2024-12-03 20:18:48.849000',1,6,'(555) 555-5555','dalliso2@gmail.com','Garfield','Cat','$2a$10$Rc7m0ok9ryhxhQO.vpZPAuLYWABnVlN38IIWzaSoEZimUyYFp8FdS','garfield','(333) 333-3333');
/*!40000 ALTER TABLE `matrix_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mfile`
--

DROP TABLE IF EXISTS `mfile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mfile` (
  `create_time` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `last_update_time` datetime(6) DEFAULT NULL,
  `last_updated_by` bigint DEFAULT NULL,
  `matrix_case_id` bigint DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `original_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKpeaqr3phrx4y9xlysqvoyavbs` (`created_by`),
  KEY `FKgbx8vgeybkgyjhcei9uj9oqbw` (`last_updated_by`),
  KEY `FK55r2469jd4y2f81y01i81l4f0` (`matrix_case_id`),
  CONSTRAINT `FK55r2469jd4y2f81y01i81l4f0` FOREIGN KEY (`matrix_case_id`) REFERENCES `matrix_case` (`id`),
  CONSTRAINT `FKgbx8vgeybkgyjhcei9uj9oqbw` FOREIGN KEY (`last_updated_by`) REFERENCES `matrix_user` (`id`),
  CONSTRAINT `FKpeaqr3phrx4y9xlysqvoyavbs` FOREIGN KEY (`created_by`) REFERENCES `matrix_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mfile`
--

LOCK TABLES `mfile` WRITE;
/*!40000 ALTER TABLE `mfile` DISABLE KEYS */;
INSERT INTO `mfile` VALUES ('2024-12-02 21:20:45.994000',1,1,'2024-12-02 21:20:45.994000',NULL,NULL,NULL,NULL,'meg.jpg'),('2024-12-02 21:24:27.560000',1,2,'2024-12-02 21:24:27.560000',NULL,1,NULL,NULL,'stewey.jpg'),('2024-12-02 21:26:41.394000',1,3,'2024-12-02 21:27:03.087000',1,1,'Schedule description','Schedule','Fall 2023 Schedule.pdf'),('2024-12-02 21:26:41.395000',1,4,'2024-12-02 21:27:03.101000',1,1,'transcript description','transcript','Daryl_Allison_ASU_transcript.pdf'),('2024-12-02 21:46:31.643000',1,5,'2024-12-02 21:46:31.643000',NULL,NULL,NULL,NULL,'lois_20_19.jpg'),('2024-12-03 20:18:47.147000',1,6,'2024-12-03 20:18:47.147000',NULL,NULL,NULL,NULL,'garfield.jpg'),('2024-12-03 20:19:35.489000',1,7,'2024-12-03 20:19:35.489000',NULL,NULL,NULL,NULL,'3q5ole7ggyoc1.jpeg'),('2024-12-03 20:19:46.127000',1,8,'2024-12-03 20:19:46.127000',NULL,NULL,NULL,NULL,'bart.png'),('2024-12-03 20:19:54.635000',1,9,'2024-12-03 20:19:54.635000',NULL,NULL,NULL,NULL,'patrick.jpg'),('2024-12-03 20:20:01.999000',1,10,'2024-12-03 20:20:01.999000',NULL,NULL,NULL,NULL,'dora.png'),('2024-12-03 20:20:09.856000',1,11,'2024-12-03 20:20:09.856000',NULL,NULL,NULL,NULL,'cartman.png'),('2024-12-03 20:20:54.201000',1,12,'2024-12-03 20:20:54.201000',NULL,NULL,NULL,NULL,'lois.jpg'),('2024-12-03 20:21:05.136000',1,13,'2024-12-03 20:21:05.136000',NULL,NULL,NULL,NULL,'meg.jpg'),('2024-12-03 20:21:21.517000',1,14,'2024-12-03 20:21:21.517000',NULL,NULL,NULL,NULL,'FamilyGuy_Single_PeterDrink_R7.webp'),('2024-12-03 20:21:32.803000',1,15,'2024-12-03 20:21:32.803000',NULL,NULL,NULL,NULL,'stewey.jpg'),('2024-12-03 20:21:41.008000',1,16,'2024-12-03 20:21:41.008000',NULL,NULL,NULL,NULL,'spongebob.jpg'),('2024-12-03 20:22:07.000000',1,17,'2024-12-03 20:22:07.000000',NULL,NULL,NULL,NULL,'snoopie.jpg'),('2024-12-03 20:23:04.112000',1,18,'2024-12-03 20:23:04.112000',NULL,NULL,NULL,NULL,'20240705_121157.jpg'),('2024-12-03 20:31:32.987000',1,19,'2024-12-03 20:31:32.987000',NULL,1,NULL,NULL,'20240705_121157.jpg');
/*!40000 ALTER TABLE `mfile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `property_definition`
--

DROP TABLE IF EXISTS `property_definition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property_definition` (
  `deleted` bit(1) NOT NULL,
  `include_in_list` bit(1) NOT NULL,
  `include_in_timeline` bit(1) NOT NULL,
  `include_in_title` bit(1) NOT NULL,
  `max_length` int DEFAULT NULL,
  `num_lines` int DEFAULT NULL,
  `prop_order` int NOT NULL,
  `required` bit(1) NOT NULL,
  `type` tinyint NOT NULL,
  `create_time` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `entity_definition_id` bigint DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `last_update_time` datetime(6) DEFAULT NULL,
  `last_updated_by` bigint DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `mask` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `options` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKay7y8qai8kqvdqb3b1wfxl4j` (`created_by`),
  KEY `FKo3lm4f58evjt4629l85fh28s6` (`last_updated_by`),
  KEY `FKow41y4hnwlcln8ystmhkifp3o` (`entity_definition_id`),
  CONSTRAINT `FKay7y8qai8kqvdqb3b1wfxl4j` FOREIGN KEY (`created_by`) REFERENCES `matrix_user` (`id`),
  CONSTRAINT `FKo3lm4f58evjt4629l85fh28s6` FOREIGN KEY (`last_updated_by`) REFERENCES `matrix_user` (`id`),
  CONSTRAINT `FKow41y4hnwlcln8ystmhkifp3o` FOREIGN KEY (`entity_definition_id`) REFERENCES `entity_definition` (`id`),
  CONSTRAINT `property_definition_chk_1` CHECK ((`type` between 0 and 9))
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `property_definition`
--

LOCK TABLES `property_definition` WRITE;
/*!40000 ALTER TABLE `property_definition` DISABLE KEYS */;
INSERT INTO `property_definition` VALUES (_binary '\0',_binary '',_binary '\0',_binary '',NULL,NULL,0,_binary '',0,'2024-12-02 21:22:02.964000',1,1,1,'2024-12-02 21:22:02.964000',NULL,'','','Last Name',''),(_binary '\0',_binary '',_binary '\0',_binary '',NULL,NULL,1,_binary '',0,'2024-12-02 21:22:02.970000',1,1,2,'2024-12-02 21:22:02.970000',NULL,'','','First Name',''),(_binary '\0',_binary '',_binary '\0',_binary '\0',NULL,NULL,2,_binary '',4,'2024-12-02 21:22:02.974000',1,1,3,'2024-12-02 21:22:02.974000',NULL,'','','DOB',''),(_binary '\0',_binary '\0',_binary '\0',_binary '\0',NULL,NULL,3,_binary '\0',2,'2024-12-02 21:22:02.982000',1,1,4,'2024-12-02 21:22:02.982000',NULL,'','','Profile Pic',''),(_binary '\0',_binary '',_binary '\0',_binary '',NULL,NULL,0,_binary '',0,'2024-12-02 21:22:55.355000',1,2,5,'2024-12-02 21:22:55.355000',NULL,'','','Title',''),(_binary '\0',_binary '',_binary '\0',_binary '\0',NULL,4,1,_binary '',1,'2024-12-02 21:22:55.355000',1,2,6,'2024-12-02 21:22:55.355000',NULL,'','','Description',''),(_binary '\0',_binary '',_binary '',_binary '\0',NULL,NULL,2,_binary '',7,'2024-12-02 21:22:55.376000',1,2,7,'2024-12-02 21:22:55.376000',NULL,'','','Date Range','');
/*!40000 ALTER TABLE `property_definition` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `property_value`
--

DROP TABLE IF EXISTS `property_value`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property_value` (
  `create_time` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `entity_id` bigint NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `last_update_time` datetime(6) DEFAULT NULL,
  `last_updated_by` bigint DEFAULT NULL,
  `property_definition_id` bigint NOT NULL,
  `value_order` bigint DEFAULT NULL,
  `val` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKfnm8s6pb0pcyr2exfb9uac649` (`created_by`),
  KEY `FKsej3r9x0p277i4om268gseoao` (`last_updated_by`),
  KEY `FKalmqoxuw13a673ug2p21ow5o7` (`entity_id`),
  KEY `FK54m2smsyt0f5jft7ukhol5vt7` (`property_definition_id`),
  CONSTRAINT `FK54m2smsyt0f5jft7ukhol5vt7` FOREIGN KEY (`property_definition_id`) REFERENCES `property_definition` (`id`),
  CONSTRAINT `FKalmqoxuw13a673ug2p21ow5o7` FOREIGN KEY (`entity_id`) REFERENCES `matrix_entity` (`id`),
  CONSTRAINT `FKfnm8s6pb0pcyr2exfb9uac649` FOREIGN KEY (`created_by`) REFERENCES `matrix_user` (`id`),
  CONSTRAINT `FKsej3r9x0p277i4om268gseoao` FOREIGN KEY (`last_updated_by`) REFERENCES `matrix_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `property_value`
--

LOCK TABLES `property_value` WRITE;
/*!40000 ALTER TABLE `property_value` DISABLE KEYS */;
INSERT INTO `property_value` VALUES ('2024-12-02 21:24:29.000000',1,1,1,'2024-12-03 20:31:34.722000',1,1,0,'Allison'),('2024-12-02 21:24:29.004000',1,1,2,'2024-12-03 20:31:34.722000',1,2,0,'Daryl'),('2024-12-02 21:24:29.007000',1,1,3,'2024-12-03 20:31:34.728000',1,3,0,'1970-01-01T10:00:00.000Z'),('2024-12-02 21:24:29.009000',1,1,4,'2024-12-03 20:31:34.728000',1,4,0,'19'),('2024-12-02 21:25:03.858000',1,2,5,'2024-12-02 21:25:03.858000',NULL,5,0,'Event 1'),('2024-12-02 21:25:03.862000',1,2,6,'2024-12-02 21:25:03.862000',NULL,6,0,'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab'),('2024-12-02 21:25:03.867000',1,2,7,'2024-12-02 21:25:03.867000',NULL,7,0,'2024-12-31T09:10:00.000Z'),('2024-12-02 21:25:03.871000',1,2,8,'2024-12-02 21:25:03.871000',NULL,7,1,'2025-01-16T09:00:00.000Z');
/*!40000 ALTER TABLE `property_value` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task`
--

DROP TABLE IF EXISTS `task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task` (
  `status` tinyint DEFAULT NULL,
  `assigned_date_time` datetime(6) DEFAULT NULL,
  `assigned_to` bigint DEFAULT NULL,
  `case_id` bigint NOT NULL,
  `case_task_id` bigint DEFAULT NULL,
  `completed_date_time` datetime(6) DEFAULT NULL,
  `create_time` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `due_date_time` datetime(6) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `last_update_time` datetime(6) DEFAULT NULL,
  `last_updated_by` bigint DEFAULT NULL,
  `coverage_description` varchar(2048) DEFAULT NULL,
  `description` varchar(2048) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKch1bxos7l909du1u0y5b0v2ap` (`created_by`),
  KEY `FKl0knjrrm138977srrorn5ucnq` (`last_updated_by`),
  KEY `FKj6tj7g70sd3oliuu9dftyegso` (`assigned_to`),
  KEY `FKqwgn9oiuoc3sg14cvr8b6jmbm` (`case_id`),
  CONSTRAINT `FKch1bxos7l909du1u0y5b0v2ap` FOREIGN KEY (`created_by`) REFERENCES `matrix_user` (`id`),
  CONSTRAINT `FKj6tj7g70sd3oliuu9dftyegso` FOREIGN KEY (`assigned_to`) REFERENCES `matrix_user` (`id`),
  CONSTRAINT `FKl0knjrrm138977srrorn5ucnq` FOREIGN KEY (`last_updated_by`) REFERENCES `matrix_user` (`id`),
  CONSTRAINT `FKqwgn9oiuoc3sg14cvr8b6jmbm` FOREIGN KEY (`case_id`) REFERENCES `matrix_case` (`id`),
  CONSTRAINT `task_chk_1` CHECK ((`status` between 0 and 4))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task`
--

LOCK TABLES `task` WRITE;
/*!40000 ALTER TABLE `task` DISABLE KEYS */;
INSERT INTO `task` VALUES (0,'2024-12-02 21:27:29.794000',1,1,1,NULL,'2024-12-02 21:27:44.643000',1,'2024-12-11 00:00:00.000000',1,'2024-12-02 21:27:44.643000',NULL,'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab','Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab','Task 1');
/*!40000 ALTER TABLE `task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_entity`
--

DROP TABLE IF EXISTS `task_entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_entity` (
  `create_time` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `last_update_time` datetime(6) DEFAULT NULL,
  `last_updated_by` bigint DEFAULT NULL,
  `matrix_entity_id` bigint DEFAULT NULL,
  `task_id` bigint DEFAULT NULL,
  `description` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKfq069ohfj2pcak6ua3crp1bdm` (`created_by`),
  KEY `FK3rnl96ymld0eyc588pl75mjtm` (`last_updated_by`),
  KEY `FKfaxf2w22w42qanm3so41lxnnk` (`matrix_entity_id`),
  KEY `FK6cm52pj59vtxlressgt9m0loa` (`task_id`),
  CONSTRAINT `FK3rnl96ymld0eyc588pl75mjtm` FOREIGN KEY (`last_updated_by`) REFERENCES `matrix_user` (`id`),
  CONSTRAINT `FK6cm52pj59vtxlressgt9m0loa` FOREIGN KEY (`task_id`) REFERENCES `task` (`id`),
  CONSTRAINT `FKfaxf2w22w42qanm3so41lxnnk` FOREIGN KEY (`matrix_entity_id`) REFERENCES `matrix_entity` (`id`),
  CONSTRAINT `FKfq069ohfj2pcak6ua3crp1bdm` FOREIGN KEY (`created_by`) REFERENCES `matrix_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_entity`
--

LOCK TABLES `task_entity` WRITE;
/*!40000 ALTER TABLE `task_entity` DISABLE KEYS */;
INSERT INTO `task_entity` VALUES ('2024-12-02 21:28:34.541000',1,1,'2024-12-02 21:28:34.541000',NULL,1,1,'Mentioned in interview');
/*!40000 ALTER TABLE `task_entity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_file`
--

DROP TABLE IF EXISTS `task_file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_file` (
  `create_time` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `last_update_time` datetime(6) DEFAULT NULL,
  `last_updated_by` bigint DEFAULT NULL,
  `matrix_file_id` bigint DEFAULT NULL,
  `task_id` bigint DEFAULT NULL,
  `description` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKf3e571mbfhgbolwh31xwffla9` (`created_by`),
  KEY `FKrxrsl7qujopavfjhcb8vjxy68` (`last_updated_by`),
  KEY `FK49leprxgdwe33ebvgkms2limo` (`matrix_file_id`),
  KEY `FKk9ikv3hs4cyrgi4ti09b02px0` (`task_id`),
  CONSTRAINT `FK49leprxgdwe33ebvgkms2limo` FOREIGN KEY (`matrix_file_id`) REFERENCES `mfile` (`id`),
  CONSTRAINT `FKf3e571mbfhgbolwh31xwffla9` FOREIGN KEY (`created_by`) REFERENCES `matrix_user` (`id`),
  CONSTRAINT `FKk9ikv3hs4cyrgi4ti09b02px0` FOREIGN KEY (`task_id`) REFERENCES `task` (`id`),
  CONSTRAINT `FKrxrsl7qujopavfjhcb8vjxy68` FOREIGN KEY (`last_updated_by`) REFERENCES `matrix_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_file`
--

LOCK TABLES `task_file` WRITE;
/*!40000 ALTER TABLE `task_file` DISABLE KEYS */;
INSERT INTO `task_file` VALUES ('2024-12-02 21:29:07.922000',1,1,'2024-12-02 21:29:07.922000',NULL,3,1,NULL);
/*!40000 ALTER TABLE `task_file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `timeline`
--

DROP TABLE IF EXISTS `timeline`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timeline` (
  `create_time` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `last_update_time` datetime(6) DEFAULT NULL,
  `last_updated_by` bigint DEFAULT NULL,
  `matrix_case_id` bigint NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1vwx10j7sjwxw67rwxuena4wm` (`created_by`),
  KEY `FKdcdpmdxt8wlrofk5ji8suptbx` (`last_updated_by`),
  KEY `FKetmg3o9fjj3ljgmb1t5877w2m` (`matrix_case_id`),
  CONSTRAINT `FK1vwx10j7sjwxw67rwxuena4wm` FOREIGN KEY (`created_by`) REFERENCES `matrix_user` (`id`),
  CONSTRAINT `FKdcdpmdxt8wlrofk5ji8suptbx` FOREIGN KEY (`last_updated_by`) REFERENCES `matrix_user` (`id`),
  CONSTRAINT `FKetmg3o9fjj3ljgmb1t5877w2m` FOREIGN KEY (`matrix_case_id`) REFERENCES `matrix_case` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timeline`
--

LOCK TABLES `timeline` WRITE;
/*!40000 ALTER TABLE `timeline` DISABLE KEYS */;
/*!40000 ALTER TABLE `timeline` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `timeline_entity`
--

DROP TABLE IF EXISTS `timeline_entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timeline_entity` (
  `entity_id` bigint NOT NULL,
  `timeline_id` bigint NOT NULL,
  KEY `FK1pumib6dr3b1n3ckjr1hnoa4c` (`entity_id`),
  KEY `FKd7i44lhw5vxoo037oaru9yc8t` (`timeline_id`),
  CONSTRAINT `FK1pumib6dr3b1n3ckjr1hnoa4c` FOREIGN KEY (`entity_id`) REFERENCES `matrix_entity` (`id`),
  CONSTRAINT `FKd7i44lhw5vxoo037oaru9yc8t` FOREIGN KEY (`timeline_id`) REFERENCES `timeline` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timeline_entity`
--

LOCK TABLES `timeline_entity` WRITE;
/*!40000 ALTER TABLE `timeline_entity` DISABLE KEYS */;
/*!40000 ALTER TABLE `timeline_entity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_case_role`
--

DROP TABLE IF EXISTS `user_case_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_case_role` (
  `case_role` tinyint DEFAULT NULL,
  `case_id` bigint NOT NULL,
  `create_time` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `last_update_time` datetime(6) DEFAULT NULL,
  `last_updated_by` bigint DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`case_id`,`user_id`),
  KEY `FK1ixxe2hov5gn99cb7hd4ub8a1` (`created_by`),
  KEY `FKapv9msjuhyu9legux2aj6cjbk` (`last_updated_by`),
  KEY `FKr5o9ac5ogscytdwaeatnpjcum` (`user_id`),
  CONSTRAINT `FK1ixxe2hov5gn99cb7hd4ub8a1` FOREIGN KEY (`created_by`) REFERENCES `matrix_user` (`id`),
  CONSTRAINT `FK77pg6j5a81otokkhb0yqqhou` FOREIGN KEY (`case_id`) REFERENCES `matrix_case` (`id`),
  CONSTRAINT `FKapv9msjuhyu9legux2aj6cjbk` FOREIGN KEY (`last_updated_by`) REFERENCES `matrix_user` (`id`),
  CONSTRAINT `FKr5o9ac5ogscytdwaeatnpjcum` FOREIGN KEY (`user_id`) REFERENCES `matrix_user` (`id`),
  CONSTRAINT `user_case_role_chk_1` CHECK ((`case_role` between 0 and 3))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_case_role`
--

LOCK TABLES `user_case_role` WRITE;
/*!40000 ALTER TABLE `user_case_role` DISABLE KEYS */;
INSERT INTO `user_case_role` VALUES (0,1,'2024-12-02 21:23:51.770000',1,'2024-12-02 21:23:51.771000',NULL,1);
/*!40000 ALTER TABLE `user_case_role` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-03 20:35:16
