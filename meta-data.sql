#
#
#
CREATE TABLE pkgs (
    pkgId int NOT NULL AUTO_INCREMENT,
    pkgName varchar(255) NOT NULL,
    pkgDesc varchar(255),
    pkgVersion varchar(50),
    keywords TEXT,
    repoUrl varchar(255),
    codeUrl varchar(255),
    comments TEXT,
    PRIMARY KEY (pkgId)
);

#
#
#
CREATE TABLE keywords (
    tagName varchar(255) NOT NULL,
    howMany INT,
    comments TEXT,
    PRIMARY KEY (tagName)
);

INSERT INTO keywords (tagName, comments) 
SELECT SUBSTRING_INDEX(keywords, ',', 1), comments FROM pkgs
ON DUPLICATE KEY UPDATE howMany = howMany + 1;