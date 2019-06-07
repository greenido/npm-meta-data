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