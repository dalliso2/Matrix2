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
  KEY `FKcg5nqt66wp78gnhrvyj650rou` (`created_by`),
  KEY `FKocl5d10jqagot4ipi5sqdx440` (`last_updated_by`),
  CONSTRAINT `FKcg5nqt66wp78gnhrvyj650rou` FOREIGN KEY (`created_by`) REFERENCES `matrix_user` (`id`),
  CONSTRAINT `FKocl5d10jqagot4ipi5sqdx440` FOREIGN KEY (`last_updated_by`) REFERENCES `matrix_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agency`
--

LOCK TABLES `agency` WRITE;
/*!40000 ALTER TABLE `agency` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entity_definition`
--

LOCK TABLES `entity_definition` WRITE;
/*!40000 ALTER TABLE `entity_definition` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entity_file`
--

LOCK TABLES `entity_file` WRITE;
/*!40000 ALTER TABLE `entity_file` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entity_relationship`
--

LOCK TABLES `entity_relationship` WRITE;
/*!40000 ALTER TABLE `entity_relationship` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `link_chart`
--

LOCK TABLES `link_chart` WRITE;
/*!40000 ALTER TABLE `link_chart` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `matrix_case`
--

LOCK TABLES `matrix_case` WRITE;
/*!40000 ALTER TABLE `matrix_case` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `matrix_entity`
--

LOCK TABLES `matrix_entity` WRITE;
/*!40000 ALTER TABLE `matrix_entity` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


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
  UNIQUE KEY `UKtqq729rbt02n81lye1o2t1f9e` (`matrix_case_id`),
  KEY `FKpeaqr3phrx4y9xlysqvoyavbs` (`created_by`),
  KEY `FKgbx8vgeybkgyjhcei9uj9oqbw` (`last_updated_by`),
  CONSTRAINT `FK55r2469jd4y2f81y01i81l4f0` FOREIGN KEY (`matrix_case_id`) REFERENCES `matrix_case` (`id`),
  CONSTRAINT `FKgbx8vgeybkgyjhcei9uj9oqbw` FOREIGN KEY (`last_updated_by`) REFERENCES `matrix_user` (`id`),
  CONSTRAINT `FKpeaqr3phrx4y9xlysqvoyavbs` FOREIGN KEY (`created_by`) REFERENCES `matrix_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mfile`
--

LOCK TABLES `mfile` WRITE;
/*!40000 ALTER TABLE `mfile` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `property_definition`
--

LOCK TABLES `property_definition` WRITE;
/*!40000 ALTER TABLE `property_definition` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `property_value`
--

LOCK TABLES `property_value` WRITE;
/*!40000 ALTER TABLE `property_value` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task`
--

LOCK TABLES `task` WRITE;
/*!40000 ALTER TABLE `task` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_entity`
--

LOCK TABLES `task_entity` WRITE;
/*!40000 ALTER TABLE `task_entity` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_file`
--

LOCK TABLES `task_file` WRITE;
/*!40000 ALTER TABLE `task_file` DISABLE KEYS */;
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

-- Dump completed on 2024-11-17 23:34:28

--
-- Dumping data for table `matrix_user`
--

INSERT INTO `matrix_user` VALUES (_binary '',_binary '',_binary '',NULL,NULL,NULL,1,'2024-04-19 00:27:00.228000',1,NULL,'2342342342','admin@fbi.gov','fist','last','$2a$10$C.f97.fw918rEaIfGymG0OImBM2LWHJozslh8eUei5ppbTZ3Bj6Ma','admin','3455673456');


