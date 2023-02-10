-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 10, 2023 at 04:06 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.0.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `centercore`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `accountID` int(11) NOT NULL,
  `userName` varchar(20) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(255) NOT NULL,
  `timestamp` int(11) NOT NULL,
  `stars` int(11) NOT NULL DEFAULT 0,
  `diamonds` int(11) NOT NULL DEFAULT 0,
  `coins` int(11) NOT NULL DEFAULT 0,
  `silverCoins` int(11) NOT NULL DEFAULT 0,
  `demons` int(11) NOT NULL DEFAULT 0,
  `cps` int(11) NOT NULL DEFAULT 0,
  `orbs` int(11) NOT NULL DEFAULT 0,
  `cube` int(11) NOT NULL DEFAULT 1,
  `ship` int(11) NOT NULL DEFAULT 1,
  `ball` int(11) NOT NULL DEFAULT 1,
  `ufo` int(11) NOT NULL DEFAULT 1,
  `wave` int(11) NOT NULL DEFAULT 1,
  `robot` int(11) NOT NULL DEFAULT 1,
  `spider` int(11) NOT NULL DEFAULT 1,
  `glow` int(11) NOT NULL DEFAULT 0,
  `youtube` varchar(255) NOT NULL DEFAULT '',
  `twitch` varchar(255) NOT NULL DEFAULT '',
  `twitter` varchar(255) NOT NULL DEFAULT '',
  `color1` int(11) NOT NULL DEFAULT 0,
  `color2` int(11) NOT NULL DEFAULT 3,
  `messageState` int(11) NOT NULL DEFAULT 0,
  `friendsState` int(11) NOT NULL DEFAULT 0,
  `commentHistoryState` int(11) NOT NULL DEFAULT 0,
  `special` int(11) NOT NULL DEFAULT 0,
  `explosion` int(11) NOT NULL DEFAULT 0,
  `icon` int(11) NOT NULL DEFAULT 0,
  `iconType` int(11) NOT NULL DEFAULT 0,
  `chest1time` int(11) NOT NULL DEFAULT 0,
  `chest1count` int(11) NOT NULL DEFAULT 0,
  `chest2time` int(11) NOT NULL DEFAULT 0,
  `chest2count` int(11) NOT NULL DEFAULT 0,
  `completedLevels` int(11) NOT NULL DEFAULT 0,
  `isBanned` int(1) NOT NULL DEFAULT 0,
  `isActive` int(1) NOT NULL DEFAULT 1,
  `verifyCode` int(10) NOT NULL,
  `token` varchar(20) NOT NULL,
  `avatar` varchar(255) NOT NULL DEFAULT '/content/avatars/default.png',
  `modType` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `acc_comments`
--

CREATE TABLE `acc_comments` (
  `accCommentID` int(11) NOT NULL,
  `comment` varchar(255) NOT NULL,
  `likes` int(11) NOT NULL DEFAULT 0,
  `accountID` int(11) NOT NULL,
  `timestamp` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `blocks`
--

CREATE TABLE `blocks` (
  `blockID` int(11) NOT NULL,
  `fromID` int(11) NOT NULL,
  `toID` int(11) NOT NULL,
  `timestamp` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `commentID` int(11) NOT NULL,
  `levelID` int(11) NOT NULL,
  `authorID` int(11) NOT NULL,
  `comment` varchar(255) NOT NULL,
  `percent` int(11) NOT NULL DEFAULT 0,
  `likes` int(11) NOT NULL DEFAULT 0,
  `timestamp` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `daily`
--

CREATE TABLE `daily` (
  `dailyID` int(11) NOT NULL,
  `levelID` int(11) NOT NULL,
  `weekly` int(11) NOT NULL DEFAULT 0,
  `assignTimestamp` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `friends`
--

CREATE TABLE `friends` (
  `fID` int(11) NOT NULL,
  `user1` int(11) NOT NULL,
  `user2` int(11) NOT NULL,
  `isNew1` int(11) NOT NULL DEFAULT 1,
  `isNew2` int(11) NOT NULL DEFAULT 1,
  `timestamp` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `friend_reqs`
--

CREATE TABLE `friend_reqs` (
  `freqID` int(11) NOT NULL,
  `fromID` int(11) NOT NULL,
  `toID` int(11) NOT NULL,
  `message` varchar(255) NOT NULL,
  `isNew` int(11) NOT NULL DEFAULT 1,
  `timestamp` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gauntlets`
--

CREATE TABLE `gauntlets` (
  `gauntletID` int(11) NOT NULL,
  `level1` int(11) NOT NULL,
  `level2` int(11) NOT NULL,
  `level3` int(11) NOT NULL,
  `level4` int(11) NOT NULL,
  `level5` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `levels`
--

CREATE TABLE `levels` (
  `levelID` int(11) NOT NULL,
  `userName` varchar(20) NOT NULL,
  `authorID` int(11) NOT NULL,
  `timestamp` int(11) NOT NULL,
  `updateTimestamp` int(11) NOT NULL DEFAULT 0,
  `rateTimestamp` int(11) NOT NULL DEFAULT 0,
  `difficulty` int(11) NOT NULL DEFAULT 0,
  `stars` int(11) NOT NULL DEFAULT 0,
  `demonRate` int(11) NOT NULL DEFAULT 0,
  `autoRate` int(11) NOT NULL DEFAULT 0,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `featured` int(11) NOT NULL DEFAULT 0,
  `epic` int(11) NOT NULL DEFAULT 0,
  `version` int(11) NOT NULL DEFAULT 1,
  `length` int(11) NOT NULL,
  `song` int(11) NOT NULL,
  `customSong` int(11) NOT NULL DEFAULT 0,
  `objects` int(11) NOT NULL,
  `downloads` int(11) NOT NULL DEFAULT 0,
  `likes` int(11) NOT NULL DEFAULT 0,
  `password` int(11) NOT NULL DEFAULT 0,
  `original` int(11) NOT NULL,
  `twoPlayer` int(11) NOT NULL,
  `coins` int(11) NOT NULL,
  `requestedStars` int(11) NOT NULL,
  `unlisted` int(11) NOT NULL DEFAULT 0,
  `ldm` int(11) NOT NULL,
  `verifiedCoins` int(11) NOT NULL DEFAULT 0,
  `extraString` varchar(255) NOT NULL,
  `levelInfo` varchar(255) NOT NULL,
  `wt` int(11) NOT NULL DEFAULT 0,
  `wt2` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `likeID` int(11) NOT NULL,
  `fromID` int(11) NOT NULL,
  `targetID` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `timestamp` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mappacks`
--

CREATE TABLE `mappacks` (
  `mappackID` int(11) NOT NULL,
  `levels` varchar(255) NOT NULL COMMENT 'list of level IDs separated by ","\r\nexample: 1,5,10 etc...',
  `name` varchar(255) NOT NULL,
  `stars` int(11) NOT NULL,
  `coins` int(11) NOT NULL,
  `difficulty` int(11) NOT NULL COMMENT '0 - auto\r\n1 - easy\r\n2 - normal\r\n3 - hard\r\n4 - harder\r\n5 - insane\r\n6 - hard demon\r\n7 - easy demon\r\n8 - medium demon\r\n9 - insane demon\r\n10 - extreme demon',
  `textColor` varchar(45) NOT NULL DEFAULT '0,0,0',
  `barColor` varchar(45) NOT NULL DEFAULT '0,0,0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `messageID` int(11) NOT NULL,
  `fromID` int(11) NOT NULL,
  `toID` int(11) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `body` varchar(255) NOT NULL,
  `isRead` int(11) NOT NULL DEFAULT 0,
  `timestamp` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quests`
--

CREATE TABLE `quests` (
  `questID` int(11) NOT NULL,
  `type` int(11) NOT NULL COMMENT '1 - orbs\r\n2 - coins\r\n3 - stars',
  `amount` int(11) NOT NULL,
  `reward` int(11) NOT NULL,
  `name` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `reportID` int(11) NOT NULL,
  `levelID` int(11) NOT NULL,
  `timestamp` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `songs`
--

CREATE TABLE `songs` (
  `songID` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `authorYoutube` varchar(255) NOT NULL DEFAULT '',
  `youtube` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `size` float NOT NULL,
  `isBanned` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `suggestions`
--

CREATE TABLE `suggestions` (
  `suggestID` int(11) NOT NULL,
  `fromID` int(11) NOT NULL,
  `levelID` int(11) NOT NULL,
  `stars` int(11) NOT NULL,
  `timestamp` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`accountID`),
  ADD UNIQUE KEY `userName` (`userName`),
  ADD UNIQUE KEY `token` (`token`);

--
-- Indexes for table `acc_comments`
--
ALTER TABLE `acc_comments`
  ADD PRIMARY KEY (`accCommentID`);

--
-- Indexes for table `blocks`
--
ALTER TABLE `blocks`
  ADD PRIMARY KEY (`blockID`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`commentID`);

--
-- Indexes for table `daily`
--
ALTER TABLE `daily`
  ADD PRIMARY KEY (`dailyID`);

--
-- Indexes for table `friends`
--
ALTER TABLE `friends`
  ADD PRIMARY KEY (`fID`);

--
-- Indexes for table `friend_reqs`
--
ALTER TABLE `friend_reqs`
  ADD PRIMARY KEY (`freqID`);

--
-- Indexes for table `gauntlets`
--
ALTER TABLE `gauntlets`
  ADD PRIMARY KEY (`gauntletID`);

--
-- Indexes for table `levels`
--
ALTER TABLE `levels`
  ADD PRIMARY KEY (`levelID`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`likeID`);

--
-- Indexes for table `mappacks`
--
ALTER TABLE `mappacks`
  ADD PRIMARY KEY (`mappackID`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`messageID`);

--
-- Indexes for table `quests`
--
ALTER TABLE `quests`
  ADD PRIMARY KEY (`questID`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`reportID`);

--
-- Indexes for table `songs`
--
ALTER TABLE `songs`
  ADD PRIMARY KEY (`songID`);

--
-- Indexes for table `suggestions`
--
ALTER TABLE `suggestions`
  ADD PRIMARY KEY (`suggestID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `accountID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `acc_comments`
--
ALTER TABLE `acc_comments`
  MODIFY `accCommentID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `blocks`
--
ALTER TABLE `blocks`
  MODIFY `blockID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `commentID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `daily`
--
ALTER TABLE `daily`
  MODIFY `dailyID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `friends`
--
ALTER TABLE `friends`
  MODIFY `fID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `friend_reqs`
--
ALTER TABLE `friend_reqs`
  MODIFY `freqID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gauntlets`
--
ALTER TABLE `gauntlets`
  MODIFY `gauntletID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `levels`
--
ALTER TABLE `levels`
  MODIFY `levelID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `likeID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mappacks`
--
ALTER TABLE `mappacks`
  MODIFY `mappackID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `messageID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quests`
--
ALTER TABLE `quests`
  MODIFY `questID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `reportID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `songs`
--
ALTER TABLE `songs`
  MODIFY `songID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `suggestions`
--
ALTER TABLE `suggestions`
  MODIFY `suggestID` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
